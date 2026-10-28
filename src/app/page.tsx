"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLenis } from "@/components/layout/SmoothScrollProvider";
import HeroCinema from "@/components/home/HeroCinema";
import CinematicReelWall from "@/components/home/CinematicReelWall";
import CuratedVoyages from "@/components/home/CuratedVoyages";
import PanoramicBannerBreak from "@/components/home/PanoramicBannerBreak";
import DestinationShowcase from "@/components/home/DestinationShowcase";
import WhyFlyAmazing from "@/components/home/WhyFlyAmazing";
import TourArchitectStudio from "@/components/architect/TourArchitectStudio";
import TourFinalizeModal, { FinalizeTourData } from "@/components/inquiry/TourFinalizeModal";
import { AustralianAirport, AUSTRALIAN_AIRPORTS } from "@/data/australianAirports";
import { CuratedPackage } from "@/data/packages";
import { Destination } from "@/data/destinations";
import { scrollToId } from "@/lib/useOverlay";

export default function HomePage() {
  const lenis = useLenis();
  const [selectedAirport, setSelectedAirport] = useState<AustralianAirport>(AUSTRALIAN_AIRPORTS[0]);
  const [requestedDestination, setRequestedDestination] = useState<{ id: string; nonce: number } | null>(null);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [modalTourData, setModalTourData] = useState<FinalizeTourData | null>(null);

  const openArchitect = () => scrollToId("tour-architect", lenis);

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

  const handleAddDestinationToTour = (dest: Destination) => {
    setRequestedDestination({ id: dest.id, nonce: Date.now() });
    openArchitect();
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <HeroCinema onSelectDeparture={setSelectedAirport} onOpenArchitect={openArchitect} />

      <CuratedVoyages onBookPackage={handleBookCuratedPackage} />

      <CinematicReelWall />

      <TourArchitectStudio
        initialAirport={selectedAirport}
        requestedDestination={requestedDestination}
        onFinalizeTour={(tour) => {
          setModalTourData({ type: "custom", ...tour });
          setIsFinalizeModalOpen(true);
        }}
      />

      <PanoramicBannerBreak
        image="https://images.unsplash.com/photo-1566766189268-ecac9118f2b7?q=80&w=2000&auto=format&fit=crop"
        eyebrow="Central Highlands"
        title="Ride the blue train through the tea country"
        subtitle="The Nine Arch Bridge, misty tea estates and colonial hill stations, on one of the world's most scenic rail journeys."
        actionText="Explore hill-country packages"
        href="/packages/emerald-highland-tea-odyssey"
      />

      <DestinationShowcase onAddToTour={handleAddDestinationToTour} />

      <WhyFlyAmazing />

      <Footer />

      <TourFinalizeModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        tourData={modalTourData}
      />
    </main>
  );
}
