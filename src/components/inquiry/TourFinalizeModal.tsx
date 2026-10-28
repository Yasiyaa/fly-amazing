"use client";

import React, { useState } from "react";
import { X, CheckCircle, Plane, Sparkles, Send, ShieldCheck, MapPin, Calendar, Users, Phone, Mail, User } from "lucide-react";
import { SelectedStop } from "@/components/architect/TourArchitectStudio";
import { AustralianAirport } from "@/data/australianAirports";
import { CuratedPackage } from "@/data/packages";

interface TourFinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourData: {
    type: "custom" | "package";
    packageName?: string;
    stops?: SelectedStop[];
    totalDays?: number;
    totalNights?: number;
    departureAirport?: AustralianAirport;
    vehicleType?: string;
    totalEstimatedAUD: number;
    curatedPackage?: CuratedPackage;
  } | null;
}

export default function TourFinalizeModal({
  isOpen,
  onClose,
  tourData,
}: TourFinalizeModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [specialRequests, setSpecialRequests] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryToken, setInquiryToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !tourData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Prepare Itinerary details
    let itineraryItems: any[] = [];

    if (tourData.type === "custom" && tourData.stops) {
      itineraryItems = tourData.stops.map((s) => ({
        destinationId: s.destination.id,
        destinationName: s.destination.name,
        nights: s.nights,
        hotelId: s.selectedHotel.id,
        hotelName: s.selectedHotel.name,
        roomType: s.selectedHotel.roomType,
        pricePerNightAUD: s.selectedHotel.pricePerNightAUD,
      }));
    } else if (tourData.type === "package" && tourData.curatedPackage) {
      itineraryItems = tourData.curatedPackage.itinerary.map((it) => ({
        destinationId: it.destinationId,
        destinationName: it.destinationName,
        nights: 1,
        hotelName: it.overnight,
      }));
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          departureCity: tourData.departureAirport?.city || "Melbourne (MEL)",
          travelDates: {
            startDate: startDate || "Flexible Upcoming Season",
          },
          travelers: {
            adults: Number(adults),
            children: Number(children),
          },
          tourType: tourData.type,
          packageName: tourData.packageName || tourData.curatedPackage?.title,
          estimatedBudgetAUD: tourData.totalEstimatedAUD,
          itinerary: itineraryItems,
          specialRequests,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit inquiry.");
      }

      setInquiryToken(json.inquiryId);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-fly-navy to-fly-cyan p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-fly-cyan-100 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
            <span>Instant Tour Dossier</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {submitted ? "Itinerary Dispatched to Admin! 🎉" : "Finalize Your Sri Lanka Tour"}
          </h3>
          <p className="text-xs sm:text-sm text-fly-cyan-100 mt-1">
            {submitted
              ? "Our Australian travel specialists have received your complete tour breakdown."
              : "No payment required now. Our team reviews your chosen hotels, flights & custom route."}
          </p>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Booking Reference Token
              </span>
              <div className="text-3xl font-black text-fly-navy tracking-tight">
                {inquiryToken}
              </div>
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-200">
                Sent to: yasithvidusara@gmail.com
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700 space-y-2 max-w-lg mx-auto">
              <div className="font-bold text-fly-navy text-sm mb-1">
                What happens next?
              </div>
              <p>
                1. <strong>Flight Verification:</strong> We hold seats matching your preferred departure city ({tourData.departureAirport?.city || "Australia"}).
              </p>
              <p>
                2. <strong>Hotel Allocation:</strong> We lock in your selected boutique properties and room categories.
              </p>
              <p>
                3. <strong>Personalized Call/Email:</strong> An Australian travel designer will reach out to <strong>{email}</strong> or <strong>{phone}</strong> within 2 hours with the official ticket voucher and payment terms.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-fly-navy hover:bg-fly-navy-800 text-white font-bold text-xs transition"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Tour Snapshot Strip */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                  Tour Selection
                </span>
                <span className="font-bold text-fly-navy text-sm">
                  {tourData.type === "package"
                    ? tourData.packageName || tourData.curatedPackage?.title
                    : `Bespoke Circuit (${tourData.stops?.length || 4} Stops, ${tourData.totalNights || 8} Nights)`}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                  Estimated Value
                </span>
                <span className="font-black text-fly-orange text-base">
                  ${tourData.totalEstimatedAUD?.toLocaleString()} AUD pp
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-fly-navy" />
                  <span>Lead Traveler Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jack Mitchell"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-fly-cyan" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jack@example.com.au"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-fly-orange" />
                  <span>Australian Phone / Mobile *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0412 345 678"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-fly-cyan" />
                  <span>Approximate Travel Month / Date</span>
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. November 2026 or Dec 15th"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-fly-navy" />
                  <span>Adult Passengers (12+ yrs)</span>
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} Adult{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Children (under 12 yrs)
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} Children
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Requests or Custom Preferences (Optional)
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Dietary requirements, honeymoon setup, preferred flight airline (e.g. SriLankan Airlines direct), etc."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white font-black text-sm shadow-xl shadow-fly-orange/30 transition flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Sending Itinerary to Admin...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Tour Plan to Fly Amazing Admin</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                🔒 Privacy Protected &bull; Sent directly to admin: yasithvidusara@gmail.com
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
