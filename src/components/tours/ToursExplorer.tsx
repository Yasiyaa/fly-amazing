"use client";

import React, { useMemo, useState } from "react";
import TourCard from "@/components/ui/TourCard";
import { THEME_LABELS, type Tour, type TourTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

const LENGTHS = [
  { id: "any", label: "Any length", test: () => true },
  { id: "short", label: "Up to 7 days", test: (t: Tour) => t.durationDays <= 7 },
  { id: "mid", label: "8–11 days", test: (t: Tour) => t.durationDays >= 8 && t.durationDays <= 11 },
  { id: "long", label: "12+ days", test: (t: Tour) => t.durationDays >= 12 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ToursExplorer({ tours }: { tours: Tour[] }) {
  const [theme, setTheme] = useState<TourTheme | "all">("all");
  const [length, setLength] = useState("any");
  const [month, setMonth] = useState(0); // 0 = any

  const themes = useMemo(() => {
    const used = new Set(tours.flatMap((t) => t.themes));
    return (Object.keys(THEME_LABELS) as TourTheme[]).filter((t) => used.has(t));
  }, [tours]);

  const filtered = tours.filter(
    (t) =>
      (theme === "all" || t.themes.includes(theme)) &&
      LENGTHS.find((l) => l.id === length)!.test(t) &&
      (month === 0 || t.seasonMonths.includes(month))
  );

  return (
    <>
      <section className="container-page relative z-10 -mt-12">
        <div className="card space-y-4 p-4 shadow-lg shadow-fly-navy/5 sm:p-5">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <button
              type="button"
              onClick={() => setTheme("all")}
              aria-pressed={theme === "all"}
              className={cn("filter-pill shrink-0", theme === "all" ? "filter-pill-active" : "filter-pill-idle")}
            >
              All tours
            </button>
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={cn("filter-pill shrink-0", theme === t ? "filter-pill-active" : "filter-pill-idle")}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Length
                <select value={length} onChange={(e) => setLength(e.target.value)} className="field-input w-auto cursor-pointer py-2">
                  {LENGTHS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Travelling in
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="field-input w-auto cursor-pointer py-2">
                  <option value={0}>Any month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm text-slate-500" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "tour" : "tours"}
              {month > 0 && ` at their best in ${MONTHS[month - 1]}`}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        {filtered.length === 0 ? (
          <div className="panel p-10 text-center text-slate-500">
            No tours match those filters. Try another month, or ask our AI planner for a custom route.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tour) => (
              <TourCard key={tour.slug} tour={tour} detailed />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
