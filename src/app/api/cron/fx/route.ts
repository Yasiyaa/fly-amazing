import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/clients";
import { CURRENCIES } from "@/lib/currency";

// Daily exchange-rate refresh (Vercel Cron, see vercel.json). USD is the base currency.
// Protected by CRON_SECRET, which Vercel sends as a bearer token on scheduled invocations.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const res = await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: `Rates API returned ${res.status}` }, { status: 502 });
  const json = (await res.json()) as { result?: string; rates?: Record<string, number> };
  if (json.result !== "success" || !json.rates) return NextResponse.json({ error: "Unexpected rates response" }, { status: 502 });

  const rows = CURRENCIES.filter((c) => typeof json.rates![c] === "number").map((c) => ({
    currency: c,
    rate: json.rates![c],
    updated_at: new Date().toISOString(),
  }));
  const { error } = await db.from("fx_rates").upsert(rows, { onConflict: "currency" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ updated: rows.length });
}
