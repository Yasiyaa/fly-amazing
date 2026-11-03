import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Check, X, BedDouble, ArrowLeft, Car, CalendarDays, Utensils, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/tours/Gallery";
import PriceCalculator from "@/components/tours/PriceCalculator";
import LazyVideo from "@/components/ui/LazyVideo";
import { getTour, getTours } from "@/lib/catalog";
import { THEME_LABELS } from "@/lib/types";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 300;

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tour = await getTour(params.slug);
  if (!tour) return { title: "Tour not found" };
  return {
    title: `${tour.title} (${tour.kind === "day" ? "day tour" : `${tour.durationDays} days`})`,
    description: tour.tagline,
    openGraph: { images: [tour.heroImage] },
  };
}

export default async function TourPage({ params }: PageProps) {
  const tour = await getTour(params.slug);
  if (!tour) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-fly-navy-950 pb-14 pt-[152px] text-white sm:min-h-[640px] sm:pb-16">
        <Image src={tour.heroImage} alt={tour.title} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/50 to-fly-navy-950/40" />
        <div className="container-page">
          <Link href="/tours" className="inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            All tours
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {tour.badge && <span className="badge-accent">{tour.badge}</span>}
            {tour.themes.slice(0, 3).map((t) => (
              <span key={t} className="chip-glass normal-case tracking-normal">
                {THEME_LABELS[t]}
              </span>
            ))}
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{tour.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">{tour.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-fly-orange-300" />
              {tour.kind === "day" ? "Full day" : `${tour.durationDays} days / ${tour.durationDays - 1} nights`}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-fly-orange-300" />
              Best {tour.bestSeason}
            </span>
            <span className="inline-flex items-center gap-2">
              <Car className="h-4 w-4 text-fly-orange-300" />
              Private chauffeur-guide
            </span>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div className="card p-6 sm:p-8">
              <p className="eyebrow">Overview</p>
              <h2 className="mt-2 text-2xl font-bold text-fly-navy-900 sm:text-3xl">About this tour</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{tour.summary}</p>
              <p className="mt-6 text-[13px] font-medium text-slate-700">Route</p>
              <p className="mt-1 text-sm text-slate-500">{tour.route.join("  →  ")}</p>
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-[13px] font-semibold text-slate-900">Highlights</h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-fly-orange" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Gallery images={Array.from(new Set([tour.heroImage, ...tour.gallery]))} title={tour.title} />

            {tour.video && (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                <LazyVideo src={tour.video} poster={tour.gallery[0] ?? tour.heroImage} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-4 left-5 text-sm font-medium text-white">A taste of the journey</p>
              </div>
            )}

            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Day by day</p>
                  <h2 className="mt-2 text-2xl font-bold text-fly-navy-900 sm:text-3xl">Itinerary</h2>
                </div>
                <span className="text-sm text-slate-500">{tour.days.length} {tour.days.length === 1 ? "day" : "days"}</span>
              </div>
              <ol className="relative mt-8 space-y-4 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-slate-200 sm:before:left-6">
                {tour.days.map((day) => (
                  <li key={day.day} className="relative flex gap-4 sm:gap-5">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fly-navy text-sm font-semibold text-white ring-4 ring-slate-50 sm:h-12 sm:w-12">
                      {day.day}
                    </span>
                    <div className="card min-w-0 flex-1 p-5 sm:p-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3 className="text-lg font-semibold leading-snug text-slate-900">{day.title}</h3>
                        {day.driveTime && (
                          <span className="w-fit shrink-0 rounded-full bg-fly-cyan-50 px-3 py-1 text-xs font-medium text-fly-cyan-800">
                            {day.driveTime}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{day.description}</p>
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-500">
                        {day.overnight !== "—" && (
                          <span className="inline-flex items-center gap-2">
                            <BedDouble className="h-4 w-4 shrink-0 text-fly-orange" />
                            Overnight: <span className="font-medium text-slate-800">{day.overnight}</span>
                          </span>
                        )}
                        {day.meals !== "—" && (
                          <span className="inline-flex items-center gap-2">
                            <Utensils className="h-4 w-4 shrink-0 text-fly-orange" />
                            {day.meals}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="card p-6 sm:p-7">
                <h2 className="text-xl font-bold text-fly-navy-900">Included</h2>
                <ul className="mt-5 space-y-3">
                  {tour.inclusions.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-6 sm:p-7">
                <h2 className="text-xl font-bold text-fly-navy-900">Not included</h2>
                <ul className="mt-5 space-y-3">
                  {tour.exclusions.map((exc) => (
                    <li key={exc} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      {exc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-fly-cyan-200 bg-fly-cyan-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-fly-navy-900">Want to change something?</span> Add nights, swap hotels or combine with a beach stay.
              </p>
              <Link href={`/plan?q=${encodeURIComponent(`I like the ${tour.title}. Can you adjust it for me?`)}`} className="btn-navy btn-sm shrink-0">
                <Sparkles className="h-4 w-4" />
                Adjust with AI
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <PriceCalculator tour={tour} />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
