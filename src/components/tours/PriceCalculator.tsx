"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ArrowRight, Check } from "lucide-react";
import { Price, useCurrency } from "@/components/currency/CurrencyProvider";
import { quoteTour, DEPOSIT_RATE, BALANCE_DUE_DAYS } from "@/lib/pricing";
import { HOTEL_TIERS, TIER_LABELS, type HotelTier, type Tour } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PriceCalculator({ tour }: { tour: Tour }) {
  const [tier, setTier] = useState<HotelTier>("superior");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const { isApproximate } = useCurrency();
  const quote = quoteTour(tour, { tier, adults, children });
  const isDay = tour.kind === "day";

  return (
    <div className="card sticky top-24 p-6 shadow-xl shadow-fly-navy/5 sm:p-7">
      <p className="text-xs text-slate-500">Per adult</p>
      <p className="mt-0.5 font-display text-4xl font-bold text-fly-navy-900">
        <Price usd={quote.perAdultUSD} />
      </p>
      {isApproximate && <p className="mt-1 text-xs text-slate-400">Converted from USD. Bookings are charged in USD.</p>}

      {!isDay && (
        <fieldset className="mt-6">
          <legend className="field-label">Hotels</legend>
          <div className="grid grid-cols-1 gap-2">
            {HOTEL_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                aria-pressed={tier === t}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors",
                  tier === t ? "border-fly-navy bg-fly-navy text-white" : "border-slate-200 text-slate-700 hover:border-slate-300"
                )}
              >
                <span className="font-medium">{TIER_LABELS[t]}</span>
                <Price usd={quoteTour(tour, { tier: t, adults, children }).perAdultUSD} className={tier === t ? "text-white/80" : "text-slate-400"} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stepper label="Adults" value={adults} min={1} max={20} onChange={setAdults} />
        <Stepper label="Children (2–11)" value={children} min={0} max={10} onChange={setChildren} />
      </div>

      <dl className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Estimated total</dt>
          <dd className="font-semibold text-slate-900">
            <Price usd={quote.totalUSD} />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">{isDay ? "Pay to confirm" : `Deposit to confirm (${DEPOSIT_RATE * 100}%)`}</dt>
          <dd className="font-semibold text-slate-900">
            <Price usd={isDay ? quote.totalUSD : Math.round(quote.totalUSD * DEPOSIT_RATE)} />
          </dd>
        </div>
      </dl>

      <Link
        href={`/book/${tour.slug}?tier=${tier}&adults=${adults}&children=${children}`}
        className="btn-primary btn-lg mt-6 w-full"
      >
        Request to book
        <ArrowRight className="h-4 w-4" />
      </Link>
      <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
        <li className="flex gap-2">
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          No payment until we confirm availability
        </li>
        {!isDay && (
          <li className="flex gap-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            Balance due {BALANCE_DUE_DAYS} days before you travel
          </li>
        )}
      </ul>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm font-semibold tabular-nums text-slate-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
