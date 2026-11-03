"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, ArrowRight, CalendarDays } from "lucide-react";
import type { Tour } from "@/lib/types";
import { THEME_LABELS } from "@/lib/types";
import { fromPrice } from "@/lib/pricing";
import { Price } from "@/components/currency/CurrencyProvider";
import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  /** Show the written summary and every highlight (catalogue page). */
  detailed?: boolean;
}

export default function TourCard({ tour, detailed = false }: TourCardProps) {
  const photos = Array.from(new Set([tour.heroImage, ...tour.gallery])).slice(0, 4);
  const [photoIndex, setPhotoIndex] = useState(0);
  const highlights = detailed ? tour.highlights : tour.highlights.slice(0, 3);

  return (
    <article className="card-interactive group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <Image
          src={photos[photoIndex] ?? tour.heroImage}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />

        {tour.badge && <span className="badge-accent absolute left-4 top-4">{tour.badge}</span>}

        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-2 backdrop-blur-md">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPhotoIndex(idx)}
                aria-label={`Show photo ${idx + 1} of ${photos.length}`}
                aria-pressed={idx === photoIndex}
                className={cn("h-1.5 rounded-full transition-all", idx === photoIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80")}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {tour.kind === "day" ? "Full day" : `${tour.durationDays} days`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {tour.bestSeason}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-fly-cyan-700">{tour.themes.slice(0, 2).map((t) => THEME_LABELS[t]).join(" · ")}</p>
        <h3 className="mt-2 text-xl font-bold leading-snug text-fly-navy-900">
          <Link href={`/tours/${tour.slug}`} className="transition-colors hover:text-fly-cyan-700">
            {tour.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{detailed ? tour.summary : tour.tagline}</p>

        <p className="mt-4 text-[13px] font-medium leading-relaxed text-slate-600">{tour.route.join("  →  ")}</p>

        <ul className="mb-6 mt-5 space-y-2.5">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-slate-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-fly-cyan" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs text-slate-400">From, per person</p>
            <p className="mt-0.5 font-display text-2xl font-bold text-fly-navy-900">
              <Price usd={fromPrice(tour)} />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/tours/${tour.slug}`} className="btn-secondary btn-sm">
              Details
            </Link>
            <Link href={`/book/${tour.slug}`} className="btn-primary btn-sm">
              Book
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
