import { z } from "zod";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { loadFinancials, loadOverview, type Row } from "@/lib/erp/data.server";
import { createLovableResponsesModel } from "@/lib/erp/ai-gateway-responses.ts";

const leakageAnalysisSchema = z.object({
  summary: z.string().min(1),
  riskLevel: z.enum(["critical", "high", "moderate", "low"]),
  estimatedExposure: z.number().finite().nonnegative(),
  currency: z.string().min(1).max(8),
  findings: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        category: z.string().min(1),
        severity: z.enum(["critical", "high", "medium", "low"]),
        amount: z.number().finite().nonnegative(),
        currency: z.string().min(1).max(8),
        evidence: z.string().min(1),
        recommendation: z.string().min(1),
        confidence: z.number().min(0).max(1),
      }),
    )
    .max(8),
  recommendations: z.array(z.string().min(1)).max(6),
  limitations: z.array(z.string().min(1)).max(5),
});

export type AiLeakageAnalysis = z.infer<typeof leakageAnalysisSchema>;

function compactRow(row: Row, fields: string[]) {
  return Object.fromEntries(fields.map((field) => [field, row[field] ?? null]));
}

function buildPrompt(
  financials: Awaited<ReturnType<typeof loadFinancials>>,
  overview: Awaited<ReturnType<typeof loadOverview>>,
) {
  const context = {
    currency: overview.currencyCode,
    totals: overview.totals,
    invoices: financials.invoices.slice(0, 80).map((row) =>
      compactRow(row, ["external_id", "invoice_number", "vendor_name", "issue_date", "due_date", "amount", "tax_amount", "amount_paid", "currency", "status", "type"]),
    ),
    payments: financials.payments.slice(0, 80).map((row) =>
      compactRow(row, ["external_id", "reference", "invoice_external_id", "vendor_name", "paid_date", "amount", "currency", "method", "status"]),
    ),
    vendors: overview.vendorSummary.slice(0, 40).map((vendor) => ({
      name: vendor.name,
      status: vendor.status,
      spend: vendor.spend,
      invoices: vendor.invoices,
      outstanding: vendor.outstanding,
      existingFindings: vendor.leaks,
    })),
    ruleBasedFindings: overview.leaks.slice(0, 60).map((leak) => ({
      type: leak.type,
      title: leak.title,
      vendor: leak.vendor,
      amount: leak.amount,
      currency: leak.currency,
      severity: leak.severity,
      detail: leak.detail,
      date: leak.date,
    })),
  };

  return JSON.stringify(context);
}

function gatewayStatus(error: unknown) {
  if (typeof error !== "object" || error === null) return undefined;
  const value = error as { statusCode?: unknown; status?: unknown };
  const status = value.statusCode ?? value.status;
  return typeof status === "number" ? status : undefined;
}

function gatewayRetryAfter(error: unknown) {
  if (typeof error !== "object" || error === null) return undefined;
  const value = error as { responseHeaders?: HeadersInit };
  const retryAfter = new Headers(value.responseHeaders).get("Retry-After");
  const seconds = retryAfter ? Number(retryAfter) : NaN;
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;
}

function userSafeGatewayError(error: unknown) {
  const status = gatewayStatus(error);
  const message = error instanceof Error ? error.message : "AI analysis could not be completed.";
  if (status === 401) return "AI analysis is not configured yet. Please contact your workspace administrator.";
  if (status === 402 || status === 403 || status === 404) return message;
  if (status && status >= 500) return "AI analysis is temporarily unavailable. Please try again.";
  return message;
}

async function callGateway(request: Request, prompt: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI analysis is not configured yet. Please contact your workspace administrator.");

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = streamText({
        model: createLovableResponsesModel(request, apiKey, "openai/gpt-6-astra"),
        system: "You are AutoAudit, an expert financial controls analyst. Analyze only the supplied imported ERP records. Do not invent transactions. Identify duplicate, overpaid, misapplied, unusual, overdue, tax, vendor-concentration, and control-breakage risks. Keep findings concise and evidence-based.",
        prompt: `Return a structured leakage assessment for this imported financial dataset. Existing rule-based findings are evidence, but you may identify additional patterns. Estimate exposure without double-counting overlapping findings. If evidence is insufficient, say so in limitations.\n\n${prompt}`,
        output: Output.object({ schema: leakageAnalysisSchema }),
        abortSignal: request.signal,
        maxRetries: 0,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      return await result.output;
    } catch (error) {
      if (error instanceof NoObjectGeneratedError) {
        throw new Error("AI analysis returned an incomplete result. Please try again.");
      }
      const status = gatewayStatus(error);
      lastError = new Error(userSafeGatewayError(error));
      if (status !== 429 && !(status && status >= 500 && status <= 599)) throw lastError;
      if (attempt === 2) throw lastError;
      const waitMs = gatewayRetryAfter(error) ?? 400 * 2 ** attempt + Math.floor(Math.random() * 200);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastError ?? new Error("AI analysis could not be completed.");
}

export async function analyzeLeakageFor(userId: string, request: Request): Promise<AiLeakageAnalysis> {
  const [financials, overview] = await Promise.all([loadFinancials(userId), loadOverview(userId)]);
  if (!financials.connected) throw new Error("Import financial records before running an AI leakage analysis.");

  return callGateway(request, buildPrompt(financials, overview));
}