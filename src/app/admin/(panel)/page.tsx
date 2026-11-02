import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/session";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/types";
import { StatusPill } from "@/components/admin/StatusPill";

export default async function AdminDashboard() {
  const db = getSessionClient()!;
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [requested, enquiries, chats, recent] = await Promise.all([
    db.from("bookings").select("id", { count: "exact", head: true }).eq("status", "requested"),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    db.from("chat_sessions").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    db.from("bookings").select("id, reference, tour_title, lead_name, start_date, status, price_total_usd, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const stats = [
    { label: "Booking requests to confirm", value: requested.count ?? 0, href: "/admin/bookings?status=requested" },
    { label: "New enquiries", value: enquiries.count ?? 0, href: "/admin/enquiries" },
    { label: "Planner chats this week", value: chats.count ?? 0, href: "/admin/chats" },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-fly-navy-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card-interactive p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-fly-navy-900">{s.value}</p>
          </Link>
        ))}
      </div>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fly-navy-900">Latest bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-semibold text-fly-cyan-700">
            All bookings
          </Link>
        </div>
        <div className="card mt-4 divide-y divide-slate-100">
          {(recent.data ?? []).length === 0 && <p className="p-5 text-sm text-slate-500">No bookings yet.</p>}
          {(recent.data ?? []).map((b) => (
            <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-50">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  <span className="font-mono text-sm text-slate-500">{b.reference}</span> · {b.lead_name}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {b.tour_title} · {b.start_date ?? "date TBC"}
                </p>
              </div>
              <StatusPill status={b.status} label={BOOKING_STATUS_LABELS[b.status as BookingStatus]} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
