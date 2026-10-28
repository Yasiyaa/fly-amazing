"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CURATED_PACKAGES, CuratedPackage } from "@/data/packages";
import { Sparkles, Clock, MapPin, Check, ArrowRight, Plane, Filter, SlidersHorizontal } from "lucide-react";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";

export default function PackagesCatalogPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [modalPackage, setModalPackage] = useState<CuratedPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    { label: "All Packages", value: "All" },
    { label: "Highlands & Tea Trails", value: "Highlands" },
    { label: "Wildlife & Safari", value: "Wildlife" },
    { label: "Cultural Kingdoms", value: "Culture" },
    { label: "Coastal & Surf", value: "Coastal" },
  ];

  const filteredPackages = CURATED_PACKAGES.filter((pkg) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Highlands") return pkg.destinationsCovered.includes("nuwara-eliya") || pkg.destinationsCovered.includes("ella");
    if (selectedFilter === "Wildlife") return pkg.destinationsCovered.includes("yala");
    if (selectedFilter === "Culture") return pkg.destinationsCovered.includes("sigiriya") || pkg.destinationsCovered.includes("kandy");
    if (selectedFilter === "Coastal") return pkg.destinationsCovered.includes("mirissa") || pkg.destinationsCovered.includes("galle");
    return true;
  });

  const handleBook = (pkg: CuratedPackage) => {
    setModalPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 sm:pt-40 pb-20 bg-fly-navy-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop"
            alt="Curated Sri Lanka Tour Packages"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-fly-cyan-200 uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-4 h-4 text-fly-orange" />
            <span>Handcrafted Sri Lanka Expeditions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-tight uppercase">
            Curated Sri Lanka Voyages
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-medium">
            All-inclusive luxury journeys: return flights from Australia, 5-star handpicked estates, and a private chauffeur.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
            <Filter className="w-4 h-4 text-fly-orange" />
            <span>Filter Itineraries:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSelectedFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedFilter === f.value
                    ? "bg-fly-navy text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            Showing <strong className="text-fly-navy">{filteredPackages.length}</strong> mastercrafted voyages
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image Banner */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <Image
                  src={pkg.cardImage}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-3 py-1.5 rounded-full bg-fly-orange text-white text-xs font-black uppercase tracking-wider shadow-md">
                    {pkg.badge}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                    {pkg.recommendedSeason}
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-fly-cyan-200 mb-1">
                    <Clock className="w-4 h-4 text-fly-orange" />
                    <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                    <span>•</span>
                    <Plane className="w-4 h-4 text-fly-cyan-200" />
                    <span>Flights Included</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-normal font-display text-white leading-tight">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-fly-cyan-700 mb-3">
                    {pkg.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed mb-6">
                    {pkg.overview}
                  </p>

                  {/* Route */}
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 block mb-2">
                      Journey Nodes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pkg.route.map((r, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200"
                        >
                          {r} {idx < pkg.route.length - 1 && "→"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2.5 mb-6 text-sm text-slate-700">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-fly-cyan mt-1 flex-shrink-0" />
                        <span className="font-light">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-medium tracking-wider block">
                      Starting Price (Per Person)
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-3xl font-normal font-display text-fly-navy">
                        ${pkg.priceAUD.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-slate-500 font-sans">AUD</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="px-5 py-3 rounded-2xl border border-fly-cyan/40 bg-fly-cyan-50 text-fly-cyan-900 hover:bg-fly-cyan hover:text-white font-bold text-sm transition flex items-center space-x-1.5"
                    >
                      <span>Full Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleBook(pkg)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white font-bold text-sm shadow-md shadow-fly-orange/20 transition"
                    >
                      Book Voyage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Build custom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div>
            <h3 className="text-2xl sm:text-3xl font-normal font-display text-white">
              Want a Tailored Route Just for You?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-light mt-2 max-w-xl">
              Use our interactive Tour Architect to pick your exact destinations, choose stay durations, and select hotels with real reviews.
            </p>
          </div>
          <Link
            href="/tour-architect"
            className="px-8 py-4 rounded-full bg-fly-orange hover:bg-fly-orange-600 text-white font-bold text-base transition shadow-xl shadow-fly-orange/30 flex-shrink-0"
          >
            Launch Tour Architect Studio &rarr;
          </Link>
        </div>
      </section>

      <Footer />

      <TourFinalizeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourData={
          modalPackage
            ? {
                type: "package",
                packageName: modalPackage.title,
                curatedPackage: modalPackage,
                totalEstimatedAUD: modalPackage.priceAUD,
              }
            : null
        }
      />
    </main>
  );
}
