"use client";

import React from "react";
import Image from "next/image";
import { X, Star, MapPin, Check, Info } from "lucide-react";
import type { Hotel } from "@/lib/types";
import { TIER_LABELS } from "@/lib/types";
import { useOverlay } from "@/lib/useOverlay";
import { Price } from "@/components/currency/CurrencyProvider";

interface HotelDrawerProps {
  hotel: Hotel | null;
  fallbackImage: string;
  onClose: () => void;
  onSelect?: (hotel: Hotel) => void;
  isSelected?: boolean;
}

export default function HotelDrawer({ hotel, fallbackImage, onClose, onSelect, isSelected }: HotelDrawerProps) {
  useOverlay(hotel !== null, onClose);
  if (!hotel) return null;
  const tripAdvisor = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(`${hotel.name} Sri Lanka`)}`;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="hotel-drawer-title">
      <div className="absolute inset-0 bg-fly-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        <div data-lenis-prevent className="flex-1 overflow-y-auto">
          <div className="relative aspect-[16/10] w-full">
            <Image src={hotel.image || fallbackImage} alt={hotel.image ? hotel.name : ""} fill sizes="512px" className="object-cover" />
            <div className="scrim-bottom absolute inset-0" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {hotel.badge && <span className="badge-accent absolute left-4 top-4">{hotel.badge}</span>}
            <div className="absolute inset-x-5 bottom-5 text-white">
              <div className="flex items-center gap-0.5" aria-label={`${hotel.stars} stars`}>
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs text-slate-200">{hotel.category}</span>
              </div>
              <h3 id="hotel-drawer-title" className="mt-1.5 text-2xl font-bold">
                {hotel.name} <span className="text-base font-medium text-slate-300">or similar</span>
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.distanceToHighlight}
              </p>
            </div>
          </div>

          <div className="space-y-8 p-6">
            <div className="panel flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-xs text-slate-500">Standard</p>
                <p className="font-semibold text-slate-900">{TIER_LABELS[hotel.tier]}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Indicative room rate</p>
                <p className="font-display text-xl font-bold text-fly-navy-900">
                  <Price usd={hotel.pricePerNightUSD} />
                  <span className="text-sm font-medium text-slate-400"> / night</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-slate-900">Highlights</h4>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {hotel.amenities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-fly-cyan" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 rounded-xl bg-fly-cyan-50/60 p-4 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-fly-cyan-700" />
              <p>
                {hotel.description}{" "}
                <a href={tripAdvisor} target="_blank" rel="noopener noreferrer" className="font-semibold text-fly-navy underline underline-offset-2">
                  Read guest reviews on Tripadvisor
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white p-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Room</p>
            <p className="truncate text-sm font-semibold text-slate-900">{hotel.roomType}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect?.(hotel);
              onClose();
            }}
            className={isSelected ? "btn bg-emerald-600 text-white hover:bg-emerald-700" : "btn-navy"}
          >
            {isSelected && <Check className="h-4 w-4" />}
            {isSelected ? "Selected" : "Choose this hotel"}
          </button>
        </div>
      </div>
    </div>
  );
}
