"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import Field from "@/components/ui/Field";
import SubmitButton, { FormMessage } from "./SubmitButton";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ settings, uploadedVideos }: { settings: SiteSettings; uploadedVideos: { url: string; alt: string }[] }) {
  const [state, action] = useFormState<ActionState, FormData>(saveSettings, {});
  const [videos, setVideos] = useState(settings.heroVideos);
  const setVideo = (i: number, patch: Partial<SiteSettings["heroVideos"][number]>) => setVideos((prev) => prev.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="heroVideos" value={JSON.stringify(videos)} />

      <section className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Contact details</h2>
        <p className="text-sm text-slate-500">Empty phone, WhatsApp or licence fields are hidden on the website.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="email" label="Email">
            <input id="email" name="email" type="email" required defaultValue={settings.email} className="field-input" />
          </Field>
          <Field id="phone" label="Phone" optional>
            <input id="phone" name="phone" defaultValue={settings.phone} placeholder="+94 11 234 5678" className="field-input" />
          </Field>
          <Field id="whatsapp" label="WhatsApp number" optional>
            <input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} placeholder="+94 77 123 4567" className="field-input" />
          </Field>
          <Field id="sltdaLicence" label="SLTDA licence number" optional>
            <input id="sltdaLicence" name="sltdaLicence" defaultValue={settings.sltdaLicence} className="field-input" />
          </Field>
        </div>
        <Field id="address" label="Address (one line per row)">
          <textarea id="address" name="address" rows={3} defaultValue={settings.address.join("\n")} className="field-input" />
        </Field>
      </section>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Home page background videos</h2>
          <button type="button" onClick={() => setVideos((prev) => [...prev, { url: "", poster: "", label: "" }])} className="btn-secondary btn-sm" disabled={videos.length >= 8}>
            <Plus className="h-4 w-4" />
            Add video
          </button>
        </div>
        <p className="text-sm text-slate-500">They play in order and crossfade every few seconds. The poster image shows while a video loads.</p>
        {uploadedVideos.length > 0 && (
          <datalist id="uploaded-videos">
            {uploadedVideos.map((v) => (
              <option key={v.url} value={v.url}>
                {v.alt}
              </option>
            ))}
          </datalist>
        )}
        <ol className="space-y-3">
          {videos.map((v, i) => (
            <li key={i} className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <input value={v.url} onChange={(e) => setVideo(i, { url: e.target.value })} list="uploaded-videos" placeholder="Video link" aria-label={`Video ${i + 1} link`} className="field-input py-2" />
                <input value={v.poster} onChange={(e) => setVideo(i, { poster: e.target.value })} placeholder="Poster image link" aria-label={`Video ${i + 1} poster`} className="field-input py-2" />
                <input value={v.label} onChange={(e) => setVideo(i, { label: e.target.value })} placeholder="Caption, e.g. Wild elephants in Minneriya" aria-label={`Video ${i + 1} caption`} className="field-input py-2" />
              </div>
              <button type="button" onClick={() => setVideos((prev) => prev.filter((_, j) => j !== i))} aria-label={`Remove video ${i + 1}`} className="flex h-9 w-9 items-center justify-center self-start rounded-lg text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex items-center justify-between gap-4">
        <FormMessage state={state} />
        <SubmitButton className="ml-auto">Save settings</SubmitButton>
      </div>
    </form>
  );
}
