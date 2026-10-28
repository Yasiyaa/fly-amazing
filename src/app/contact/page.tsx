"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Field from "@/components/ui/Field";
import { Phone, Mail, MapPin, CheckCircle2, Send, Loader2, ArrowUpRight } from "lucide-react";

const CHANNELS = [
  {
    icon: Phone,
    label: "Call us",
    value: "1300 359 269",
    note: "Mon–Sat, 8:30am–7:30pm AEST",
    href: "tel:1300359269",
  },
  {
    icon: Mail,
    label: "Email",
    value: "bookings@flyamazing.com.au",
    note: "We reply within 2 business hours",
    href: "mailto:bookings@flyamazing.com.au",
  },
  {
    icon: MapPin,
    label: "Offices",
    value: "Melbourne · Sydney · Colombo",
    note: "Australian-registered travel agency",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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
          tourType: "general",
          packageName: "General enquiry",
          specialRequests: message,
          itinerary: [],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't send your message. Please try again.");
      setToken(data.inquiryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <PageHero
        eyebrow="Contact"
        title="Talk to a Sri Lanka specialist"
        subtitle="Tell us your dates, who's travelling and what you'd love to see. We'll come back with a tailored proposal."
        image="https://images.unsplash.com/photo-1559038298-ef4eecdfdbb3?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Tea plantation hills in Sri Lanka"
      />

      <section className="container-page relative z-10 -mt-16 pb-24">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="card p-6 shadow-xl shadow-fly-navy/5 sm:p-8 lg:col-span-5">
            <h2 className="text-xl font-bold text-fly-navy-900">Get in touch</h2>
            <ul className="mt-6 space-y-3">
              {CHANNELS.map(({ icon: Icon, label, value, note, href }) => {
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fly-orange-50">
                      <Icon className="h-5 w-5 text-fly-orange" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-slate-500">{label}</span>
                      <span className="block break-words font-semibold text-slate-900">{value}</span>
                      <span className="block text-xs text-slate-500">{note}</span>
                    </span>
                    {href && <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-fly-orange" />}
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-fly-orange/40 hover:bg-fly-orange-50/30">
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-500">
              All bookings are priced and paid in Australian dollars, with no foreign currency conversion fees.
            </p>
          </div>

          <div className="card p-6 shadow-xl shadow-fly-navy/5 sm:p-10 lg:col-span-7">
            <h2 className="text-2xl font-bold text-fly-navy-900 sm:text-3xl">Send us a message</h2>
            <p className="mt-2 text-slate-500">We&rsquo;ll reply with ideas and a tailored proposal within 2 business hours.</p>

            {token ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-4 text-xl font-bold text-slate-900">Message received</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Your reference is <span className="font-semibold text-fly-navy-900">{token}</span>. A specialist will be in
                  touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {error && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="ct-name" label="Full name">
                    <input id="ct-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field-input" />
                  </Field>
                  <Field id="ct-email" label="Email">
                    <input id="ct-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
                  </Field>
                </div>
                <Field id="ct-phone" label="Mobile">
                  <input id="ct-phone" type="tel" required autoComplete="tel" placeholder="04xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="field-input" />
                </Field>
                <Field id="ct-message" label="How can we help?">
                  <textarea
                    id="ct-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. A 10-day anniversary trip in November 2026 with Sigiriya, Ella and a Yala safari."
                    className="field-input resize-none"
                  />
                </Field>
                <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submitting ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
