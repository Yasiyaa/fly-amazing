"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, Plane, ArrowRight } from "lucide-react";
import { CuratedPackage } from "@/data/packages";
import { SRI_LANKA_DESTINATIONS } from "@/data/destinations";
import { cn, formatAUD } from "@/lib/utils";

interface PackageCardProps {
  pkg: CuratedPackage;
  onBook: (pkg: CuratedPackage) => void;
  /** Show the written overview and full highlight list (catalogue page). */
  detailed?: boolean;
}

export default function PackageCard({ pkg, onBook, detailed = false }: PackageCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Package photography plus the banners of the destinations it covers
  const photos = useMemo(() => {
    const destImages = pkg.destinationsCovered
      .map((id) => SRI_LANKA_DESTINATIONS.find((d) => d.id === id)?.bannerImage)
      .filter((img): img is string => Boolean(img));
    return Array.from(new Set([pkg.cardImage, pkg.bannerImage, ...destImages])).slice(0, 4);
  }, [pkg]);

  const highlights = detailed ? pkg.highlights : pkg.highlights.slice(0, 3);

  return (
    <article className="card-interactive group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <Image
          src={photos[photoIndex] ?? pkg.cardImage}
          alt={pkg.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-2">
          <span className="badge-accent">{pkg.badge}</span>
        </div>

        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-2 backdrop-blur-md">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPhotoIndex(idx)}
                aria-label={`Show photo ${idx + 1} of ${photos.length}`}
                aria-pressed={idx === photoIndex}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === photoIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {pkg.durationDays} days
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5" />
            Flights included
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs font-medium text-fly-cyan-700">{pkg.recommendedSeason}</p>
        <h3 className="mt-2 text-xl font-bold leading-snug text-fly-navy-900 sm:text-2xl">
          <Link href={`/packages/${pkg.id}`} className="transition-colors hover:text-fly-cyan-700">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{detailed ? pkg.overview : pkg.tagline}</p>

        <p className="mt-4 text-[13px] font-medium leading-relaxed text-slate-600">
          {pkg.route.join("  →  ")}
        </p>

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
              {formatAUD(pkg.priceAUD)} <span className="text-sm font-medium text-slate-400">AUD</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/packages/${pkg.id}`} className="btn-secondary btn-sm">
              Details
            </Link>
            <button type="button" onClick={() => onBook(pkg)} className="btn-primary btn-sm">
              Enquire
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
