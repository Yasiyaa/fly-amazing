import Image from "next/image";
import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/session";

export default async function AdminTours() {
  const db = getSessionClient()!;
  const { data } = await db.from("tours").select("slug, title, duration_days, price_comfort_usd, published, featured, hero_image").order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fly-navy-900">Tours</h1>
      {(data ?? []).length === 0 && (
        <p className="text-sm text-slate-500">
          No tours in the database yet. Run <code>node --env-file=.env.local scripts/seed.mjs</code> to load the catalogue.
        </p>
      )}
      <div className="card divide-y divide-slate-100">
        {(data ?? []).map((t) => (
          <Link key={t.slug} href={`/admin/tours/${t.slug}`} className="flex items-center gap-4 p-4 hover:bg-slate-50">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-200">
              {t.hero_image && <Image src={t.hero_image} alt="" fill sizes="80px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">{t.title}</p>
              <p className="text-sm text-slate-500">
                {t.duration_days} days · from US${t.price_comfort_usd.toLocaleString("en-US")}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 text-xs font-semibold">
              {t.featured && <span className="rounded-full bg-fly-orange-50 px-2.5 py-1 text-fly-orange-700">Featured</span>}
              <span className={t.published ? "rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700" : "rounded-full bg-slate-100 px-2.5 py-1 text-slate-600"}>
                {t.published ? "Published" : "Draft"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
