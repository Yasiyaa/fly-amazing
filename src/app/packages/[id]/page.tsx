"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CURATED_PACKAGES } from "@/data/packages";
import { Clock, Plane, MapPin, Check, ArrowRight, ShieldCheck, Sparkles, Calendar, Car, HelpCircle } from "lucide-react";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";

export default function PackageDetailPage() {
  const params = useParams();
  const pkgId = params?.id as string;
  const pkg = CURATED_PACKAGES.find((p) => p.id === pkgId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!pkg) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-40 text-center max-w-lg mx-auto px-4">
          <h2 className="text-3xl font-display text-fly-navy">Package Not Found</h2>
          <p className="mt-3 text-slate-600 font-light">The requested voyage could not be found.</p>
          <Link href="/packages" className="mt-6 inline-block px-6 py-3 rounded-full bg-fly-orange text-white font-bold">
            Browse All Packages
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end pb-16 pt-32 overflow-hidden bg-fly-navy-950">
        <Image
          src={pkg.bannerImage}
          alt={pkg.title}
          fill
          priority
          className="object-cover brightness-[0.68]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/40 to-black/30"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1.5 rounded-full bg-fly-orange text-white text-xs font-black uppercase tracking-wider shadow">
              {pkg.badge}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
              Season: {pkg.recommendedSeason}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-fly-cyan-900/60 border border-fly-cyan-400 text-fly-cyan-200 text-xs font-semibold flex items-center space-x-1">
              <Plane className="w-3.5 h-3.5" />
              <span>International Flights from Australia Included</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-tight max-w-4xl uppercase">
            {pkg.title}
          </h1>

          <p className="mt-3 text-base sm:text-xl text-fly-cyan-100 font-light max-w-2xl">
            {pkg.tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-200 border-t border-white/20 pt-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-fly-orange" />
              <span><strong>{pkg.durationDays} Days / {pkg.durationNights} Nights</strong></span>
            </div>
            <div>•</div>
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-fly-cyan" />
              <span>Private AC Vehicle & Personal Chauffeur</span>
            </div>
            <div>•</div>
            <div className="text-2xl font-display text-fly-orange font-bold">
              ${pkg.priceAUD.toLocaleString()} <span className="text-xs font-sans text-slate-300 font-bold">AUD pp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dossier Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Itinerary Narrative & Day by Day (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-fly-cyan-700 block">
                Expedition Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-display text-fly-navy font-normal">
                Journey Description
              </h2>
              <p className="text-base sm:text-lg text-slate-700 font-light leading-relaxed">
                {pkg.overview}
              </p>

              {/* Highlights */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
                  Signature Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-800">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <Check className="w-4 h-4 text-fly-orange mt-1 flex-shrink-0" />
                      <span className="font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Day by Day Flow */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-fly-orange block">
                    Day-by-Day Journey Flow
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display text-fly-navy font-normal">
                    Complete Tour Itinerary
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {pkg.itinerary.length} Days Mapped
                </span>
              </div>

              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-fly-cyan transition"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 rounded-xl bg-fly-navy text-white text-xs font-bold font-sans">
                          Day {day.day}
                        </span>
                        <h3 className="text-lg sm:text-xl font-display text-slate-900 font-normal">
                          {day.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-fly-cyan-700 bg-fly-cyan-50 px-3 py-1 rounded-full border border-fly-cyan-200 flex-shrink-0">
                        {day.destinationName}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed mt-3">
                      {day.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs sm:text-sm text-slate-500 font-medium">
                      <span className="text-fly-orange font-bold">🏨 Overnight Stay:</span>
                      <strong className="text-slate-800">{day.overnight}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-2xl font-display text-fly-navy font-normal">
                What’s Included in Your Voyage
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                {pkg.inclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="font-light">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block">
                  All-Inclusive Package Price
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl font-display text-fly-navy font-normal">
                    ${pkg.priceAUD.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-500">AUD / person</span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mt-2">
                  ✓ International Flights Included
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <strong className="text-slate-900">{pkg.durationDays} Days / {pkg.durationNights} Nights</strong>
                </div>
                <div className="flex justify-between">
                  <span>Departing From:</span>
                  <strong className="text-slate-900">MEL, SYD, BNE, PER, ADL</strong>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <strong className="text-slate-900">Private Chauffeured Sedan / Van</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hotels:</span>
                  <strong className="text-slate-900">4 & 5-Star Handpicked Estates</strong>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white font-bold text-base shadow-xl shadow-fly-orange/30 transition text-center"
                >
                  Book This Voyage
                </button>

                <Link
                  href="/tour-architect"
                  className="w-full py-3.5 rounded-2xl border border-fly-cyan text-fly-cyan-900 hover:bg-fly-cyan-50 font-bold text-sm transition flex items-center justify-center space-x-1.5 text-center"
                >
                  <span>Customise Route in Architect</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-xs text-center text-slate-400 font-light">
                No immediate payment required. We check seat allocations and dispatch your full itinerary to admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <TourFinalizeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourData={{
          type: "package",
          packageName: pkg.title,
          curatedPackage: pkg,
          totalEstimatedAUD: pkg.priceAUD,
        }}
      />
    </main>
  );
}
