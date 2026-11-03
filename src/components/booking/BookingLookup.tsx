"use client";

import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";
import Field from "@/components/ui/Field";
import { Price } from "@/components/currency/CurrencyProvider";

interface Result {
  reference: string;
  tourTitle: string;
  startDate: string | null;
  adults: number;
  children: number;
  status: string;
  statusLabel: string;
  totalUSD: number;
  depositUSD: number;
}

const STATUS_STYLES: Record<string, string> = {
  requested: "bg-amber-50 text-amber-800",
  confirmed: "bg-fly-cyan-50 text-fly-cyan-800",
  deposit_paid: "bg-emerald-50 text-emerald-700",
  paid: "bg-emerald-50 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function BookingLookup() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
        <Field id="lk-ref" label="Booking reference">
          <input
            id="lk-ref"
            required
            placeholder="AWT-7K2QX"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            className="field-input font-mono uppercase tracking-wider"
          />
        </Field>
        <Field id="lk-email" label="Email used for the booking">
          <input id="lk-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
        </Field>
        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Find my booking
        </button>
      </form>

      {result && (
        <div className="card mt-6 p-6 sm:p-8" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-slate-500">{result.reference}</p>
              <h2 className="mt-1 text-xl font-bold text-fly-navy-900">{result.tourTitle}</h2>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[result.status] ?? "bg-slate-100"}`}>
              {result.statusLabel}
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Start date</dt>
              <dd className="font-medium text-slate-900">{result.startDate ?? "To be confirmed"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Travellers</dt>
              <dd className="font-medium text-slate-900">
                {result.adults} adult{result.adults === 1 ? "" : "s"}
                {result.children ? `, ${result.children} child${result.children === 1 ? "" : "ren"}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Estimated total</dt>
              <dd className="font-medium text-slate-900">
                <Price usd={result.totalUSD} />
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Deposit</dt>
              <dd className="font-medium text-slate-900">
                <Price usd={result.depositUSD} />
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-slate-500">Questions? Reply to your confirmation email and quote your reference.</p>
        </div>
      )}
    </div>
  );
}
