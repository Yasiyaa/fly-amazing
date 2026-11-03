"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, Mail } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans">
      <header className="border-b border-slate-200/80 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
        <div className="container-page flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <a
            href="mailto:info@amazingworldtravel.com"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fly-cyan-700 hover:text-fly-navy"
          >
            <Mail className="h-3.5 w-3.5" />
            info@amazingworldtravel.com
          </a>
        </div>
      </header>

      <div className="container-page flex flex-1 items-center justify-center py-24">
        <div className="card max-w-lg p-8 text-center shadow-xl shadow-fly-navy/5 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-fly-orange">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-fly-navy-900 sm:text-3xl">Something went off route</h1>
          <p className="mt-3 text-sm text-slate-600">
            We encountered an unexpected bump while loading this page. Our Colombo team has been notified.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => reset()} className="btn-primary btn-md">
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <Link href="/" className="btn-secondary btn-md">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Amazing World Travel · Unit 94D, 75 Galle Road, Colombo 03, Sri Lanka
      </footer>
    </main>
  );
}
