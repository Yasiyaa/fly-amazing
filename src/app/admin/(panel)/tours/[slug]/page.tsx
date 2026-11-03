import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { getSessionClient } from "@/lib/supabase/session";
import TourEditor from "@/components/admin/TourEditor";
import { deleteTour } from "@/app/admin/actions";

export default async function AdminTourEdit({ params }: { params: { slug: string } }) {
  if (!/^[a-z0-9-]+$/.test(params.slug)) notFound();
  const db = getSessionClient()!;
  const [{ data: tour }, { data: destinations }] = await Promise.all([
    db.from("tours").select("*, tour_days(*)").eq("slug", params.slug).maybeSingle(),
    db.from("destinations").select("id, name").order("sort_order"),
  ]);
  if (!tour) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-fly-navy">
          <ArrowLeft className="h-4 w-4" />
          Tours
        </Link>
        <Link href={`/tours/${tour.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-fly-cyan-700">
          View on site
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-fly-navy-900">{tour.title}</h1>
      <TourEditor
        tour={tour}
        days={[...(tour.tour_days ?? [])].sort((a: { day: number }, b: { day: number }) => a.day - b.day)}
        destinations={destinations ?? []}
      />
      <div className="border-t border-slate-200 pt-6">
        <form action={deleteTour} className="flex justify-end">
          <input type="hidden" name="slug" value={tour.slug} />
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm("Are you sure you want to permanently delete this tour?")) {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            Delete this tour
          </button>
        </form>
      </div>
    </div>
  );
}
