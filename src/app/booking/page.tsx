import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingLookup from "@/components/booking/BookingLookup";

export const metadata: Metadata = { title: "Manage booking", robots: { index: false } };

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container-page pb-24 pt-[120px] sm:pt-[140px]">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Manage booking</p>
          <h1 className="mt-3 text-3xl font-bold text-fly-navy-900 sm:text-4xl">Check your booking</h1>
          <p className="mt-3 text-slate-500">Enter the reference from your confirmation email to see the latest status.</p>
        </div>
        <div className="mt-10">
          <BookingLookup />
        </div>
      </div>
      <Footer />
    </main>
  );
}
