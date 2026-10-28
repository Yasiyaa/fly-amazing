"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TourArchitectStudio, { SelectedStop } from "@/components/architect/TourArchitectStudio";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";
import { AustralianAirport, AUSTRALIAN_AIRPORTS } from "@/data/australianAirports";
import { Compass, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";

export default function TourArchitectPage() {
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
  } | null>(null);

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

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 sm:pt-40 pb-16 bg-fly-navy-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=2000&auto=format&fit=crop"
            alt="Custom Sri Lanka Tour Architect"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-fly-cyan-200 uppercase tracking-[0.2em] mb-4">
            <Compass className="w-4 h-4 text-fly-orange" />
            <span>Interactive Bespoke Journey Canvas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-tight uppercase">
            Bespoke Tour Architect
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-medium">
            Customize your route, duration, and luxury hotels dynamically with real guest reviews and live AUD pricing.
          </p>
        </div>
      </section>

      {/* The Architect Canvas */}
      <div className="-mt-8 relative z-20">
        <TourArchitectStudio
          onFinalizeTour={handleFinalizeCustomTour}
          initialAirport={selectedAirport}
        />
      </div>

      <Footer />

      <TourFinalizeModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        tourData={modalTourData}
      />
    </main>
  );
}
