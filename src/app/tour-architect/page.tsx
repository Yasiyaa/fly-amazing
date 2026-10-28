"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import TourArchitectStudio from "@/components/architect/TourArchitectStudio";
import TourFinalizeModal, { FinalizeTourData } from "@/components/inquiry/TourFinalizeModal";

export default function TourArchitectPage() {
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [modalTourData, setModalTourData] = useState<FinalizeTourData | null>(null);
  const [requestedDestination, setRequestedDestination] = useState<{ id: string; nonce: number } | null>(null);

  // Support deep links such as /tour-architect?add=ella from destination pages
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("add");
    if (id) setRequestedDestination({ id, nonce: Date.now() });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <PageHero
        eyebrow="Tour Architect"
        title="Build your Sri Lanka tour"
        subtitle="Pick your destinations, set the pace and choose hotels with real guest reviews. Your estimate updates live in AUD."
        image="https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Road towards Sigiriya rock"
      />

      <TourArchitectStudio
        requestedDestination={requestedDestination}
        onFinalizeTour={(tour) => {
          setModalTourData({ type: "custom", ...tour });
          setIsFinalizeModalOpen(true);
        }}
      />

      <Footer />

      <TourFinalizeModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        tourData={modalTourData}
      />
    </main>
  );
}
