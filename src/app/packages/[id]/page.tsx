import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Plane, Check, Car, BedDouble, CalendarDays, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageEnquireButton from "@/components/inquiry/PackageEnquireButton";
import { CURATED_PACKAGES } from "@/data/packages";
import { formatAUD } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return CURATED_PACKAGES.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const pkg = CURATED_PACKAGES.find((p) => p.id === params.id);
  if (!pkg) return { title: "Package not found | Fly Amazing" };
  return {
    title: `${pkg.title} | ${pkg.durationDays}-day Sri Lanka tour from Australia | Fly Amazing`,
    description: pkg.tagline,
    openGraph: { images: [pkg.bannerImage] },
  };
}

export default function PackageDetailPage({ params }: PageProps) {
  const pkg = CURATED_PACKAGES.find((p) => p.id === params.id);
  if (!pkg) notFound();

  const facts = [
    { icon: CalendarDays, label: "Duration", value: `${pkg.durationDays} days / ${pkg.durationNights} nights` },
    { icon: Plane, label: "Flights", value: "Return from MEL, SYD, BNE, PER or ADL" },
    { icon: Car, label: "Transport", value: "Private chauffeur-guide" },
    { icon: BedDouble, label: "Hotels", value: "Handpicked 4 & 5-star" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-fly-navy-950 pb-14 pt-[152px] text-white sm:min-h-[640px] sm:pb-16">
        <Image src={pkg.bannerImage} alt={pkg.title} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/50 to-fly-navy-950/40" />

        <div className="container-page">
          <Link href="/packages" className="inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            All packages
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="badge-accent">{pkg.badge}</span>
            <span className="chip-glass normal-case tracking-normal">Best: {pkg.recommendedSeason}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{pkg.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">{pkg.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-fly-orange-300" />
              {pkg.durationDays} days / {pkg.durationNights} nights
            </span>
            <span className="inline-flex items-center gap-2">
              <Plane className="h-4 w-4 text-fly-orange-300" />
              Flights from Australia included
            </span>
            <span className="font-display text-xl font-bold text-white">
              From {formatAUD(pkg.priceAUD)} <span className="text-sm font-medium text-slate-300">AUD pp</span>
            </span>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div className="card p-6 sm:p-8">
              <p className="eyebrow">Overview</p>
              <h2 className="mt-2 text-2xl font-bold text-fly-navy-900 sm:text-3xl">About this journey</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{pkg.overview}</p>

              <p className="mt-6 text-[13px] font-medium text-slate-700">Route</p>
              <p className="mt-1 text-sm text-slate-500">{pkg.route.join("  →  ")}</p>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-[13px] font-semibold text-slate-900">Highlights</h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {pkg.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-fly-orange" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Day by day</p>
                  <h2 className="mt-2 text-2xl font-bold text-fly-navy-900 sm:text-3xl">Your itinerary</h2>
                </div>
                <span className="text-sm text-slate-500">{pkg.itinerary.length} days</span>
              </div>

              <ol className="relative mt-8 space-y-4 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-slate-200 sm:before:left-6">
                {pkg.itinerary.map((day) => (
                  <li key={day.day} className="relative flex gap-4 sm:gap-5">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fly-navy text-sm font-semibold text-white ring-4 ring-slate-50 sm:h-12 sm:w-12">
                      {day.day}
                    </span>
                    <div className="card min-w-0 flex-1 p-5 sm:p-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3 className="text-lg font-semibold leading-snug text-slate-900">{day.title}</h3>
                        <span className="w-fit shrink-0 rounded-full bg-fly-cyan-50 px-3 py-1 text-xs font-medium text-fly-cyan-800">
                          {day.destinationName}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{day.description}</p>
                      <p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[13px] text-slate-500">
                        <BedDouble className="h-4 w-4 shrink-0 text-fly-orange" />
                        <span>
                          Overnight: <span className="font-medium text-slate-800">{day.overnight}</span>
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-fly-navy-900">What&rsquo;s included</h2>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.inclusions.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="card sticky top-24 p-6 shadow-xl shadow-fly-navy/5 sm:p-8">
              <p className="text-xs text-slate-500">From, per person</p>
              <p className="mt-1 font-display text-4xl font-bold text-fly-navy-900">
                {formatAUD(pkg.priceAUD)} <span className="text-base font-medium text-slate-400">AUD</span>
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                International flights included
              </p>

              <dl className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-fly-cyan-700" />
                    <div>
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="text-sm font-medium text-slate-900">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-8 space-y-3">
                <PackageEnquireButton packageId={pkg.id} className="w-full" />
                <Link href="/tour-architect" className="btn-secondary btn-lg w-full">
                  Customise in Tour Architect
                </Link>
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">No payment needed to enquire.</p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
