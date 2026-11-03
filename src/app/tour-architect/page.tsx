import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import TourArchitectStudio from "@/components/architect/TourArchitectStudio";
import { getDestinations, getHotels } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Build your own Sri Lanka tour",
  description: "Choose your destinations, nights and hotels and see a live price for your private Sri Lanka tour.",
};

export default async function TourArchitectPage({ searchParams }: { searchParams: { add?: string; stops?: string } }) {
  const [destinations, hotels] = await Promise.all([getDestinations(), getHotels()]);
  const add = typeof searchParams.add === "string" && /^[a-z0-9-]{1,60}$/.test(searchParams.add) ? searchParams.add : null;
  const initialStops =
    typeof searchParams.stops === "string"
      ? searchParams.stops
          .split(",")
          .map((part) => {
            const [id, n] = part.split(":");
            return { destinationId: id?.trim(), nights: Math.max(1, Math.min(10, Number(n) || 2)) };
          })
          .filter((s) => /^[a-z0-9-]{1,60}$/.test(s.destinationId))
      : null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        eyebrow="Tour Architect"
        title="Build your Sri Lanka tour"
        subtitle="Pick your destinations, set the pace and choose your hotels. Your estimate updates live, and a specialist checks every detail before you pay."
        image="/images/posters/rainforest-bridge.jpg"
        imageAlt="Rainforest canopy with a walking trail"
        video="/videos/web/rainforest-bridge.mp4"
      />
      <TourArchitectStudio destinations={destinations} hotels={hotels} requestedDestinationId={add} initialStops={initialStops} />
      <Footer />
    </main>
  );
}
