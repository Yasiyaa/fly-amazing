import { getSessionClient } from "@/lib/supabase/session";
import { DEFAULT_SETTINGS } from "@/lib/site";
import SettingsForm from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/lib/types";

export default async function AdminSettings() {
  const db = getSessionClient()!;
  const [{ data: rows }, { data: videos }] = await Promise.all([
    db.from("site_settings").select("key, value"),
    db.from("media_assets").select("url, alt").eq("kind", "video").order("created_at", { ascending: false }),
  ]);
  const map = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]));
  const settings: SiteSettings = { ...DEFAULT_SETTINGS, ...(map.contact ?? {}), heroVideos: map.hero_videos ?? DEFAULT_SETTINGS.heroVideos };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-fly-navy-900">Site settings</h1>
      <SettingsForm settings={settings} uploadedVideos={videos ?? []} />
    </div>
  );
}
