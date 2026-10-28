"use client";

import React from "react";
import Image from "next/image";
import { X, Star, MapPin, Check, BadgeCheck } from "lucide-react";
import { Hotel } from "@/data/hotels";
import { useOverlay } from "@/lib/useOverlay";
import { formatAUD } from "@/lib/utils";

interface HotelReviewDrawerProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectHotel?: (hotel: Hotel) => void;
  isSelected?: boolean;
}

function scoreLabel(score: number) {
  if (score >= 9.5) return "Exceptional";
  if (score >= 9) return "Superb";
  if (score >= 8.5) return "Excellent";
  return "Very good";
}

export default function HotelReviewDrawer({ hotel, isOpen, onClose, onSelectHotel, isSelected }: HotelReviewDrawerProps) {
  useOverlay(isOpen && hotel !== null, onClose);

  if (!isOpen || !hotel) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="hotel-drawer-title">
      <div className="absolute inset-0 bg-fly-navy-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        <div data-lenis-prevent className="flex-1 overflow-y-auto">
          <div className="relative aspect-[16/10] w-full">
            <Image src={hotel.image} alt={hotel.name} fill sizes="512px" className="object-cover" />
            <div className="scrim-bottom absolute inset-0" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {hotel.badge && <span className="badge-accent absolute left-4 top-4">{hotel.badge}</span>}
            <div className="absolute inset-x-5 bottom-5 text-white">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs text-slate-200">{hotel.category}</span>
              </div>
              <h3 id="hotel-drawer-title" className="mt-1.5 text-2xl font-bold">
                {hotel.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.distanceToHighlight}
              </p>
            </div>
          </div>

          <div className="space-y-8 p-6">
            <div className="panel flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-fly-navy font-display text-lg font-bold text-white">
                  {hotel.reviewScore}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{scoreLabel(hotel.reviewScore)}</p>
                  <p className="text-xs text-slate-500">{hotel.reviewCount.toLocaleString()} guest reviews</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">From</p>
                <p className="font-display text-xl font-bold text-fly-navy-900">
                  {formatAUD(hotel.pricePerNightAUD)}
                  <span className="text-sm font-medium text-slate-400"> / night</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-slate-900">Amenities</h4>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {hotel.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-fly-cyan" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-[13px] font-semibold text-slate-900">Guest reviews</h4>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified stays
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {hotel.reviews.map((rev) => (
                  <article key={rev.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{rev.author}</p>
                        <p className="text-xs text-slate-500">
                          {rev.location} · {rev.date}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {rev.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-fly-navy-900">{rev.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{rev.comment}</p>
                    {rev.sentimentTags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {rev.sentimentTags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
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
              onSelectHotel?.(hotel);
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
