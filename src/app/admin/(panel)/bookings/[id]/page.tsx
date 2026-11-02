import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSessionClient } from "@/lib/supabase/session";
import { BOOKING_STATUS_LABELS, TIER_LABELS, type BookingStatus, type HotelTier } from "@/lib/types";
import { StatusPill } from "@/components/admin/StatusPill";
import BookingStatusForm from "@/components/admin/BookingStatusForm";

export default async function AdminBookingDetail({ params }: { params: { id: string } }) {
  if (!/^[0-9a-f-]{36}$/.test(params.id)) notFound();
  const db = getSessionClient()!;
  const { data: b } = await db.from("bookings").select("*").eq("id", params.id).maybeSingle();
  if (!b) notFound();

  const stops = (b.itinerary?.stops ?? []) as { destination: string; nights: number; hotel: string | null }[];
  const usd = (n: number) => `US$${Number(n).toLocaleString("en-US")}`;

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-fly-navy">
        <ArrowLeft className="h-4 w-4" />
        Bookings
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-slate-500">{b.reference}</p>
          <h1 className="text-2xl font-bold text-fly-navy-900">{b.tour_title}</h1>
        </div>
        <StatusPill status={b.status} label={BOOKING_STATUS_LABELS[b.status as BookingStatus]} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card space-y-3 p-6 text-sm">
          <h2 className="font-semibold text-slate-900">Traveller</h2>
          <p className="font-medium text-slate-900">{b.lead_name}</p>
          <p>
            <a href={`mailto:${b.email}`} className="text-fly-cyan-700">
              {b.email}
            </a>
          </p>
          <p>
            <a href={`tel:${b.phone}`} className="text-fly-cyan-700">
              {b.phone}
            </a>
          </p>
          {b.country && <p className="text-slate-500">{b.country}</p>}
          {b.notes && <p className="rounded-xl bg-amber-50 p-3 text-slate-700">{b.notes}</p>}
        </div>
        <div className="card space-y-2 p-6 text-sm">
          <h2 className="font-semibold text-slate-900">Trip</h2>
          <p>
            <span className="text-slate-500">Type:</span> {b.kind} ({b.source})
          </p>
          <p>
            <span className="text-slate-500">Start:</span> {b.start_date ?? "To be confirmed"}
          </p>
          <p>
            <span className="text-slate-500">Travellers:</span> {b.adults} adults, {b.children} children
          </p>
          {b.tier && (
            <p>
              <span className="text-slate-500">Hotels:</span> {TIER_LABELS[b.tier as HotelTier]}
            </p>
          )}
          <p>
            <span className="text-slate-500">Estimated total:</span> <strong>{usd(b.price_total_usd)}</strong>
          </p>
          <p>
            <span className="text-slate-500">Deposit:</span> {usd(b.deposit_usd)}
          </p>
          {b.tour_slug && (
            <p>
              <Link href={`/tours/${b.tour_slug}`} target="_blank" className="font-semibold text-fly-cyan-700">
                View tour page
              </Link>
            </p>
          )}
          {stops.length > 0 && (
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-600">
              {stops.map((s, i) => (
                <li key={i}>
                  {s.destination}: {s.nights} night{s.nights === 1 ? "" : "s"}
                  {s.hotel && ` · ${s.hotel}`}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <BookingStatusForm id={b.id} status={b.status} adminNotes={b.admin_notes ?? ""} />
      <p className="text-xs text-slate-400">Received {new Date(b.created_at).toLocaleString("en-GB", { timeZone: "Asia/Colombo" })} (Colombo time)</p>
    </div>
  );
}
