"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Clock, MapPin, Check, ArrowRight, Plane, Star, Camera } from "lucide-react";
import { CURATED_PACKAGES, CuratedPackage } from "@/data/packages";
import { SRI_LANKA_DESTINATIONS } from "@/data/destinations";

interface CuratedVoyagesProps {
  onCustomizePackage: (pkg: CuratedPackage) => void;
  onBookPackage: (pkg: CuratedPackage) => void;
}

export default function CuratedVoyages({
  onCustomizePackage,
  onBookPackage,
}: CuratedVoyagesProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<{ [key: string]: number }>({});

  const handlePhotoSelect = (pkgId: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => ({ ...prev, [pkgId]: idx }));
  };

  return (
    <section id="curated-packages" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-fly-cyan-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-fly-orange-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header: Minimal & Punchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-fly-cyan-100/70 border border-fly-cyan-200 text-xs font-bold text-fly-cyan-900 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
              <span>Tailored Ceylon Holidays</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-fly-navy tracking-tight">
              CURATED VOYAGES
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-slate-500 text-sm sm:text-base max-w-md font-normal">
            All-inclusive packages bundled with Australian departures, private chauffeured vehicles, and boutique stays.
          </p>
        </div>

        {/* Visual Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CURATED_PACKAGES.map((pkg) => {
            // Collect gallery images for this package from package and destination banners
            const destImages = pkg.destinationsCovered
              .map((dId) => SRI_LANKA_DESTINATIONS.find((dest) => dest.id === dId)?.bannerImage)
              .filter((img): img is string => Boolean(img));

            const allImages = Array.from(new Set([pkg.cardImage, pkg.bannerImage, ...destImages])).slice(0, 4);

            const activeIdx = selectedPhotoIndex[pkg.id] || 0;
            const displayImage = allImages[activeIdx] || pkg.cardImage;

            return (
              <div
                key={pkg.id}
                className="group rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Large Visual Photography Canvas */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={displayImage}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.88]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                    <span className="px-3 py-1 rounded-full bg-fly-orange text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                      {pkg.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                      {pkg.recommendedSeason}
                    </span>
                  </div>

                  {/* Multiple Photo Thumbnails Switcher */}
                  <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                    <Camera className="w-3.5 h-3.5 text-white/70 ml-1.5" />
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handlePhotoSelect(pkg.id, idx, e)}
                        className={`w-5 h-5 rounded-full overflow-hidden border-2 transition-all ${
                          idx === activeIdx ? "border-fly-orange scale-110" : "border-white/50 opacity-60 hover:opacity-100"
                        }`}
                        title={`View photo ${idx + 1}`}
                      >
                        <Image src={img} alt="thumbnail" width={20} height={20} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Title & Timing on Image Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <div className="flex items-center space-x-2 text-xs font-bold text-fly-cyan-300 uppercase tracking-wider mb-1">
                      <Clock className="w-3.5 h-3.5 text-fly-orange" />
                      <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                      <span>&bull;</span>
                      <Plane className="w-3.5 h-3.5 text-fly-cyan-300" />
                      <span>Flights Included</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                      {pkg.title}
                    </h3>
                  </div>
                </div>

                {/* Minimal Card Footer: Tags & Pricing */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  {/* Route Chain & Quick Badges */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pkg.route.map((stop, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                        >
                          {stop} {i < pkg.route.length - 1 && "→"}
                        </span>
                      ))}
                    </div>

                    {/* Minimal Highlights (3 short items max) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                      {pkg.highlights.slice(0, 4).map((h, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                          <Check className="w-4 h-4 text-fly-cyan flex-shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                        All-Inclusive (Flights + Stays)
                      </span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl sm:text-3xl font-extrabold font-display text-fly-navy">
                          ${pkg.priceAUD.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-500">AUD / person</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="py-2.5 px-4 rounded-xl border border-slate-300 hover:border-fly-cyan hover:bg-fly-cyan-50 text-slate-800 hover:text-fly-cyan-900 text-xs font-bold transition"
                      >
                        View Photos
                      </Link>
                      <button
                        onClick={() => onBookPackage(pkg)}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-fly-orange to-amber-600 hover:from-amber-600 hover:to-fly-orange text-white text-xs font-extrabold shadow-md shadow-fly-orange/25 transition hover:scale-105"
                      >
                        Book Package
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
