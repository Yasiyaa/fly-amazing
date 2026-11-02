"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, Send, CalendarDays, Clock } from "lucide-react";
import Field from "@/components/ui/Field";
import { Price } from "@/components/currency/CurrencyProvider";
import { quoteTour, DEPOSIT_RATE, BALANCE_DUE_DAYS } from "@/lib/pricing";
import { HOTEL_TIERS, TIER_LABELS, type HotelTier, type Tour } from "@/lib/types";

const MIN_LEAD_DAYS = 3;

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function BookingForm({
  tour,
  initial,
}: {
  tour: Tour;
  initial: { tier: HotelTier; adults: number; children: number };
}) {
  const minDate = useMemo(() => isoDate(new Date(Date.now() + MIN_LEAD_DAYS * 86_400_000)), []);
  const [form, setForm] = useState({
    tier: initial.tier,
    adults: initial.adults,
    children: initial.children,
    startDate: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
    website: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const quote = quoteTour(tour, { tier: form.tier, adults: form.adults, children: form.children, startDate: form.startDate || null });
  const isDay = tour.kind === "day";
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

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
          kind: "tour",
          tourSlug: tour.slug,
          tier: form.tier,
          adults: form.adults,
          children: form.children,
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
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (reference) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-fly-navy-900">Request received</h2>
        <p className="mt-3 text-slate-500">
          Thank you, {form.name.split(" ")[0]}. We&rsquo;ve emailed a copy to {form.email}. A specialist will confirm availability and your final price within one business day.
        </p>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Your reference</p>
        <p className="mt-1 font-display text-4xl font-bold tracking-tight text-fly-navy-900">{reference}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/booking" className="btn-secondary">
            Manage booking
          </Link>
          <Link href="/tours" className="btn-navy">
            Back to tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-12" noValidate>
      <div className="space-y-8 lg:col-span-7">
        <section className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-fly-navy-900">Your trip</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field id="bk-date" label="Start date" className="sm:col-span-1">
              <input
                id="bk-date"
                type="date"
                required
                min={minDate}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="field-input"
              />
            </Field>
            <Field id="bk-adults" label="Adults">
              <select id="bk-adults" value={form.adults} onChange={(e) => set("adults", Number(e.target.value))} className="field-input cursor-pointer">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="bk-children" label="Children (2–11)">
              <select id="bk-children" value={form.children} onChange={(e) => set("children", Number(e.target.value))} className="field-input cursor-pointer">
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {!isDay && (
            <fieldset className="mt-6">
              <legend className="field-label">Hotels</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {HOTEL_TIERS.map((t) => (
                  <label
                    key={t}
                    className={`flex cursor-pointer flex-col rounded-xl border p-3.5 text-sm transition-colors ${
                      form.tier === t ? "border-fly-navy bg-fly-navy/5 ring-1 ring-fly-navy" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input type="radio" name="tier" value={t} checked={form.tier === t} onChange={() => set("tier", t)} className="sr-only" />
                    <span className="font-semibold text-slate-900">{TIER_LABELS[t]}</span>
                    <span className="mt-1 text-slate-500">
                      <Price usd={quoteTour(tour, { tier: t, adults: form.adults, children: form.children }).perAdultUSD} /> pp
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-fly-navy-900">Lead traveller</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="bk-name" label="Full name">
              <input id="bk-name" required autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className="field-input" />
            </Field>
            <Field id="bk-email" label="Email">
              <input id="bk-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="field-input" />
            </Field>
            <Field id="bk-phone" label="Phone or WhatsApp">
              <input id="bk-phone" type="tel" required autoComplete="tel" placeholder="Include country code" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="field-input" />
            </Field>
            <Field id="bk-country" label="Country of residence" optional>
              <input id="bk-country" autoComplete="country-name" value={form.country} onChange={(e) => set("country", e.target.value)} className="field-input" />
            </Field>
          </div>
          <Field id="bk-notes" label="Anything we should know?" optional className="mt-4">
            <textarea
              id="bk-notes"
              rows={4}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Flight times, dietary needs, celebrations, mobility needs, rooms you'd like…"
              className="field-input resize-none"
            />
          </Field>
          {/* Honeypot: hidden from people, often filled by bots */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className="hidden"
            aria-hidden="true"
          />
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="card sticky top-24 overflow-hidden">
          <div className="relative aspect-[16/9]">
            <Image src={tour.heroImage} alt={tour.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="p-6 sm:p-7">
            <h3 className="text-lg font-bold text-fly-navy-900">{tour.title}</h3>
            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {isDay ? "Full day" : `${tour.durationDays} days`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Best {tour.bestSeason}
              </span>
            </p>
            <dl className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
              <Row label={`${form.adults} adult${form.adults === 1 ? "" : "s"} × `} value={<Price usd={quote.perAdultUSD} />} />
              {form.children > 0 && <Row label={`${form.children} child${form.children === 1 ? "" : "ren"} × `} value={<Price usd={quote.perChildUSD} />} />}
              <Row label="Estimated total" value={<Price usd={quote.totalUSD} />} strong />
              <Row
                label={quote.payInFull ? "Payable in full on confirmation" : `Deposit to confirm (${DEPOSIT_RATE * 100}%)`}
                value={<Price usd={quote.depositUSD} />}
              />
            </dl>
            {!quote.payInFull && <p className="mt-3 text-xs text-slate-500">Balance due {BALANCE_DUE_DAYS} days before arrival.</p>}

            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <label className="mt-5 flex items-start gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-fly-orange focus:ring-fly-cyan" />
              <span>
                I accept the{" "}
                <Link href="/booking-terms" target="_blank" className="font-semibold text-fly-navy underline underline-offset-2">
                  booking terms
                </Link>
                .
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary btn-lg mt-5 w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Sending…" : "Send booking request"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">No payment now. We confirm availability first.</p>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={strong ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</dt>
      <dd className={strong ? "font-display text-lg font-bold text-fly-navy-900" : "font-medium text-slate-900"}>{value}</dd>
    </div>
  );
}
