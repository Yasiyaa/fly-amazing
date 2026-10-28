"use client";

import React, { useCallback, useState } from "react";
import { X, CheckCircle2, Send, Loader2 } from "lucide-react";
import { SelectedStop } from "@/components/architect/TourArchitectStudio";
import { AustralianAirport } from "@/data/australianAirports";
import { CuratedPackage } from "@/data/packages";
import Field from "@/components/ui/Field";
import { useOverlay } from "@/lib/useOverlay";
import { formatAUD } from "@/lib/utils";

export interface FinalizeTourData {
  type: "custom" | "package";
  packageName?: string;
  stops?: SelectedStop[];
  totalDays?: number;
  totalNights?: number;
  departureAirport?: AustralianAirport;
  vehicleType?: string;
  totalEstimatedAUD: number;
  curatedPackage?: CuratedPackage;
}

interface TourFinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourData: FinalizeTourData | null;
}

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  startDate: "",
  adults: "2",
  children: "0",
  specialRequests: "",
};

export default function TourFinalizeModal({ isOpen, onClose, tourData }: TourFinalizeModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [inquiryToken, setInquiryToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = useCallback(() => {
    if (loading) return;
    onClose();
    // Reset after a successful send so the next enquiry starts fresh
    if (inquiryToken) {
      setForm(EMPTY_FORM);
      setInquiryToken("");
    }
    setErrorMessage("");
  }, [loading, onClose, inquiryToken]);

  useOverlay(isOpen && tourData !== null, handleClose);

  if (!isOpen || !tourData) return null;

  const update = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const tourTitle =
    tourData.type === "package"
      ? tourData.packageName || tourData.curatedPackage?.title || "Curated package"
      : `Custom tour · ${tourData.stops?.length ?? 0} stops, ${tourData.totalNights ?? 0} nights`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const itinerary =
      tourData.type === "custom" && tourData.stops
        ? tourData.stops.map((s) => ({
            destinationId: s.destination.id,
            destinationName: s.destination.name,
            nights: s.nights,
            hotelId: s.selectedHotel.id,
            hotelName: s.selectedHotel.name,
            roomType: s.selectedHotel.roomType,
            pricePerNightAUD: s.selectedHotel.pricePerNightAUD,
          }))
        : tourData.curatedPackage?.itinerary.map((it) => ({
            destinationId: it.destinationId,
            destinationName: it.destinationName,
            nights: 1,
            hotelName: it.overnight,
          })) ?? [];

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          departureCity: tourData.departureAirport
            ? `${tourData.departureAirport.city} (${tourData.departureAirport.code})`
            : undefined,
          travelDates: { startDate: form.startDate || "Flexible" },
          travelers: { adults: Number(form.adults), children: Number(form.children) },
          tourType: tourData.type,
          packageName: tourData.packageName || tourData.curatedPackage?.title,
          estimatedBudgetAUD: tourData.totalEstimatedAUD,
          itinerary,
          specialRequests: form.specialRequests,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "We couldn't send your enquiry. Please try again.");
      setInquiryToken(json.inquiryId);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "We couldn't send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[60] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="finalize-title"
    >
      <div className="fixed inset-0 bg-fly-navy-950/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative flex min-h-full items-end justify-center p-0 sm:items-center sm:p-6">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
          <div className="relative border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="eyebrow">{inquiryToken ? "Enquiry received" : "Request a quote"}</p>
            <h3 id="finalize-title" className="mt-2 pr-10 text-2xl font-bold text-fly-navy-900 sm:text-3xl">
              {inquiryToken ? "Thank you, we're on it" : "Send us your trip"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {inquiryToken
                ? "A Fly Amazing travel specialist will be in touch within 2 business hours."
                : "No payment needed. A specialist checks flights and hotel availability, then sends your personalised quote."}
            </p>
          </div>

          {inquiryToken ? (
            <div className="px-6 py-8 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Your reference</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight text-fly-navy-900">{inquiryToken}</p>

              <ol className="panel mx-auto mt-8 max-w-md space-y-3 p-5 text-left text-sm text-slate-600">
                <li>
                  <span className="font-semibold text-slate-900">1. Flights.</span> We hold the best seats from{" "}
                  {tourData.departureAirport?.city ?? "your city"}.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">2. Hotels.</span> We confirm your chosen properties and
                  room types.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">3. Your quote.</span> We contact you at {form.email} with
                  final pricing and payment options.
                </li>
              </ol>

              <button type="button" onClick={handleClose} className="btn-navy mt-8">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="panel flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Your selection</p>
                  <p className="truncate font-semibold text-fly-navy-900">{tourTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Estimate per person</p>
                  <p className="font-display text-lg font-bold text-fly-navy-900">
                    {formatAUD(tourData.totalEstimatedAUD)} AUD
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="fm-name" label="Full name">
                  <input id="fm-name" type="text" required autoComplete="name" value={form.fullName} onChange={update("fullName")} className="field-input" />
                </Field>
                <Field id="fm-email" label="Email">
                  <input id="fm-email" type="email" required autoComplete="email" value={form.email} onChange={update("email")} className="field-input" />
                </Field>
                <Field id="fm-phone" label="Mobile">
                  <input id="fm-phone" type="tel" required autoComplete="tel" placeholder="04xx xxx xxx" value={form.phone} onChange={update("phone")} className="field-input" />
                </Field>
                <Field id="fm-date" label="When would you like to travel?" optional>
                  <input id="fm-date" type="text" placeholder="e.g. November 2026" value={form.startDate} onChange={update("startDate")} className="field-input" />
                </Field>
                <Field id="fm-adults" label="Adults">
                  <select id="fm-adults" value={form.adults} onChange={update("adults")} className="field-input cursor-pointer">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "adult" : "adults"}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="fm-children" label="Children (under 12)">
                  <select id="fm-children" value={form.children} onChange={update("children")} className="field-input cursor-pointer">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n === 0 ? "None" : `${n} ${n === 1 ? "child" : "children"}`}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field id="fm-notes" label="Anything else we should know?" optional>
                <textarea
                  id="fm-notes"
                  rows={3}
                  value={form.specialRequests}
                  onChange={update("specialRequests")}
                  placeholder="Dietary needs, a honeymoon, preferred airline…"
                  className="field-input resize-none"
                />
              </Field>

              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Sending…" : "Send enquiry"}
              </button>
              <p className="text-center text-xs text-slate-400">
                Your details are only used to prepare your quote.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
