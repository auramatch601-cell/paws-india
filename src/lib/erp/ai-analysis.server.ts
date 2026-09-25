import { z } from "zod";
import { loadFinancials, loadOverview, type Row } from "@/lib/erp/data.server";

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

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "riskLevel", "estimatedExposure", "currency", "findings", "recommendations", "limitations"],
  properties: {
    summary: { type: "string" },
    riskLevel: { type: "string", enum: ["critical", "high", "moderate", "low"] },
    estimatedExposure: { type: "number" },
    currency: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "category", "severity", "amount", "currency", "evidence", "recommendation", "confidence"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          category: { type: "string" },
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          amount: { type: "number" },
          currency: { type: "string" },
          evidence: { type: "string" },
          recommendation: { type: "string" },
          confidence: { type: "number" },
        },
      },
    },
    recommendations: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
  },
} as const;

type GatewayEvent = {
  type?: string;
  delta?: string;
  response?: { output_text?: string; output?: Array<{ content?: Array<{ type?: string; refusal?: string }> }> };
  error?: { message?: string };
};

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

function safeGatewayMessage(status: number, body: unknown) {
  const message =
    typeof body === "object" && body !== null && "message" in body && typeof body.message === "string"
      ? body.message
      : typeof body === "object" && body !== null && "error" in body && typeof body.error === "object" && body.error !== null && "message" in body.error && typeof body.error.message === "string"
        ? body.error.message
        : null;

  if (message) return message;
  if (status === 401) return "AI analysis is not configured yet. Please contact your workspace administrator.";
  if (status === 402) return "AI analysis is paused because this workspace has no available AI credits.";
  if (status === 403) return "AI analysis is not available for this workspace.";
  if (status === 404) return "The AI analysis service is unavailable right now.";
  return `AI analysis could not be completed (HTTP ${status}).`;
}

async function readGatewayStream(response: Response) {
  if (!response.body) throw new Error("AI analysis returned an empty response.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let completed: GatewayEvent["response"];
  let refusal: string | null = null;

  const consume = (raw: string) => {
    const data = raw
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");
    if (!data || data === "[DONE]") return;
    let event: GatewayEvent;
    try {
      event = JSON.parse(data) as GatewayEvent;
    } catch {
      return;
    }
    if (event.type === "response.output_text.delta" && event.delta) text += event.delta;
    if (event.type === "response.refusal.delta" && event.delta) refusal = (refusal ?? "") + event.delta;
    if (event.type === "response.completed") completed = event.response;
    if (event.type === "response.failed") throw new Error(event.error?.message ?? "AI analysis failed.");
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) consume(frame);
    if (done) break;
  }
  if (buffer.trim()) consume(buffer);

  const completedText = completed?.output_text?.trim();
  if (!text.trim() && completedText) text = completedText;
  if (!text.trim() && refusal) throw new Error(refusal);
  if (!text.trim()) throw new Error("AI analysis returned no usable result. Please try again.");
  return text;
}

async function callGateway(prompt: string, initialRunId?: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI analysis is not configured yet. Please contact your workspace administrator.");

  let runId = initialRunId?.trim() || undefined;
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
        ...(runId ? { "X-Lovable-AIG-Run-ID": runId } : {}),
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: "You are AutoAudit, an expert financial controls analyst. Analyze only the supplied imported ERP records. Do not invent transactions. Identify duplicate, overpaid, misapplied, unusual, overdue, tax, vendor-concentration, and control-breakage risks. Keep findings concise and evidence-based. Return only the requested JSON object." }],
          },
          { role: "user", content: [{ type: "input_text", text: `Analyze this imported financial dataset for leakage and control weaknesses. Existing rule-based findings are included as evidence, but you may identify additional patterns. Estimate exposure without double-counting overlapping findings. If evidence is insufficient, say so in limitations.\n\n${prompt}` }] },
        ],
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        text: { format: { type: "json_schema", name: "leakage_analysis", strict: true, schema: responseSchema } },
      }),
    });
    runId ??= response.headers.get("X-Lovable-AIG-Run-ID")?.trim() || undefined;

    if (response.ok) return readGatewayStream(response);
    const raw = await response.text();
    let body: unknown = raw;
    try {
      body = JSON.parse(raw) as unknown;
    } catch {
      // Keep the plain response text as a fallback message.
    }
    const error = new Error(safeGatewayMessage(response.status, body));
    lastError = error;
    if (response.status !== 429 && response.status < 500) throw error;
    if (response.status >= 500 && response.status < 600 && attempt === 2) throw error;
    if (attempt < 2) {
      const retryAfter = Number(response.headers.get("Retry-After"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastError ?? new Error("AI analysis could not be completed.");
}

export async function analyzeLeakageFor(userId: string, initialRunId?: string): Promise<AiLeakageAnalysis> {
  const [financials, overview] = await Promise.all([loadFinancials(userId), loadOverview(userId)]);
  if (!financials.connected) throw new Error("Import financial records before running an AI leakage analysis.");

  const raw = await callGateway(buildPrompt(financials, overview), initialRunId);
  try {
    return leakageAnalysisSchema.parse(JSON.parse(raw));
  } catch (error) {
    console.error("AI leakage analysis returned invalid structured output", error);
    throw new Error("AI analysis returned an invalid result. Please try again.");
  }
}