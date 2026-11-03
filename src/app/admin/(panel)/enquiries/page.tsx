import { getSessionClient } from "@/lib/supabase/session";
import { StatusPill } from "@/components/admin/StatusPill";
import { updateEnquiryStatus } from "../../actions";

export default async function AdminEnquiries() {
  const db = getSessionClient()!;
  const { data } = await db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fly-navy-900">Enquiries</h1>
      {(data ?? []).length === 0 && <p className="text-sm text-slate-500">No enquiries yet.</p>}
      <div className="space-y-4">
        {(data ?? []).map((e) => (
          <article key={e.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {e.name} <span className="font-mono text-xs font-normal text-slate-400">{e.reference}</span>
                </p>
                <p className="text-sm text-slate-500">
                  <a href={`mailto:${e.email}`} className="text-fly-cyan-700">
                    {e.email}
                  </a>
                  {e.phone && ` · ${e.phone}`} · {new Date(e.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>
              <StatusPill status={e.status} />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{e.message}</p>
            <form action={updateEnquiryStatus} className="mt-4 flex gap-2">
              <input type="hidden" name="id" value={e.id} />
              {(["new", "replied", "closed"] as const)
                .filter((s) => s !== e.status)
                .map((s) => (
                  <button key={s} type="submit" name="status" value={s} className="btn-secondary btn-sm">
                    Mark {s}
                  </button>
                ))}
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
