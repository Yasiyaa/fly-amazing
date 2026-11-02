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

export default async function TourArchitectPage({ searchParams }: { searchParams: { add?: string } }) {
  const [destinations, hotels] = await Promise.all([getDestinations(), getHotels()]);
  const add = typeof searchParams.add === "string" && /^[a-z0-9-]{1,60}$/.test(searchParams.add) ? searchParams.add : null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        eyebrow="Tour Architect"
        title="Build your Sri Lanka tour"
        subtitle="Pick your destinations, set the pace and choose your hotels. Your estimate updates live, and a specialist checks every detail before you pay."
        image="https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Road towards Sigiriya rock"
      />
      <TourArchitectStudio destinations={destinations} hotels={hotels} requestedDestinationId={add} />
      <Footer />
    </main>
  );
}
