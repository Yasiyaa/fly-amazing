"use client";

import React from "react";
import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 font-sans p-6 text-slate-800">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Application Error</h1>
          <p className="mt-3 text-sm text-slate-600">
            A critical error occurred while displaying the application.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-[#011A37] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#02254D]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
