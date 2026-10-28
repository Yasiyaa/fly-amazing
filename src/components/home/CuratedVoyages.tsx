"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CURATED_PACKAGES, CuratedPackage } from "@/data/packages";
import SectionHeader from "@/components/ui/SectionHeader";
import PackageCard from "@/components/ui/PackageCard";

interface CuratedVoyagesProps {
  onBookPackage: (pkg: CuratedPackage) => void;
}

const FEATURED_COUNT = 4;

export default function CuratedVoyages({ onBookPackage }: CuratedVoyagesProps) {
  return (
    <section id="curated-packages" className="section bg-slate-50">
      <div className="container-page">
        <SectionHeader
          eyebrow="Curated packages"
          title="Signature journeys, flights included"
          description="Return flights from Australia, a private chauffeur-guide and handpicked 4 and 5-star stays."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {CURATED_PACKAGES.slice(0, FEATURED_COUNT).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onBook={onBookPackage} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/packages" className="btn-navy btn-lg">
            See all {CURATED_PACKAGES.length} packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
