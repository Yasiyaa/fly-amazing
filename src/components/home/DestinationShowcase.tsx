"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Compass, ArrowRight, Sparkles, Plus } from "lucide-react";
import { SRI_LANKA_DESTINATIONS, Destination } from "@/data/destinations";

interface DestinationShowcaseProps {
  onSelectDestinationForTour: (dest: Destination) => void;
}

export default function DestinationShowcase({
  onSelectDestinationForTour,
}: DestinationShowcaseProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const regions = [
    "All",
    "Cultural Triangle",
    "Central Highlands",
    "Southern Coast",
    "Deep South Wildlife",
  ];

  const filtered =
    selectedRegion === "All"
      ? SRI_LANKA_DESTINATIONS
      : SRI_LANKA_DESTINATIONS.filter((d) => d.region === selectedRegion);

  return (
    <section id="destinations" className="py-16 sm:py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header: Minimal & Bold */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-fly-navy-50 text-fly-navy-900 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-fly-orange" />
              <span>Visual Destination Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-fly-navy tracking-tight">
              SRI LANKA WONDERS
            </h2>
          </div>

          {/* Region Filter Pills */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedRegion === reg
                    ? "bg-fly-navy text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Masonry / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest, i) => {
            const isWide = i === 0 || i === 3;

            return (
              <div
                key={dest.id}
                className={`group rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 bg-slate-900 text-white relative ${
                  isWide ? "sm:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                {/* Background Full-Bleed Image */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <Image
                    src={dest.bannerImage}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.78]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                  {/* Top Region Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider border border-white/20">
                      {dest.region}
                    </span>
                  </div>

                  {/* Add To Architect Quick Button */}
                  <button
                    onClick={() => onSelectDestinationForTour(dest)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-fly-orange text-white flex items-center justify-center transition-all shadow-md group-hover:scale-105"
                    title={`Add ${dest.name} to Custom Tour`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  {/* Minimal Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                      {dest.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-fly-cyan-200 font-medium mt-0.5 line-clamp-1">
                      {dest.tagline}
                    </p>

                    {/* Quick Highlights Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {dest.highlights.slice(0, 3).map((h, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-medium text-slate-200"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
