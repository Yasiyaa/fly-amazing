"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SRI_LANKA_DESTINATIONS, Destination } from "@/data/destinations";
import { MapPin, Compass, ArrowRight, Sparkles, Filter, ChevronRight, Clock, Star } from "lucide-react";

export default function DestinationsPage() {
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
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 sm:pt-40 pb-20 bg-fly-navy-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000&auto=format&fit=crop"
            alt="Sri Lanka Destinations"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-fly-cyan-200 uppercase tracking-[0.2em] mb-4">
            <MapPin className="w-4 h-4 text-fly-orange" />
            <span>Sri Lanka Regional Traveler Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-tight uppercase">
            Sri Lanka Destinations
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-medium">
            From the 5th-century Sigiriya Citadel to misty Ella tea trails and wild Yala leopard scrublands.
          </p>
        </div>
      </section>

      {/* Region Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
            <Filter className="w-4 h-4 text-fly-orange" />
            <span>Filter by Region:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedRegion === reg
                    ? "bg-fly-navy text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            Showing <strong className="text-fly-navy">{filtered.length}</strong> curated regions
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between hover:border-fly-cyan transition-all"
            >
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <Image
                  src={dest.bannerImage}
                  alt={dest.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 brightness-[0.78]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
                    {dest.region}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl sm:text-3xl font-normal font-display text-white">{dest.name}</h3>
                  <p className="text-xs sm:text-sm text-fly-cyan-200 mt-1 font-light">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed mb-6">
                    {dest.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 block mb-2">
                        Top Activities & Excursions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {dest.highlights.map((hl, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium"
                          >
                            ✓ {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                      <span className="font-bold block mb-1">💡 Insider Traveler Tip:</span>
                      <span className="font-light leading-relaxed text-amber-800">{dest.travelTips}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Recommended Stay: <strong className="text-fly-navy font-bold">{dest.recommendedNights} Nights</strong>
                  </span>

                  <Link
                    href="/tour-architect"
                    className="px-5 py-2.5 rounded-2xl bg-fly-cyan-50 hover:bg-fly-cyan text-fly-cyan-900 hover:text-white font-bold text-sm transition flex items-center space-x-1.5"
                  >
                    <span>Add to Tour Route</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
