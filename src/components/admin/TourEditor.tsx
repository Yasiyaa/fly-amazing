"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Field from "@/components/ui/Field";
import SubmitButton, { FormMessage } from "./SubmitButton";
import { saveTour, type ActionState } from "@/app/admin/actions";

interface DayRow {
  title: string;
  destination_id: string | null;
  description: string;
  drive_time: string | null;
  overnight: string;
  meals: string;
}

type TourRow = Record<string, any>;

export default function TourEditor({ tour, days: initialDays, destinations }: { tour: TourRow; days: DayRow[]; destinations: { id: string; name: string }[] }) {
  const [state, action] = useFormState<ActionState, FormData>(saveTour, {});
  const [days, setDays] = useState<DayRow[]>(
    initialDays.map((d) => ({
      title: d.title,
      destination_id: d.destination_id,
      description: d.description,
      drive_time: d.drive_time,
      overnight: d.overnight,
      meals: d.meals,
    }))
  );

  const setDay = (i: number, patch: Partial<DayRow>) => setDays((prev) => prev.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const move = (i: number, dir: -1 | 1) =>
    setDays((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const daysJson = JSON.stringify(
    days.map((d, i) => ({ ...d, day: i + 1, destination_id: d.destination_id || null, drive_time: d.drive_time || null }))
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={tour.slug} />
      <input type="hidden" name="days" value={daysJson} />

      <section className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Basics</h2>
        <Field id="title" label="Title">
          <input id="title" name="title" defaultValue={tour.title} required className="field-input" />
        </Field>
        <Field id="tagline" label="Tagline">
          <input id="tagline" name="tagline" defaultValue={tour.tagline} className="field-input" />
        </Field>
        <Field id="summary" label="Summary">
          <textarea id="summary" name="summary" rows={4} defaultValue={tour.summary} className="field-input" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="bestSeason" label="Best season (short)">
            <input id="bestSeason" name="bestSeason" defaultValue={tour.best_season} placeholder="Dec–Apr" className="field-input" />
          </Field>
          <Field id="badge" label="Badge" optional>
            <input id="badge" name="badge" defaultValue={tour.badge ?? ""} placeholder="e.g. Best for first-timers" className="field-input" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={tour.published} className="h-4 w-4 rounded border-slate-300" />
            Published on the website
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={tour.featured} className="h-4 w-4 rounded border-slate-300" />
            Featured on the home page
          </label>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Prices (USD per person, two sharing)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field id="priceComfort" label="Comfort (3★)">
            <input id="priceComfort" name="priceComfort" type="number" min={0} defaultValue={tour.price_comfort_usd} className="field-input" />
          </Field>
          <Field id="priceSuperior" label="Superior (4★)">
            <input id="priceSuperior" name="priceSuperior" type="number" min={0} defaultValue={tour.price_superior_usd} className="field-input" />
          </Field>
          <Field id="priceLuxury" label="Luxury (5★)">
            <input id="priceLuxury" name="priceLuxury" type="number" min={0} defaultValue={tour.price_luxury_usd} className="field-input" />
          </Field>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Photos and video</h2>
        <p className="text-sm text-slate-500">Paste links from the Media library. One link per line for the gallery.</p>
        <Field id="heroImage" label="Main photo">
          <input id="heroImage" name="heroImage" defaultValue={tour.hero_image} className="field-input" />
        </Field>
        <Field id="gallery" label="Gallery">
          <textarea id="gallery" name="gallery" rows={4} defaultValue={(tour.gallery ?? []).join("\n")} className="field-input font-mono text-xs" />
        </Field>
        <Field id="video" label="Video" optional>
          <input id="video" name="video" defaultValue={tour.video ?? ""} className="field-input" />
        </Field>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Highlights and inclusions</h2>
        <p className="text-sm text-slate-500">One item per line.</p>
        <Field id="highlights" label="Highlights">
          <textarea id="highlights" name="highlights" rows={5} defaultValue={(tour.highlights ?? []).join("\n")} className="field-input" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="inclusions" label="Included">
            <textarea id="inclusions" name="inclusions" rows={7} defaultValue={(tour.inclusions ?? []).join("\n")} className="field-input" />
          </Field>
          <Field id="exclusions" label="Not included">
            <textarea id="exclusions" name="exclusions" rows={7} defaultValue={(tour.exclusions ?? []).join("\n")} className="field-input" />
          </Field>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Itinerary ({days.length} days)</h2>
          <button
            type="button"
            onClick={() => setDays((prev) => [...prev, { title: "", destination_id: null, description: "", drive_time: null, overnight: "", meals: "Breakfast" }])}
            className="btn-secondary btn-sm"
          >
            <Plus className="h-4 w-4" />
            Add day
          </button>
        </div>
        <ol className="space-y-4">
          {days.map((d, i) => (
            <li key={i} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-fly-navy-900">Day {i + 1}</span>
                <div className="flex gap-1">
                  <IconButton label="Move up" onClick={() => move(i, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Remove day" onClick={() => setDays((prev) => prev.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </IconButton>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={d.title} onChange={(e) => setDay(i, { title: e.target.value })} placeholder="Title" aria-label={`Day ${i + 1} title`} className="field-input py-2" />
                <select
                  value={d.destination_id ?? ""}
                  onChange={(e) => setDay(i, { destination_id: e.target.value || null })}
                  aria-label={`Day ${i + 1} destination`}
                  className="field-input cursor-pointer py-2"
                >
                  <option value="">No destination</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={d.description}
                  onChange={(e) => setDay(i, { description: e.target.value })}
                  rows={3}
                  placeholder="What happens today"
                  aria-label={`Day ${i + 1} description`}
                  className="field-input py-2 sm:col-span-2"
                />
                <input value={d.drive_time ?? ""} onChange={(e) => setDay(i, { drive_time: e.target.value })} placeholder="Drive time, e.g. 3 h" aria-label={`Day ${i + 1} drive time`} className="field-input py-2" />
                <input value={d.overnight} onChange={(e) => setDay(i, { overnight: e.target.value })} placeholder="Overnight" aria-label={`Day ${i + 1} overnight`} className="field-input py-2" />
                <input value={d.meals} onChange={(e) => setDay(i, { meals: e.target.value })} placeholder="Meals" aria-label={`Day ${i + 1} meals`} className="field-input py-2" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur">
        <FormMessage state={state} />
        <SubmitButton className="ml-auto">Save tour</SubmitButton>
      </div>
    </form>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
      {children}
    </button>
  );
}
