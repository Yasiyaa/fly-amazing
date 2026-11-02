import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCinema from "@/components/home/HeroCinema";
import CinematicReelWall from "@/components/home/CinematicReelWall";
import PanoramicBannerBreak from "@/components/home/PanoramicBannerBreak";
import DestinationShowcase from "@/components/home/DestinationShowcase";
import WhyUs from "@/components/home/WhyUs";
import PlannerPromo from "@/components/home/PlannerPromo";
import SectionHeader from "@/components/ui/SectionHeader";
import TourCard from "@/components/ui/TourCard";
import { getDestinations, getSiteSettings, getTours } from "@/lib/catalog";

export default async function HomePage() {
  const [tours, destinations, settings] = await Promise.all([getTours(), getDestinations(), getSiteSettings()]);
  const featured = tours.filter((t) => t.featured).slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <HeroCinema videos={settings.heroVideos} />

      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeader
            eyebrow="Signature tours"
            title="Our signature Sri Lanka tours"
            description="Private tours with your own chauffeur-guide and handpicked hotels. Every one can be adjusted to your dates and pace."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/tours" className="btn-navy btn-lg">
              See all {tours.length} tours
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CinematicReelWall />

      <PlannerPromo />

      <PanoramicBannerBreak
        image="/images/yves-alarie-3R50kTNBKiE-unsplash.jpg"
        eyebrow="Hill country"
        title="Ride the blue train through the tea country"
        subtitle="The Nine Arch Bridge, misty tea estates and colonial hill stations, on one of the world's most scenic rail journeys."
        actionText="See the tea country tour"
        href="/tours/tea-country-and-scenic-rail"
      />

      <DestinationShowcase destinations={destinations} />

      <WhyUs />

      <PanoramicBannerBreak
        image="/images/udara-karunarathna-MXY2UUe1C4g-unsplash.jpg"
        eyebrow="Build your own"
        title="Your route, your hotels, your pace"
        subtitle="Pick destinations, set the nights and choose your hotels in the Tour Architect, with a live price as you go."
        actionText="Open the Tour Architect"
        href="/tour-architect"
      />

      <Footer />
    </main>
  );
}
