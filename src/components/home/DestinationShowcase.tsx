"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Compass, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
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
    "Western Coast",
  ];

  const filtered =
    selectedRegion === "All"
      ? SRI_LANKA_DESTINATIONS
      : SRI_LANKA_DESTINATIONS.filter((d) => d.region === selectedRegion);

  return (
    <section id="destinations" className="py-20 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fly-navy-50 text-fly-navy-900 text-xs font-bold uppercase tracking-wider mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-fly-orange" />
              <span>Iconic Sri Lanka Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal font-serif text-fly-navy tracking-tight">
              A Tapestry of <span className="italic">Wonder</span>.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light max-w-xl leading-relaxed">
              From emerald mountain mist and UNESCO citadels to wild leopard scrublands and sapphire coastlines. Discover the regions included in your Fly Amazing holiday.
            </p>
          </div>

          {/* Region Filter Pills */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-1.5">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? "bg-fly-navy text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dest, i) => {
            const isWide = i === 0 || i === 4;

            return (
              <div
                key={dest.id}
                className={`group rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-slate-900 text-white relative ${
                  isWide ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                {/* Background Image Banner */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={dest.bannerImage}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.78]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>

                  {/* Region badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {dest.region}
                    </span>
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <h3 className="text-xl sm:text-2xl font-normal font-serif text-white">{dest.name}</h3>
                    <p className="text-xs text-fly-cyan-200 mt-0.5 line-clamp-1 font-light">
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Info & Action Footer */}
                <div className="p-4 sm:p-5 bg-white text-slate-800 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-3 line-clamp-2">
                      {dest.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {dest.highlights.slice(0, 3).map((hl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-light"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Rec. Stay: <strong className="text-fly-navy font-bold">{dest.recommendedNights} Nights</strong>
                    </span>

                    <button
                      onClick={() => onSelectDestinationForTour(dest)}
                      className="px-3.5 py-1.5 rounded-xl bg-fly-cyan-50 hover:bg-fly-cyan text-fly-cyan-900 hover:text-white text-xs font-bold transition flex items-center space-x-1"
                    >
                      <span>Add to Custom Tour</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
