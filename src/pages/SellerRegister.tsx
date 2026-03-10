import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Link } from "react-router-dom";

const SellerRegister = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl mb-2">Register as a Seller</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Join India's trusted pet marketplace. List your pets and reach thousands of verified buyers.
        </p>

        {submitted ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center shadow-card">
            <h2 className="font-display text-2xl mb-3">Registration Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Our team will review your application and get back to you within 24 hours.
            </p>
            <Link
              to="/"
              className="inline-flex px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-card rounded-lg border border-border p-6 shadow-card space-y-4"
          >
            {[
              { label: "Full Name", type: "text" },
              { label: "Email", type: "email" },
              { label: "Phone Number", type: "tel" },
              { label: "City", type: "text" },
              { label: "State", type: "text" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{field.label}</label>
                <input
                  type={field.type}
                  required
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Experience</label>
              <textarea
                rows={3}
                placeholder="Tell us about your breeding experience..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Submit Registration
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SellerRegister;
