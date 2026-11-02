import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import DestinationsExplorer from "@/components/destinations/DestinationsExplorer";
import { getDestinations, getTours } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sri Lanka destinations",
  description: "A region-by-region guide to Sri Lanka: the Cultural Triangle, hill country, wildlife parks and both coasts, with local tips and the tours that visit each place.",
};

export default async function DestinationsPage() {
  const [destinations, tours] = await Promise.all([getDestinations(), getTours()]);
  const toursByDestination: Record<string, { slug: string; title: string }[]> = {};
  for (const t of tours) {
    for (const id of t.destinationIds) (toursByDestination[id] ??= []).push({ slug: t.slug, title: t.title });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <PageHero
        eyebrow="Destination guide"
        title="Sri Lanka, region by region"
        subtitle="Ancient cities, misty tea country, leopard-filled national parks and two coasts with opposite seasons, all within a few hours of each other."
        image="https://images.unsplash.com/photo-1544015759-237f87d55ef3?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Aerial view of a Sri Lankan tea estate"
      />
      <DestinationsExplorer destinations={destinations} toursByDestination={toursByDestination} />
      <Footer />
    </main>
  );
}
