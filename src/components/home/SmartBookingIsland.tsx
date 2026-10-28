"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plane, Calendar, Users, Sparkles, Compass, ArrowRight, Check, MapPin } from "lucide-react";
import { AUSTRALIAN_AIRPORTS, AustralianAirport } from "@/data/australianAirports";

interface SmartBookingIslandProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

export default function SmartBookingIsland({
  onSelectDeparture,
  onOpenArchitect,
}: SmartBookingIslandProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bundle" | "curated" | "custom">("bundle");
  const [selectedAirport, setSelectedAirport] = useState<AustralianAirport>(AUSTRALIAN_AIRPORTS[0]); // Melbourne default
  const [adults, setAdults] = useState<number>(2);
  const [travelMonth, setTravelMonth] = useState<string>("Nov 2026");

  const months = ["Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027"];

  const handleAirportChange = (airport: AustralianAirport) => {
    setSelectedAirport(airport);
    if (onSelectDeparture) {
      onSelectDeparture(airport);
    }
  };

  const handleAction = () => {
    if (activeTab === "curated") {
      router.push("/packages");
    } else if (activeTab === "custom") {
      router.push("/tour-architect");
    } else {
      if (onOpenArchitect) {
        onOpenArchitect();
      } else {
        router.push("/tour-architect");
      }
    }
  };

  return (
    <div
      id="smart-search"
      className="w-full max-w-5xl mx-auto rounded-3xl p-4 sm:p-6 bg-white/95 backdrop-blur-2xl shadow-2xl shadow-fly-navy/20 border border-white/60 relative z-30 transform -translate-y-6 sm:-translate-y-12 font-sans"
    >
      {/* Top Capsule Navigation Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80">
          <button
            onClick={() => setActiveTab("bundle")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
              activeTab === "bundle"
                ? "bg-white text-fly-navy shadow-md shadow-slate-200"
                : "text-slate-600 hover:text-fly-navy"
            }`}
          >
            <Plane className="w-4 h-4 text-fly-orange" />
            <span>Flights + Sri Lanka Tour</span>
            <span className="hidden sm:inline-block text-xs font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Save 25%
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("curated");
              router.push("/packages");
            }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
              activeTab === "curated"
                ? "bg-white text-fly-navy shadow-md shadow-slate-200"
                : "text-slate-600 hover:text-fly-navy"
            }`}
          >
            <Sparkles className="w-4 h-4 text-fly-cyan" />
            <span>Curated Packages</span>
          </button>

          <Link
            href="/tour-architect"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-fly-cyan to-fly-navy text-white shadow-md shadow-fly-cyan/30 hover:opacity-95 transition"
          >
            <Compass className="w-4 h-4 text-fly-orange" />
            <span>🛠️ Custom Tour Studio</span>
          </Link>
        </div>

        {/* Live Fare Indicator */}
        <div className="hidden md:flex items-center space-x-2.5 text-sm font-semibold text-slate-600">
          <span>Return flights from:</span>
          <span className="text-base font-black text-fly-navy">${selectedAirport.baseFareAUD} AUD</span>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {selectedAirport.directToCMB ? "Direct to Colombo (CMB)" : "1-Stop Fast Connect"}
          </span>
        </div>
      </div>

      {/* Main Interactive Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* Origin Australian City Picker Chips */}
        <div className="md:col-span-5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 hover:border-fly-cyan/50 transition">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-fly-orange" />
              <span>Depart From Australia:</span>
            </span>
            <span className="text-fly-cyan font-semibold">To: Colombo (CMB)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {AUSTRALIAN_AIRPORTS.map((airport) => {
              const isSelected = selectedAirport.code === airport.code;
              return (
                <button
                  key={airport.code}
                  onClick={() => handleAirportChange(airport)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-fly-navy text-white shadow-sm ring-2 ring-fly-cyan/50 scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span>{airport.code}</span>
                  <span className="text-xs font-normal opacity-80">({airport.city})</span>
                  {airport.directToCMB && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Period Selector */}
        <div className="md:col-span-3 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 hover:border-fly-cyan/50 transition">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-fly-cyan" />
            <span>Target Month:</span>
          </div>
          <select
            value={travelMonth}
            onChange={(e) => setTravelMonth(e.target.value)}
            className="w-full bg-white text-sm font-bold text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m} (Peak Season)
              </option>
            ))}
          </select>
        </div>

        {/* Travelers Count */}
        <div className="md:col-span-2 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 hover:border-fly-cyan/50 transition">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-fly-navy" />
            <span>Travelers:</span>
          </div>
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-2 py-2">
            <button
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
            >
              -
            </button>
            <span className="text-sm font-bold text-slate-800">
              {adults} Adult{adults > 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setAdults(adults + 1)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="md:col-span-2 flex flex-col justify-end">
          <button
            onClick={handleAction}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white font-black text-sm sm:text-base shadow-xl shadow-fly-orange/40 hover:shadow-fly-orange/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-center"
          >
            <span>Explore Tour</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Micro Info Strip */}
      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 font-light">
        <div className="flex items-center space-x-5">
          <span className="flex items-center space-x-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Private AC Vehicle & Chauffeur</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>4 & 5-Star Boutique Estates</span>
          </span>
          <span className="hidden sm:inline-flex items-center space-x-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Instant Custom Itinerary to Admin</span>
          </span>
        </div>
        <div className="text-fly-navy font-semibold text-xs sm:text-sm">
          Flight duration: {selectedAirport.estFlightTime}
        </div>
      </div>
    </div>
  );
}
