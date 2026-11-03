import Image from "next/image";
import { getSessionClient } from "@/lib/supabase/session";
import MediaUploader from "@/components/admin/MediaUploader";
import CopyButton from "@/components/admin/CopyButton";
import { deleteMedia, updateMedia } from "../../actions";

export default async function AdminMedia() {
  const db = getSessionClient()!;
  const { data } = await db.from("media_assets").select("*").order("created_at", { ascending: false }).limit(300);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fly-navy-900">Media library</h1>
        <p className="mt-1 text-sm text-slate-500">Copy a file&rsquo;s link into a tour, destination or the home page videos in Site settings.</p>
      </div>
      <MediaUploader />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((m) => (
          <article key={m.id} className="card overflow-hidden">
            <div className="relative aspect-video bg-slate-900">
              {m.kind === "image" ? (
                <Image src={m.url} alt={m.alt} fill sizes="(min-width: 1280px) 30vw, 50vw" className="object-cover" />
              ) : (
                <video src={m.url} muted controls preload="metadata" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="space-y-3 p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  {m.kind} · {m.bytes ? `${(m.bytes / 1024 / 1024).toFixed(1)} MB` : "—"}
                </span>
                <CopyButton value={m.url} />
              </div>
              <form action={updateMedia} className="space-y-2">
                <input type="hidden" name="id" value={m.id} />
                <input name="alt" defaultValue={m.alt} placeholder="Description" className="field-input py-2 text-[13px]" />
                <input name="tags" defaultValue={(m.tags ?? []).join(", ")} placeholder="Tags" className="field-input py-2 text-[13px]" />
                <div className="flex justify-between">
                  <button type="submit" className="btn-secondary btn-sm">
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteMedia}>
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                  Delete file
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
      {(data ?? []).length === 0 && <p className="text-sm text-slate-500">No uploads yet.</p>}
    </div>
  );
}
