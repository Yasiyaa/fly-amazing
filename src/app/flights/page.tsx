"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AUSTRALIAN_AIRPORTS, AustralianAirport } from "@/data/australianAirports";
import { Plane, Clock, ShieldCheck, CheckCircle, ArrowRight, Luggage, Calendar, Sparkles, MapPin, Send } from "lucide-react";

export default function FlightsPage() {
  const [selectedCity, setSelectedCity] = useState<AustralianAirport>(AUSTRALIAN_AIRPORTS[0]);
  const [passengers, setPassengers] = useState("2");
  const [cabinClass, setCabinClass] = useState("Economy Class");
  const [preferredMonth, setPreferredMonth] = useState("Nov 2026");

  // Flight inquiry form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          departureCity: `${selectedCity.city} (${selectedCity.code})`,
          travelDates: { startDate: preferredMonth },
          travelers: { adults: Number(passengers), children: 0 },
          tourType: "flight_only",
          packageName: `Flight Booking: ${selectedCity.city} to Colombo (${cabinClass})`,
          estimatedBudgetAUD: selectedCity.baseFareAUD * Number(passengers),
          itinerary: [
            {
              destinationId: "colombo",
              destinationName: `Colombo Bandaranaike International (CMB)`,
              nights: 0,
              hotelName: `${selectedCity.directToCMB ? "Direct Non-Stop Flight" : "1-Stop Connection"} with ${selectedCity.recommendedAirlines[0]}`,
              roomType: cabinClass,
              pricePerNightAUD: selectedCity.baseFareAUD,
            },
          ],
        }),
      });

      const data = await res.json();
      setToken(data.inquiryId || "FA-FL-1082");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 sm:pt-40 pb-20 bg-fly-navy-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop"
            alt="Sri Lanka flights from Australia"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-fly-cyan-200 uppercase tracking-[0.2em] mb-4">
            <Plane className="w-4 h-4 text-fly-orange" />
            <span>Australia to Colombo (CMB) Specialist</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-tight uppercase">
            Australia to Sri Lanka Flights
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-medium">
            Direct & 1-stop wholesale fares with SriLankan Airlines, Singapore Airlines & Malaysia Airlines. Locked in AUD.
          </p>
        </div>
      </section>

      {/* Flight Departure City Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-fly-orange block mb-1">
                Select Your Australian Departure City
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal font-display text-fly-navy">
                Compare Fares & Schedules to Colombo (CMB)
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {AUSTRALIAN_AIRPORTS.map((air) => (
                <button
                  key={air.code}
                  onClick={() => setSelectedCity(air)}
                  className={`px-4 py-2.5 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center space-x-2 ${
                    selectedCity.code === air.code
                      ? "bg-fly-navy text-white shadow-md ring-2 ring-fly-orange scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{air.city}</span>
                  <span className="text-xs font-normal opacity-80">({air.code})</span>
                  {air.directToCMB && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Active Departure Deep-Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl sm:text-4xl font-normal font-display text-fly-navy">
                  {selectedCity.name}
                </span>
                <span className="text-xl font-bold text-slate-400">&rarr;</span>
                <span className="text-2xl sm:text-3xl font-normal font-display text-fly-cyan-700">
                  Colombo (CMB)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Flight Type</div>
                  <div className="font-bold text-slate-900 text-base flex items-center space-x-1.5">
                    <Plane className="w-4 h-4 text-fly-orange" />
                    <span>{selectedCity.directToCMB ? "Non-Stop Direct" : "Fast 1-Stop"}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{selectedCity.estFlightTime}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Standard Baggage</div>
                  <div className="font-bold text-slate-900 text-base flex items-center space-x-1.5">
                    <Luggage className="w-4 h-4 text-fly-cyan" />
                    <span>30kg - 40kg</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">+ 7kg Carry-on included</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Starting Return Fare</div>
                  <div className="font-black text-fly-orange text-xl sm:text-2xl font-display">
                    ${selectedCity.baseFareAUD} <span className="text-xs font-bold text-slate-500 font-sans">AUD</span>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">Taxes & Surcharges Incl.</div>
                </div>
              </div>

              {/* Partner Airlines */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Operating Partner Airlines on this route:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCity.recommendedAirlines.map((airline, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-fly-cyan-50 text-fly-cyan-900 font-semibold text-sm border border-fly-cyan-200"
                    >
                      ✈ {airline}
                    </span>
                  ))}
                </div>
              </div>

              {/* Traveler Advice */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-sm space-y-2">
                <div className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-fly-orange" />
                  <span>Important for Australian Passport Holders:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-amber-800 font-light">
                  Australians require a valid tourist Electronic Travel Authorization (ETA / eVisa) before boarding. Your passport must have at least 6 months validity from departure. Our Fly Amazing concierge manages visa pre-checks with your flight ticket issuance.
                </p>
              </div>
            </div>

            {/* Right Column: Quick Flight Ticket Request Form */}
            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
              <h3 className="text-xl sm:text-2xl font-normal font-display text-fly-navy mb-2">
                Request an Official Flight Quote
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light mb-6">
                Receive the best available wholesale flight fares held for 48 hours with zero obligation.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-lg">Quote Request Received!</h4>
                  <p className="text-sm text-emerald-800 font-light">
                    Reference: <strong>{token}</strong>
                  </p>
                  <p className="text-xs text-emerald-700">
                    Dispatched to admin (yasithvidusara@gmail.com). Our flight desk will email your exact flight itinerary within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Lead Passenger Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Liam Smith"
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="liam@gmail.com"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0412 345 678"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Cabin Class
                      </label>
                      <select
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white text-sm"
                      >
                        <option value="Economy Class">Economy Class</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business Class">Business Class</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Passengers
                      </label>
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan bg-white text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} Passenger{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white font-bold text-base shadow-xl shadow-fly-orange/30 transition flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Request Guaranteed Fare Quote</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Zero commitment &bull; Sent directly to admin: yasithvidusara@gmail.com
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bundle & Save CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-fly-navy to-fly-cyan p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fly-cyan-200">
              Complete Travel Solution
            </span>
            <h3 className="text-2xl sm:text-4xl font-normal font-display text-white">
              Bundle Your Flights with a Bespoke Sri Lanka Tour.
            </h3>
            <p className="text-sm sm:text-base text-slate-200 font-light max-w-xl">
              Save up to 25% when you bundle international return flights with our handpicked 4 to 5-star boutique hotels and private chauffeured travel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/packages"
              className="px-6 py-3.5 rounded-full bg-white text-fly-navy font-bold text-sm sm:text-base hover:bg-slate-100 transition shadow-lg"
            >
              View Curated Packages
            </Link>
            <Link
              href="/tour-architect"
              className="px-6 py-3.5 rounded-full bg-fly-orange text-white font-bold text-sm sm:text-base hover:bg-fly-orange-600 transition shadow-lg"
            >
              Build Custom Tour
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
