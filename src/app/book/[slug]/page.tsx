import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/booking/BookingForm";
import { getTour } from "@/lib/catalog";
import { HOTEL_TIERS, type HotelTier } from "@/lib/types";

export const metadata: Metadata = { title: "Request to book", robots: { index: false } };

interface PageProps {
  params: { slug: string };
  searchParams: { tier?: string; adults?: string; children?: string };
}

function clampInt(value: string | undefined, min: number, max: number, fallback: number) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

export default async function BookPage({ params, searchParams }: PageProps) {
  const tour = await getTour(params.slug);
  if (!tour) notFound();

  const tier: HotelTier = HOTEL_TIERS.includes(searchParams.tier as HotelTier) ? (searchParams.tier as HotelTier) : "superior";
  const initial = {
    tier,
    adults: clampInt(searchParams.adults, 1, 20, 2),
    children: clampInt(searchParams.children, 0, 10, 0),
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container-page pb-24 pt-[112px] sm:pt-[128px]">
        <Link href={`/tours/${tour.slug}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-fly-navy">
          <ArrowLeft className="h-4 w-4" />
          Back to the tour
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-fly-navy-900 sm:text-4xl">Request to book</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Tell us your dates and who&rsquo;s travelling. We&rsquo;ll check guides and hotels and confirm your price within one business day. Nothing is charged until you approve.
        </p>
        <div className="mt-10">
          <BookingForm tour={tour} initial={initial} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
