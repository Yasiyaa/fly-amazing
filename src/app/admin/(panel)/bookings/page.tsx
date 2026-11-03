import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/session";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/types";
import { StatusPill } from "@/components/admin/StatusPill";
import { cn } from "@/lib/utils";

const FILTERS: (BookingStatus | "all")[] = ["all", "requested", "confirmed", "deposit_paid", "paid", "completed", "cancelled"];

export default async function AdminBookings({ searchParams }: { searchParams: { status?: string } }) {
  const status = FILTERS.includes(searchParams.status as BookingStatus) ? (searchParams.status as BookingStatus | "all") : "all";
  const db = getSessionClient()!;
  let query = db
    .from("bookings")
    .select("id, reference, kind, tour_title, lead_name, email, start_date, adults, children, status, price_total_usd, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") query = query.eq("status", status);
  const { data } = await query;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fly-navy-900">Bookings</h1>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/bookings" : `/admin/bookings?status=${f}`}
            className={cn("filter-pill shrink-0", status === f ? "filter-pill-active" : "filter-pill-idle")}
          >
            {f === "all" ? "All" : BOOKING_STATUS_LABELS[f]}
          </Link>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Traveller</th>
              <th className="px-4 py-3">Trip</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(data ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-slate-500">
                  No bookings{status !== "all" && " with this status"}.
                </td>
              </tr>
            )}
            {(data ?? []).map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="font-mono font-semibold text-fly-cyan-700">
                    {b.reference}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{b.lead_name}</p>
                  <p className="text-xs text-slate-500">{b.email}</p>
                </td>
                <td className="max-w-[260px] px-4 py-3">
                  <p className="truncate text-slate-700">{b.tour_title}</p>
                  <p className="text-xs text-slate-400">
                    {b.kind} · {b.adults + b.children} pax
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-600">{b.start_date ?? "TBC"}</td>
                <td className="px-4 py-3 font-medium text-slate-900">US${Number(b.price_total_usd).toLocaleString("en-US")}</td>
                <td className="px-4 py-3">
                  <StatusPill status={b.status} label={BOOKING_STATUS_LABELS[b.status as BookingStatus]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
