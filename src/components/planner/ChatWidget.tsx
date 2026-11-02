"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X, Maximize2 } from "lucide-react";
import { useOverlay } from "@/lib/useOverlay";
import PlannerChat from "./PlannerChat";

const HIDDEN_ON = ["/plan", "/admin", "/book"];

/** Floating AI planner on every public page. */
export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useOverlay(open, close);

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[45] inline-flex items-center gap-2 rounded-full bg-fly-navy px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-fly-navy/30 transition-transform hover:-translate-y-0.5"
          aria-label="Open the AI trip planner"
        >
          <Sparkles className="h-4 w-4 text-fly-orange-300" />
          Plan my trip
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[55] sm:inset-auto sm:bottom-5 sm:right-5" role="dialog" aria-modal="true" aria-label="AI trip planner">
          <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[640px] sm:max-h-[calc(100vh-40px)] sm:w-[400px] sm:rounded-3xl sm:ring-1 sm:ring-slate-200">
            <div className="flex items-center justify-between bg-fly-navy-950 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Sparkles className="h-4 w-4 text-fly-orange-300" />
                </span>
                <div>
                  <p className="text-sm font-semibold">AI trip planner</p>
                  <p className="text-[11px] text-slate-400">Real tours and prices · reviewed by our team</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href="/plan" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Open full-page planner">
                  <Maximize2 className="h-4 w-4" />
                </Link>
                <button type="button" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close planner">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <PlannerChat compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
