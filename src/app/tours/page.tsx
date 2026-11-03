import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ToursExplorer from "@/components/tours/ToursExplorer";
import { getTours } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sri Lanka tours",
  description: "Private Sri Lanka tours from 1 to 14 days: culture, tea country, wildlife, beaches, honeymoons and family trips, with clear USD prices.",
};

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <PageHero
        eyebrow="Tours"
        title="Private Sri Lanka tours"
        subtitle="Every tour comes with your own chauffeur-guide and handpicked hotels, and can be adjusted to your dates, pace and budget."
        image="https://images.unsplash.com/photo-1559038298-ef4eecdfdbb3?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Misty tea-country hills"
        video="https://assets.mixkit.co/videos/11193/11193-720.mp4"
      />

      <ToursExplorer tours={tours} />

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-fly-navy-900 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fly-orange/20 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow-light">Not quite right?</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Let us design one around you</h2>
              <p className="mt-3 text-slate-300">Tell our AI planner what you have in mind, or build the route yourself in the Tour Architect.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/plan" className="btn-primary btn-lg">
                <Sparkles className="h-4 w-4" />
                Plan with AI
              </Link>
              <Link href="/tour-architect" className="btn-glass btn-lg">
                Tour Architect
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
