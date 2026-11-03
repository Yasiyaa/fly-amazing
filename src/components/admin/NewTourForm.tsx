"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import Field from "@/components/ui/Field";
import SubmitButton, { FormMessage } from "./SubmitButton";
import { createTour, type ActionState } from "@/app/admin/actions";

export default function NewTourForm() {
  const [state, action] = useFormState<ActionState, FormData>(createTour, {});
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  return (
    <form action={action} className="card space-y-5 p-6 sm:p-8">
      <div className="space-y-4">
        <Field id="title" label="Tour title">
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Wildlife, Tea & South Coast Escape"
            className="field-input"
          />
        </Field>

        <Field id="slug" label="URL slug">
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="wildlife-tea-and-south-coast"
            className="field-input font-mono text-sm"
          />
        </Field>

        <Field id="tagline" label="Tagline" optional>
          <input
            id="tagline"
            name="tagline"
            placeholder="One line capturing the essence of the journey"
            className="field-input"
          />
        </Field>

        <Field id="summary" label="Overview summary" optional>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            placeholder="A short overview describing the experience, key regions, and pacing"
            className="field-input"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="durationDays" label="Duration (days)">
            <input
              id="durationDays"
              name="durationDays"
              type="number"
              min={1}
              max={30}
              defaultValue={7}
              className="field-input"
            />
          </Field>
          <Field id="bestSeason" label="Best season">
            <input
              id="bestSeason"
              name="bestSeason"
              defaultValue="Year-round"
              placeholder="e.g. Dec–Apr"
              className="field-input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field id="priceComfort" label="Comfort (3★, USD)">
            <input
              id="priceComfort"
              name="priceComfort"
              type="number"
              min={0}
              defaultValue={1200}
              className="field-input"
            />
          </Field>
          <Field id="priceSuperior" label="Superior (4★, USD)">
            <input
              id="priceSuperior"
              name="priceSuperior"
              type="number"
              min={0}
              defaultValue={1600}
              className="field-input"
            />
          </Field>
          <Field id="priceLuxury" label="Luxury (5★, USD)">
            <input
              id="priceLuxury"
              name="priceLuxury"
              type="number"
              min={0}
              defaultValue={2800}
              className="field-input"
            />
          </Field>
        </div>

        <Field id="heroImage" label="Main photo URL" optional>
          <input
            id="heroImage"
            name="heroImage"
            defaultValue="/images/posters/south-coast-beach.jpg"
            className="field-input"
          />
        </Field>
      </div>

      <FormMessage state={state} />

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <Link href="/admin/tours" className="text-sm font-medium text-slate-500 hover:text-fly-navy">
          Cancel
        </Link>
        <SubmitButton>Create tour</SubmitButton>
      </div>
    </form>
  );
}
