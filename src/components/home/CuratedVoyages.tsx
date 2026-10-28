"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Clock, MapPin, Check, ArrowRight, ChevronDown, ChevronUp, Plane, ShieldCheck } from "lucide-react";
import { CURATED_PACKAGES, CuratedPackage } from "@/data/packages";

interface CuratedVoyagesProps {
  onCustomizePackage: (pkg: CuratedPackage) => void;
  onBookPackage: (pkg: CuratedPackage) => void;
}

export default function CuratedVoyages({
  onCustomizePackage,
  onBookPackage,
}: CuratedVoyagesProps) {
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPackageId(expandedPackageId === id ? null : id);
  };

  return (
    <section id="curated-packages" className="py-20 bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-fly-cyan-50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-fly-orange-50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fly-cyan-100/70 border border-fly-cyan-200 text-xs font-bold text-fly-cyan-900 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
            <span>Mastercrafted Sri Lanka Expeditions</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal font-serif text-fly-navy tracking-tight leading-tight">
            Curated Ceylon Voyages. <br />
            <span className="italic font-normal text-fly-cyan">Ready to Experience or Customise.</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-xl mx-auto">
            Every voyage unifies international flights from Australia, handpicked boutique stays, your private vehicle, and local clearances. Choose an itinerary or tailor it to your desire.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CURATED_PACKAGES.map((pkg, index) => {
            const isExpanded = expandedPackageId === pkg.id;
            const isFeatured = index === 0 || index === 3;

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group ${
                  isFeatured ? "lg:col-span-2" : "lg:col-span-1"
                }`}
              >
                {/* Image Banner Header */}
                <div className="relative h-60 sm:h-64 w-full overflow-hidden">
                  <Image
                    src={pkg.cardImage}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-fly-orange text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {pkg.badge}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                      {pkg.recommendedSeason}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <div className="flex items-center space-x-2 text-[11px] font-semibold text-fly-cyan-200 mb-0.5">
                      <Clock className="w-3 h-3 text-fly-orange" />
                      <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
                      <span>•</span>
                      <Plane className="w-3 h-3 text-fly-cyan-200" />
                      <span>Flights Included</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-normal font-serif text-white leading-tight">
                      {pkg.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tagline */}
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-fly-cyan-700 mb-2">
                      {pkg.tagline}
                    </p>

                    {/* Overview */}
                    <p className="text-xs sm:text-sm text-slate-600 font-light line-clamp-3 mb-4 leading-relaxed">
                      {pkg.overview}
                    </p>

                    {/* Route Chips */}
                    <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-fly-orange" />
                        <span>Route Nodes:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.route.map((stop, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                          >
                            {stop}
                            {i < pkg.route.length - 1 && " →"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights bullet points */}
                    <ul className="space-y-1.5 mb-5 text-xs text-slate-700">
                      {pkg.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-fly-cyan mt-0.5 flex-shrink-0" />
                          <span className="font-light">{h}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Expandable Day-by-Day Flow */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-slate-50 p-3.5 rounded-xl mb-3">
                        <h4 className="text-xs font-bold text-fly-navy uppercase tracking-wider">
                          Journey Itinerary:
                        </h4>
                        <div className="space-y-2">
                          {pkg.itinerary.map((day) => (
                            <div key={day.day} className="border-l-2 border-fly-cyan pl-2.5 py-0.5">
                              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                                <span className="text-fly-orange">Day {day.day}:</span>
                                <span className="font-serif text-xs">{day.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 font-light mt-0.5 leading-relaxed">
                                {day.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Action Footer */}
                  <div className="pt-3.5 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-medium tracking-wider block">
                          Per Person (All-Inclusive)
                        </span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xl sm:text-2xl font-normal font-serif text-fly-navy">
                            ${pkg.priceAUD.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-slate-500">AUD</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleExpand(pkg.id)}
                        className="text-xs font-bold text-fly-cyan-700 hover:text-fly-cyan flex items-center space-x-1 p-1"
                      >
                        <span>{isExpanded ? "Hide" : "Details"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="py-2 px-2.5 rounded-xl border border-fly-cyan/40 bg-fly-cyan-50/50 hover:bg-fly-cyan text-fly-cyan-900 hover:text-white text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <span>Full Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => onBookPackage(pkg)}
                        className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white text-xs font-bold shadow-sm shadow-fly-orange/20 transition flex items-center justify-center space-x-1"
                      >
                        <span>Book Voyage</span>
                      </button>
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
