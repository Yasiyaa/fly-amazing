"use client";

import React from "react";
import Image from "next/image";
import { X, Star, CheckCircle, MapPin, Sparkles, MessageSquare } from "lucide-react";
import { Hotel } from "@/data/hotels";

interface HotelReviewDrawerProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectHotel?: (hotel: Hotel) => void;
  isSelected?: boolean;
}

export default function HotelReviewDrawer({
  hotel,
  isOpen,
  onClose,
  onSelectHotel,
  isSelected,
}: HotelReviewDrawerProps) {
  if (!isOpen || !hotel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto transform transition-transform duration-300">
        {/* Header with Hero Photo */}
        <div className="relative h-64 w-full flex-shrink-0">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition backdrop-blur-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hotel Badges Overlay */}
          <div className="absolute top-4 left-4">
            {hotel.badge && (
              <span className="px-3 py-1 rounded-full bg-fly-orange text-white text-[11px] font-black uppercase tracking-wider shadow">
                {hotel.badge}
              </span>
            )}
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-1 mb-1">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-semibold text-slate-200 ml-1.5">{hotel.category}</span>
            </div>
            <h3 className="text-2xl font-black text-white">{hotel.name}</h3>
            <p className="text-xs text-fly-cyan-200 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hotel.distanceToHighlight}</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-6">
          {/* Rating Summary Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-fly-navy">{hotel.reviewScore}</span>
                <span className="text-xs font-bold text-slate-400">/ 10</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase">
                  Exceptional
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Based on {hotel.reviewCount} verified guest reviews
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Est. Nightly Rate</span>
              <span className="text-xl font-black text-fly-orange">${hotel.pricePerNightAUD} AUD</span>
            </div>
          </div>

          {/* Amenities Chips */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Property Highlights & Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-fly-cyan-50 text-fly-cyan-900 border border-fly-cyan-200 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3 h-3 text-fly-cyan" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-fly-navy" />
                <span>Verified Australian Traveler Reviews</span>
              </h4>
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>100% Verified Guests</span>
              </span>
            </div>

            <div className="space-y-4">
              {hotel.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-fly-cyan transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{rev.author}</div>
                      <div className="text-[11px] text-slate-500">{rev.location} • {rev.date}</div>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-fly-navy">&ldquo;{rev.title}&rdquo;</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.sentimentTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Room Class</span>
            <span className="text-xs font-bold text-slate-900">{hotel.roomType}</span>
          </div>

          <button
            onClick={() => {
              if (onSelectHotel) onSelectHotel(hotel);
              onClose();
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-extrabold transition shadow-lg ${
              isSelected
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-fly-navy hover:bg-fly-navy-800 text-white shadow-fly-navy/30"
            }`}
          >
            {isSelected ? "Selected for Itinerary ✓" : "Select this Hotel for Stop"}
          </button>
        </div>
      </div>
    </div>
  );
}
