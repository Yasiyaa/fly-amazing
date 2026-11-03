"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { X, CheckCircle2, Send, Loader2 } from "lucide-react";
import Field from "@/components/ui/Field";
import { Price } from "@/components/currency/CurrencyProvider";
import { useOverlay } from "@/lib/useOverlay";
import type { VehicleId } from "@/lib/pricing";

export interface RequestStop {
  destinationId: string;
  destinationName: string;
  nights: number;
  hotelId: string | null;
  hotelName: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** "custom" from the Tour Architect, "planner" from an AI-drafted itinerary. */
  kind: "custom" | "planner";
  title?: string;
  stops: RequestStop[];
  adults: number;
  childCount: number;
  vehicle: VehicleId;
  totalUSD: number;
  defaultStartDate?: string | null;
}

const EMPTY = { name: "", email: "", phone: "", country: "", startDate: "", notes: "", website: "", agree: false };

export default function RequestTripModal({ isOpen, onClose, kind, title, stops, adults, childCount, vehicle, totalUSD, defaultStartDate }: Props) {
  const [form, setForm] = useState({ ...EMPTY, startDate: defaultStartDate ?? "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const handleClose = useCallback(() => {
    if (loading) return;
    onClose();
    if (reference) {
      setForm(EMPTY);
      setReference("");
    }
    setError("");
  }, [loading, onClose, reference]);
  useOverlay(isOpen, handleClose);
  if (!isOpen) return null;

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      setError("Please accept the booking terms.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          stops: stops.map((s) => ({ destinationId: s.destinationId, nights: s.nights, hotelId: s.hotelId ?? undefined })),
          adults,
          children: childCount,
          vehicle,
          startDate: form.startDate,
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          notes: form.notes,
          website: form.website,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "We couldn't send your request. Please try again.");
      setReference(json.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="request-title">
      <div className="fixed inset-0 bg-fly-navy-950/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative flex min-h-full items-end justify-center sm:items-center sm:p-6">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
          <div className="relative border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="eyebrow">{reference ? "Request received" : "Request this trip"}</p>
            <h3 id="request-title" className="mt-2 pr-10 text-2xl font-bold text-fly-navy-900 sm:text-3xl">
              {reference ? "Thank you, we're on it" : "Send us your itinerary"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {reference
                ? "A specialist will check hotels and guides and send your confirmed price within one business day."
                : "No payment now. We check availability and confirm the final price before anything is booked."}
            </p>
          </div>

          {reference ? (
            <div className="px-6 py-8 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Your reference</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight text-fly-navy-900">{reference}</p>
              <button type="button" onClick={handleClose} className="btn-navy mt-8">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="panel px-4 py-3.5 text-sm">
                <ol className="space-y-1 text-slate-600">
                  {stops.map((s, i) => (
                    <li key={`${s.destinationId}-${i}`}>
                      <span className="font-semibold text-slate-900">
                        {i + 1}. {s.destinationName}
                      </span>{" "}
                      · {s.nights} night{s.nights === 1 ? "" : "s"}
                      {s.hotelName && <span className="text-slate-400"> · {s.hotelName} or similar</span>}
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-500">
                    Estimate for {adults + childCount} {adults + childCount === 1 ? "traveller" : "travellers"}
                  </span>
                  <span className="font-display text-lg font-bold text-fly-navy-900">
                    <Price usd={totalUSD} />
                  </span>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="rq-name" label="Full name">
                  <input id="rq-name" required autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className="field-input" />
                </Field>
                <Field id="rq-email" label="Email">
                  <input id="rq-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="field-input" />
                </Field>
                <Field id="rq-phone" label="Phone or WhatsApp">
                  <input id="rq-phone" type="tel" required autoComplete="tel" placeholder="Include country code" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="field-input" />
                </Field>
                <Field id="rq-date" label="Start date" optional>
                  <input id="rq-date" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="field-input" />
                </Field>
              </div>
              <Field id="rq-notes" label="Anything else?" optional>
                <textarea id="rq-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className="field-input resize-none" />
              </Field>
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden="true" />

              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-fly-orange" />
                <span>
                  I accept the{" "}
                  <Link href="/booking-terms" target="_blank" className="font-semibold text-fly-navy underline underline-offset-2">
                    booking terms
                  </Link>
                  .
                </span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Sending…" : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
