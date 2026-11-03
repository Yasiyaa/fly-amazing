import React from "react";
import { cn } from "@/lib/utils";

/**
 * Interim wordmark for Amazing World Travel until the client supplies a logo file.
 * Keeps the brand palette (navy, cyan, orange swoosh) from the previous identity.
 */
export default function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label="Amazing World Travel">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="19" className={light ? "fill-white/10" : "fill-fly-cyan-50"} />
        <path d="M8 24c6-10 16-13 25-11-7 1-12 5-15 11" className="fill-none stroke-fly-orange" strokeWidth="3" strokeLinecap="round" />
        <path d="M11 29c5-3 12-4 19-2" className={cn("fill-none", light ? "stroke-fly-cyan-200" : "stroke-fly-cyan")} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[19px] font-bold tracking-tight", light ? "text-white" : "text-fly-navy-900")}>
          Amazing <span className={light ? "text-fly-cyan-200" : "text-fly-cyan-600"}>World</span>
        </span>
        <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.28em]", light ? "text-slate-300" : "text-slate-500")}>
          Travel · Sri Lanka
        </span>
      </span>
    </span>
  );
}
