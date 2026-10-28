"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import PackageCard from "@/components/ui/PackageCard";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";
import { CURATED_PACKAGES, CuratedPackage } from "@/data/packages";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; match: (pkg: CuratedPackage) => boolean }[] = [
  { label: "All packages", match: () => true },
  { label: "Highlands & tea", match: (p) => p.destinationsCovered.some((d) => d === "nuwara-eliya" || d === "ella") },
  { label: "Wildlife & safari", match: (p) => p.destinationsCovered.includes("yala") },
  { label: "Culture & heritage", match: (p) => p.destinationsCovered.some((d) => d === "sigiriya" || d === "kandy") },
  { label: "Coast & surf", match: (p) => p.destinationsCovered.some((d) => d === "mirissa" || d === "galle") },
];

export default function PackagesCatalogPage() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [modalPackage, setModalPackage] = useState<CuratedPackage | null>(null);

  const filteredPackages = CURATED_PACKAGES.filter(FILTERS[filterIndex].match);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <PageHero
        eyebrow="Curated packages"
        title="Sri Lanka holidays, flights included"
        subtitle="Return flights from Australia, handpicked 4 and 5-star stays and a private chauffeur-guide on every journey."
        image="https://images.unsplash.com/photo-1566766189268-ecac9118f2b7?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Blue train crossing the Nine Arch Bridge in Ella"
      />

      <section className="container-page relative z-10 -mt-12">
        <div className="card flex flex-col gap-4 p-4 shadow-lg shadow-fly-navy/5 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {FILTERS.map((f, i) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilterIndex(i)}
                aria-pressed={filterIndex === i}
                className={cn("filter-pill shrink-0", filterIndex === i ? "filter-pill-active" : "filter-pill-idle")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="shrink-0 text-sm text-slate-500" aria-live="polite">
            {filteredPackages.length} {filteredPackages.length === 1 ? "package" : "packages"}
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onBook={setModalPackage} detailed />
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-fly-navy-900 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fly-orange/20 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow-light">Tour Architect</p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">Prefer to design your own route?</h3>
              <p className="mt-3 text-slate-300">
                Choose your destinations, how long you stay and which hotels you love, with live pricing as you go.
              </p>
            </div>
            <Link href="/tour-architect" className="btn-primary btn-lg shrink-0">
              Open Tour Architect
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <TourFinalizeModal
        isOpen={modalPackage !== null}
        onClose={() => setModalPackage(null)}
        tourData={
          modalPackage
            ? {
                type: "package",
                packageName: modalPackage.title,
                curatedPackage: modalPackage,
                totalDays: modalPackage.durationDays,
                totalNights: modalPackage.durationNights,
                totalEstimatedAUD: modalPackage.priceAUD,
              }
            : null
        }
      />
    </main>
  );
}
