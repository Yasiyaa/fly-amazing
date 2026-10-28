"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SRI_LANKA_DESTINATIONS, Destination } from "@/data/destinations";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface DestinationShowcaseProps {
  onAddToTour: (dest: Destination) => void;
}

const REGIONS = ["All", ...Array.from(new Set(SRI_LANKA_DESTINATIONS.map((d) => d.region)))];

export default function DestinationShowcase({ onAddToTour }: DestinationShowcaseProps) {
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filtered =
    selectedRegion === "All" ? SRI_LANKA_DESTINATIONS : SRI_LANKA_DESTINATIONS.filter((d) => d.region === selectedRegion);

  // Widen tiles so the 3-column grid never leaves an orphaned gap
  const wideCount = (3 - (filtered.length % 3)) % 3;
  const wideIndexes = wideCount === 2 ? [0, 3] : wideCount === 1 ? [0] : [];

  return (
    <section id="destinations" className="section scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Destinations"
          title="Where Sri Lanka will take you"
          description="Nine regions, each a few hours apart. Add any of them straight to your tour."
        />

        <div className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {REGIONS.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              aria-pressed={selectedRegion === reg}
              className={cn(
                "filter-pill shrink-0",
                selectedRegion === reg ? "filter-pill-active" : "filter-pill-idle"
              )}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest, i) => {
            const isWide = filtered.length > 1 && wideIndexes.includes(i);
            const isSoloOrLastOdd = filtered.length === 1 || (filtered.length % 2 === 1 && i === filtered.length - 1);
            return (
              <div
                key={dest.id}
                className={cn(
                  "group relative h-80 overflow-hidden rounded-2xl bg-slate-900",
                  isSoloOrLastOdd && "sm:col-span-2",
                  isWide ? "lg:col-span-2" : isSoloOrLastOdd && "lg:col-span-1",
                  filtered.length === 1 && "lg:col-span-3"
                )}
              >
                <Image
                  src={dest.bannerImage}
                  alt={dest.name}
                  fill
                  sizes={isWide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <Link href={`/destinations#${dest.id}`} className="absolute inset-0" aria-label={`Read about ${dest.name}`} />

                <span className="chip-glass pointer-events-none absolute left-4 top-4">{dest.region}</span>

                <button
                  type="button"
                  onClick={() => onAddToTour(dest)}
                  className="absolute right-4 top-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-white/15 px-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-fly-orange"
                  aria-label={`Add ${dest.name} to my tour`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to tour</span>
                </button>

                <div className="pointer-events-none absolute inset-x-5 bottom-5 text-white">
                  <h3 className="text-2xl font-bold">{dest.name}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-200">{dest.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
