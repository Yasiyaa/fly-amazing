"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

const EXAMPLES = [
  "10 days in March for a couple: culture, tea country and a beach finish",
  "A week with two kids who love animals",
  "Honeymoon in December, boutique hotels",
  "Where is good for beaches in July?",
];

/** Hero call-to-action: describe a trip and hand it to the AI planner, or browse tours. */
export default function PlannerIsland() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const start = (text: string) => {
    const q = text.trim();
    router.push(q ? `/plan?q=${encodeURIComponent(q)}` : "/plan");
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white p-4 text-left text-slate-700 shadow-2xl shadow-black/30 sm:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(prompt);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-fly-cyan focus-within:ring-4 focus-within:ring-fly-cyan/15">
          <Sparkles className="h-5 w-5 shrink-0 text-fly-orange" />
          <span className="sr-only">Describe your trip</span>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream trip: when, who, and what you love"
            className="w-full bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            maxLength={400}
          />
        </label>
        <button type="submit" className="btn-primary btn-lg">
          Plan with AI
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => start(ex)}
            className="rounded-full bg-slate-50 px-3 py-1.5 text-left text-xs text-slate-600 transition-colors hover:bg-fly-cyan-50 hover:text-fly-cyan-800"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Our planner only suggests real tours and prices. A specialist checks every itinerary.</p>
        <div className="flex gap-4">
          <Link href="/tours" className="font-semibold text-fly-navy hover:text-fly-cyan-700">
            Browse tours
          </Link>
          <Link href="/tour-architect" className="inline-flex items-center gap-1 font-semibold text-fly-navy hover:text-fly-cyan-700">
            <Compass className="h-3.5 w-3.5" />
            Build your own
          </Link>
        </div>
      </div>
    </div>
  );
}
