"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Field from "@/components/ui/Field";
import { AUSTRALIAN_AIRPORTS, AustralianAirport } from "@/data/australianAirports";
import { Plane, CheckCircle2, ArrowRight, Luggage, Send, Info, Loader2, Clock } from "lucide-react";
import { cn, formatAUD } from "@/lib/utils";

const CABINS = ["Economy", "Premium Economy", "Business"];

export default function FlightsPage() {
  const [selectedCity, setSelectedCity] = useState<AustralianAirport>(AUSTRALIAN_AIRPORTS[0]);
  const [passengers, setPassengers] = useState("2");
  const [cabinClass, setCabinClass] = useState(CABINS[0]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          departureCity: `${selectedCity.city} (${selectedCity.code})`,
          travelers: { adults: Number(passengers), children: 0 },
          tourType: "flight",
          packageName: `Flights: ${selectedCity.city} to Colombo (${cabinClass})`,
          estimatedBudgetAUD: selectedCity.baseFareAUD * Number(passengers),
          itinerary: [
            {
              destinationId: "colombo",
              destinationName: "Colombo Bandaranaike International (CMB)",
              nights: 0,
              hotelName: `${selectedCity.directToCMB ? "Direct flight" : "1-stop connection"} with ${selectedCity.recommendedAirlines[0]}`,
              roomType: cabinClass,
            },
          ],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't send your request. Please try again.");
      setToken(data.inquiryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <PageHero
        eyebrow="Flights to Colombo"
        title="Australia to Sri Lanka flights"
        subtitle="Direct and one-stop fares with SriLankan, Singapore and Malaysia Airlines, quoted in AUD."
        image="https://images.unsplash.com/photo-1529947327457-8f5cb53bc1b6?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Aircraft wing above the clouds"
      />

      <section className="container-page relative z-10 -mt-16 pb-20">
        <div className="card p-6 shadow-xl shadow-fly-navy/5 sm:p-10">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Choose your departure city</p>
              <h2 className="mt-2 text-2xl font-bold text-fly-navy-900 sm:text-3xl">Compare fares to Colombo</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {AUSTRALIAN_AIRPORTS.map((air) => (
                <button
                  key={air.code}
                  type="button"
                  onClick={() => setSelectedCity(air)}
                  aria-pressed={selectedCity.code === air.code}
                  className={cn(
                    "filter-pill",
                    selectedCity.code === air.code ? "filter-pill-active" : "filter-pill-idle"
                  )}
                >
                  {air.city}
                  <span className="ml-1.5 opacity-60">{air.code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-display text-2xl font-bold text-fly-navy-900 sm:text-3xl">
                <span>{selectedCity.name}</span>
                <ArrowRight className="h-6 w-6 text-slate-300" />
                <span className="text-fly-cyan-700">Colombo</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat icon={Plane} label="Route" value={selectedCity.directToCMB ? "Direct" : "1 stop"} note={selectedCity.estFlightTime} />
                <Stat icon={Luggage} label="Baggage" value="30–40 kg" note="Plus 7 kg carry-on" />
                <div className="panel p-4">
                  <p className="text-xs text-slate-500">Return fares from</p>
                  <p className="mt-1 font-display text-2xl font-bold text-fly-navy-900">
                    {formatAUD(selectedCity.baseFareAUD)}
                    <span className="text-sm font-medium text-slate-400"> AUD</span>
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-700">Taxes included</p>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-medium text-slate-700">Airlines on this route</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCity.recommendedAirlines.map((airline) => (
                    <span key={airline} className="chip">
                      <Plane className="h-3 w-3 text-fly-cyan" />
                      {airline}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-fly-cyan-200 bg-fly-cyan-50/60 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-fly-cyan-700" />
                <div className="text-sm leading-relaxed text-slate-600">
                  <p className="font-semibold text-fly-navy-900">Travelling on an Australian passport?</p>
                  <p className="mt-1">
                    You&rsquo;ll need a Sri Lankan ETA before you board and at least six months&rsquo; passport validity. We
                    check visa requirements when we issue your tickets.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel p-6 sm:p-8 lg:col-span-5">
              <h3 className="text-xl font-bold text-fly-navy-900">Get a flight quote</h3>
              <p className="mt-1.5 text-sm text-slate-500">
                We&rsquo;ll find the best available fare and hold it for 48 hours, with no obligation.
              </p>

              {token ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <h4 className="mt-3 text-lg font-semibold text-slate-900">Request received</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Reference <span className="font-semibold text-fly-navy-900">{token}</span>
                  </p>
                  <p className="mt-3 text-sm text-slate-500">Our flight desk will email your options within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <Field id="fl-name" label="Full name">
                    <input id="fl-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field-input" />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field id="fl-email" label="Email">
                      <input id="fl-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
                    </Field>
                    <Field id="fl-phone" label="Mobile">
                      <input id="fl-phone" type="tel" required autoComplete="tel" placeholder="04xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="field-input" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field id="fl-cabin" label="Cabin">
                      <select id="fl-cabin" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className="field-input cursor-pointer">
                        {CABINS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id="fl-pax" label="Passengers">
                      <select id="fl-pax" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="field-input cursor-pointer">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitting ? "Sending…" : "Request my quote"}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    Reply within 2 business hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-fly-navy-900 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fly-cyan/25 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow-light">Flights + tour</p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">Bundle your flights with a Sri Lanka tour</h3>
              <p className="mt-3 text-slate-300">
                Save up to 25% when you combine return flights with handpicked hotels and a private chauffeur.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/packages" className="btn-glass btn-lg">
                View packages
              </Link>
              <Link href="/tour-architect" className="btn-primary btn-lg">
                Build a custom tour
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ icon: Icon, label, value, note }: { icon: typeof Plane; label: string; value: string; note: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-fly-orange" />
        {value}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">{note}</p>
    </div>
  );
}
