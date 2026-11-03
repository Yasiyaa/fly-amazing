"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CURRENCIES, type Currency } from "@/lib/currency";

const STORAGE_KEY = "awt-currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Formats a USD amount in the visitor's chosen currency. */
  format: (usd: number) => string;
  isApproximate: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ rates, children }: { rates: Record<string, number>; children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
      if (saved && CURRENCIES.includes(saved)) setCurrencyState(saved);
    } catch {
      // Storage unavailable: stay on USD.
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const rate = rates[currency] ?? 1;
    const formatter = new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return {
      currency,
      setCurrency: (c) => {
        setCurrencyState(c);
        try {
          localStorage.setItem(STORAGE_KEY, c);
        } catch {
          // ignore
        }
      },
      format: (usd) => formatter.format(Math.round(usd * rate)),
      isApproximate: currency !== "USD",
    };
  }, [currency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

/** Renders a USD amount in the selected currency, with "≈" when converted. */
export function Price({ usd, className }: { usd: number; className?: string }) {
  const { format, isApproximate } = useCurrency();
  return (
    <span className={className} title={isApproximate ? "Approximate. Bookings are charged in USD." : undefined}>
      {isApproximate && "≈ "}
      {format(usd)}
    </span>
  );
}

export function CurrencySelect({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className={className}>
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="cursor-pointer rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-[13px] font-semibold text-fly-navy focus:outline-none focus:ring-2 focus:ring-fly-cyan/30"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
