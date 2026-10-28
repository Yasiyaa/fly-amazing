"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle, Send, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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
          departureCity: "Australian Consultation Request",
          tourType: "general_inquiry",
          packageName: "General Traveler Consultation",
          specialRequests: message,
          estimatedBudgetAUD: 0,
          itinerary: [],
        }),
      });

      const data = await res.json();
      setToken(data.inquiryId || "FA-INQ-1089");
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
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop"
            alt="Fly Amazing Australian Concierge"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-fly-cyan-200 uppercase tracking-[0.2em] mb-4">
            <Phone className="w-4 h-4 text-fly-orange" />
            <span>Australian Dedicated Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif text-white tracking-tight leading-tight">
            Speak with an <span className="italic text-fly-cyan-300">Australian Specialist</span>.
          </h1>

          <p className="mt-3 text-xs sm:text-base text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Planning a once-in-a-lifetime journey to Sri Lanka? Our local travel experts in Melbourne and Sydney are here to customize your flights, hotels, and private chauffeured tours.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Phone & Trust Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <h3 className="text-2xl font-serif text-fly-navy font-normal">
                Direct Contact Channels
              </h3>

              <div className="space-y-4">
                <a
                  href="tel:1300359269"
                  className="flex items-start space-x-4 p-4 rounded-2xl bg-fly-navy-50/60 border border-fly-navy-100 hover:border-fly-orange transition group"
                >
                  <div className="p-3 rounded-xl bg-fly-orange text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                      Australia Toll-Free Phone
                    </span>
                    <strong className="text-lg text-fly-navy font-bold">1300 FLY AMZ (1300 359 269)</strong>
                    <span className="text-xs text-emerald-700 block mt-0.5">Mon - Sat: 8:30 AM - 7:30 PM (AEST)</span>
                  </div>
                </a>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="p-3 rounded-xl bg-fly-cyan text-white flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                      Direct Email Inquiries
                    </span>
                    <strong className="text-base text-slate-900 font-bold">bookings@flyamazing.com.au</strong>
                    <span className="text-xs text-slate-500 block mt-0.5">Inquiries monitored 24/7</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="p-3 rounded-xl bg-fly-navy text-white flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                      Head Concierge Hubs
                    </span>
                    <strong className="text-base text-slate-900 font-bold">Melbourne &bull; Sydney &bull; Colombo</strong>
                    <span className="text-xs text-slate-500 block mt-0.5">Australian registered travel agency</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                All booking payments are processed securely in Australian Dollars (AUD) with no international foreign currency conversion fees.
              </div>
            </div>
          </div>

          {/* Right Column: Send a Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-serif text-fly-navy font-normal mb-2">
              Send an Inquiry to Our Travel Team
            </h3>
            <p className="text-sm sm:text-base text-slate-600 font-light mb-6">
              Tell us your desired travel dates, party size, and dream Sri Lanka experiences. We will build a customized proposal and email you within 2 hours.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="text-2xl font-serif text-emerald-900 font-normal">Message Received!</h4>
                <p className="text-sm text-emerald-800 font-light">
                  Reference Token: <strong>{token}</strong>
                </p>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Your inquiry has been delivered to <strong>yasithvidusara@gmail.com</strong>. A dedicated specialist will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com.au"
                      className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Australian Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0412 889 000"
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    How Can We Help You? (Destination preferences, travel dates, flight seats, etc.)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="We want a 10-day tour for our 10th wedding anniversary in November 2026, visiting Sigiriya, Ella, and Yala safari..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white font-bold text-base shadow-xl shadow-fly-orange/30 transition flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <span>Sending to Specialist...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message to Australian Travel Desk</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-slate-400 font-light">
                  🔒 Delivered directly to admin: yasithvidusara@gmail.com
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
