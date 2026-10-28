"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCinema from "@/components/home/HeroCinema";
import CuratedVoyages from "@/components/home/CuratedVoyages";
import PanoramicBannerBreak from "@/components/home/PanoramicBannerBreak";
import DestinationShowcase from "@/components/home/DestinationShowcase";
import WhyFlyAmazing from "@/components/home/WhyFlyAmazing";
import TourArchitectStudio, { SelectedStop } from "@/components/architect/TourArchitectStudio";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";
import { AustralianAirport, AUSTRALIAN_AIRPORTS } from "@/data/australianAirports";
import { CuratedPackage } from "@/data/packages";
import { Destination } from "@/data/destinations";
import { ArrowRight, Sparkles, Plane, Compass, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [selectedAirport, setSelectedAirport] = useState<AustralianAirport>(AUSTRALIAN_AIRPORTS[0]);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [modalTourData, setModalTourData] = useState<{
    type: "custom" | "package";
    packageName?: string;
    stops?: SelectedStop[];
    totalDays?: number;
    totalNights?: number;
    departureAirport?: AustralianAirport;
    vehicleType?: string;
    totalEstimatedAUD: number;
    curatedPackage?: CuratedPackage;
  } | null>(null);

  // Trigger from Tour Architect
  const handleFinalizeCustomTour = (tourState: {
    stops: SelectedStop[];
    totalDays: number;
    totalNights: number;
    departureAirport: AustralianAirport;
    vehicleType: string;
    totalEstimatedAUD: number;
  }) => {
    setModalTourData({
      type: "custom",
      stops: tourState.stops,
      totalDays: tourState.totalDays,
      totalNights: tourState.totalNights,
      departureAirport: tourState.departureAirport,
      vehicleType: tourState.vehicleType,
      totalEstimatedAUD: tourState.totalEstimatedAUD,
    });
    setIsFinalizeModalOpen(true);
  };

  // Trigger from Curated Package "Book Voyage"
  const handleBookCuratedPackage = (pkg: CuratedPackage) => {
    setModalTourData({
      type: "package",
      packageName: pkg.title,
      curatedPackage: pkg,
      totalDays: pkg.durationDays,
      totalNights: pkg.durationNights,
      departureAirport: selectedAirport,
      totalEstimatedAUD: pkg.priceAUD,
    });
    setIsFinalizeModalOpen(true);
  };

  const handleCustomizePackage = (pkg: CuratedPackage) => {
    const el = document.getElementById("tour-architect");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectDestinationForTour = (dest: Destination) => {
    const el = document.getElementById("tour-architect");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenArchitect = () => {
    const el = document.getElementById("tour-architect");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Cinematic Hero Section with Parallax Image Slider & Smart Booking Island */}
      <HeroCinema
        onSelectDeparture={setSelectedAirport}
        onOpenArchitect={handleOpenArchitect}
      />

      {/* 3. Panoramic Banner Break 1: Genuine Sigiriya Lion Rock Fortress */}
      <PanoramicBannerBreak
        image="https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=2000&auto=format&fit=crop"
        badge="Cultural Triangle Landmark"
        title="Ascend King Kashyapa’s 5th-Century Sky Fortress."
        subtitle="Rising 200 metres sheer above ancient royal water gardens and jungle mist, Sigiriya Lion Rock is an engineering wonder of the ancient world."
        quote="Standing atop the Lion Rock at sunrise is an experience that will stay with you forever."
        actionText="Explore Tour Packages Including Sigiriya"
        onAction={() => {
          window.location.href = "/packages";
        }}
      />

      {/* 4. Curated Master Voyages Showcase */}
      <CuratedVoyages
        onCustomizePackage={handleCustomizePackage}
        onBookPackage={handleBookCuratedPackage}
      />

      {/* View All Packages Navigation Banner */}
      <div className="bg-slate-50 pb-16 text-center">
        <Link
          href="/packages"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-fly-navy hover:bg-fly-navy-800 text-white font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <span>View All Curated Itineraries & Categories</span>
          <ArrowRight className="w-5 h-5 text-fly-orange" />
        </Link>
      </div>

      {/* 5. Panoramic Banner Break 2: Ella Nine Arch Bridge */}
      <PanoramicBannerBreak
        image="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop"
        badge="Central Highlands & Tea Trails"
        title="The Legendary Vintage Blue Train Through the Clouds."
        subtitle="Wind past emerald tea carpet valleys, mountain gorges, and across the hand-cut stone arches of Ella's Nine Arch Bridge in reserved first-class luxury."
        quote="Ranked among the top 5 most scenic train journeys on planet Earth."
        actionText="Design Hill Country Circuit in Studio"
        onAction={handleOpenArchitect}
      />

      {/* 6. The Interactive Bespoke Tour Architect Canvas */}
      <TourArchitectStudio
        onFinalizeTour={handleFinalizeCustomTour}
        initialAirport={selectedAirport}
      />

      {/* 7. Panoramic Banner Break 3: Yala Leopard Wilderness */}
      <PanoramicBannerBreak
        image="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000&auto=format&fit=crop"
        badge="Deep South Safari Expedition"
        title="Where Untamed Leopards Roam the Coastal Scrublands."
        subtitle="Yala National Park hosts the highest density of leopards in the world. Experience dawn and dusk game tracking with your private certified wildlife naturalist."
        quote="Three leopard encounters in two days, plus wild elephant herds splashing in coastal lagoons."
        actionText="Read Sri Lanka Destination Guide"
        onAction={() => {
          window.location.href = "/destinations";
        }}
      />

      {/* 8. Regional Destination Explorer */}
      <DestinationShowcase onSelectDestinationForTour={handleSelectDestinationForTour} />

      {/* 9. Trust Pillars & Why Australian Travelers Choose Fly Amazing */}
      <WhyFlyAmazing />

      {/* 10. Global Footer */}
      <Footer />

      {/* 11. Tour Finalization & Automated Admin Email Modal */}
      <TourFinalizeModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        tourData={modalTourData}
      />
    </main>
  );
}
