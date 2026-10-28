"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCinema from "@/components/home/HeroCinema";
import CinematicReelWall from "@/components/home/CinematicReelWall";
import CuratedVoyages from "@/components/home/CuratedVoyages";
import PanoramicBannerBreak from "@/components/home/PanoramicBannerBreak";
import DestinationShowcase from "@/components/home/DestinationShowcase";
import WhyFlyAmazing from "@/components/home/WhyFlyAmazing";
import TourArchitectStudio, { SelectedStop } from "@/components/architect/TourArchitectStudio";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";
import { AustralianAirport, AUSTRALIAN_AIRPORTS } from "@/data/australianAirports";
import { CuratedPackage } from "@/data/packages";
import { Destination } from "@/data/destinations";
import { ArrowRight, Sparkles, Plane, Compass } from "lucide-react";

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

      {/* 2. Cinematic Hero Section with 4K Looping Drone Videos, Photos & Booking Capsule */}
      <HeroCinema
        onSelectDeparture={setSelectedAirport}
        onOpenArchitect={handleOpenArchitect}
      />

      {/* 3. NEW: Interactive 4K Video Wall / Cinema Showcase */}
      <CinematicReelWall />

      {/* 4. Curated Master Voyages Showcase with Multi-Photo Selectors */}
      <CuratedVoyages
        onCustomizePackage={handleCustomizePackage}
        onBookPackage={handleBookCuratedPackage}
      />

      {/* View All Packages Quick Bar */}
      <div className="bg-slate-50 pb-12 text-center">
        <Link
          href="/packages"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-fly-navy hover:bg-fly-navy-800 text-white font-extrabold text-sm shadow-xl transition-all transform hover:scale-105"
        >
          <span>Explore All 24+ Curated Itineraries</span>
          <ArrowRight className="w-4 h-4 text-fly-orange" />
        </Link>
      </div>

      {/* 5. Panoramic Video Break: Sigiriya Sky Fortress */}
      <PanoramicBannerBreak
        image="https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=2000&auto=format&fit=crop"
        videoUrl="https://assets.mixkit.co/videos/1496/1496-720.mp4"
        badge="Cultural Triangle Citadel"
        title="SIGIRIYA ROCK FORTRESS"
        subtitle="5th-century sky fortress towering 200m above emerald rainforests and royal water gardens."
        actionText="Explore Sigiriya Packages"
        onAction={() => {
          window.location.href = "/packages";
        }}
      />

      {/* 6. The Interactive Bespoke Tour Architect Canvas */}
      <TourArchitectStudio
        onFinalizeTour={handleFinalizeCustomTour}
        initialAirport={selectedAirport}
      />

      {/* 7. Panoramic Video Break: Ella Highlands */}
      <PanoramicBannerBreak
        image="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop"
        videoUrl="https://assets.mixkit.co/videos/42283/42283-720.mp4"
        badge="Central Highlands & Tea Mist"
        title="ELLA NINE ARCH BRIDGE"
        subtitle="The iconic colonial viaduct nestled in mountain tea gardens and clouds."
        actionText="Build Custom Hill Country Tour"
        onAction={handleOpenArchitect}
      />

      {/* 8. Regional Destination Photo Wall */}
      <DestinationShowcase onSelectDestinationForTour={handleSelectDestinationForTour} />

      {/* 9. Trust Pillars: Clean Minimal Grid */}
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
