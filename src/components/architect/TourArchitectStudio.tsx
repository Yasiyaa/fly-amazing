"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Compass,
  MapPin,
  Calendar,
  Star,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  ShieldCheck,
  Car,
  Plane,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import { SRI_LANKA_DESTINATIONS, Destination } from "@/data/destinations";
import { HOTELS_CATALOG, Hotel } from "@/data/hotels";
import { AUSTRALIAN_AIRPORTS, AustralianAirport } from "@/data/australianAirports";
import HotelReviewDrawer from "./HotelReviewDrawer";

export interface SelectedStop {
  destination: Destination;
  nights: number;
  selectedHotel: Hotel;
}

interface TourArchitectStudioProps {
  onFinalizeTour: (tourState: {
    stops: SelectedStop[];
    totalDays: number;
    totalNights: number;
    departureAirport: AustralianAirport;
    vehicleType: string;
    totalEstimatedAUD: number;
  }) => void;
  initialAirport?: AustralianAirport;
}

export default function TourArchitectStudio({
  onFinalizeTour,
  initialAirport,
}: TourArchitectStudioProps) {
  // Australian Departure
  const [departureAirport, setDepartureAirport] = useState<AustralianAirport>(
    initialAirport || AUSTRALIAN_AIRPORTS[0]
  );

  // Private Vehicle Type
  const [vehicleType, setVehicleType] = useState<string>("Executive Luxury Sedan");

  // Selected Itinerary Stops (Default: Classic 4-stop loop)
  const [stops, setStops] = useState<SelectedStop[]>([
    {
      destination: SRI_LANKA_DESTINATIONS[0], // Sigiriya
      nights: 2,
      selectedHotel: HOTELS_CATALOG.find((h) => h.destinationId === "sigiriya") || HOTELS_CATALOG[0],
    },
    {
      destination: SRI_LANKA_DESTINATIONS[1], // Ella
      nights: 2,
      selectedHotel: HOTELS_CATALOG.find((h) => h.destinationId === "ella") || HOTELS_CATALOG[2],
    },
    {
      destination: SRI_LANKA_DESTINATIONS[2], // Yala
      nights: 2,
      selectedHotel: HOTELS_CATALOG.find((h) => h.destinationId === "yala") || HOTELS_CATALOG[4],
    },
    {
      destination: SRI_LANKA_DESTINATIONS[3], // Galle
      nights: 2,
      selectedHotel: HOTELS_CATALOG.find((h) => h.destinationId === "galle") || HOTELS_CATALOG[6],
    },
  ]);

  // Active stop index for hotel discovery
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

  // Review Drawer state
  const [reviewDrawerHotel, setReviewDrawerHotel] = useState<Hotel | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  const activeStop = stops[activeStopIndex] || stops[0];

  // Dynamic hotels for active destination
  const nearbyHotels = activeStop
    ? HOTELS_CATALOG.filter((h) => h.destinationId === activeStop.destination.id)
    : [];

  // Add a new destination
  const handleAddDestination = (dest: Destination) => {
    if (stops.some((s) => s.destination.id === dest.id)) {
      const idx = stops.findIndex((s) => s.destination.id === dest.id);
      setActiveStopIndex(idx);
      return;
    }
    const defaultHotel =
      HOTELS_CATALOG.find((h) => h.destinationId === dest.id) || HOTELS_CATALOG[0];
    const newStop: SelectedStop = {
      destination: dest,
      nights: dest.recommendedNights || 2,
      selectedHotel: defaultHotel,
    };
    const updated = [...stops, newStop];
    setStops(updated);
    setActiveStopIndex(updated.length - 1);
  };

  // Remove a destination
  const handleRemoveStop = (index: number) => {
    if (stops.length <= 1) return;
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
    setActiveStopIndex(Math.max(0, activeStopIndex - 1));
  };

  // Change nights
  const handleNightsChange = (index: number, nights: number) => {
    const updated = [...stops];
    updated[index].nights = Math.max(1, Math.min(10, nights));
    setStops(updated);
  };

  // Select hotel for active stop
  const handleSelectHotelForStop = (hotel: Hotel) => {
    const updated = [...stops];
    updated[activeStopIndex].selectedHotel = hotel;
    setStops(updated);
  };

  // Total Calculations
  const totalNights = stops.reduce((acc, s) => acc + s.nights, 0);
  const totalDays = totalNights + 1;

  // Calculate pricing: Flights + Hotel nights + Chauffeur vehicle ($120 AUD/day) + Sightseeing permits ($40/day)
  const flightsCost = departureAirport.baseFareAUD;
  const accommodationCost = stops.reduce(
    (acc, s) => acc + (s.selectedHotel ? s.selectedHotel.pricePerNightAUD * s.nights : 200 * s.nights),
    0
  );
  const chauffeurGuideCost = totalDays * 120;
  const permitsAndConcierge = totalDays * 50;
  const totalEstimatedAUD = Math.round(
    flightsCost + accommodationCost + chauffeurGuideCost + permitsAndConcierge
  );

  return (
    <section id="tour-architect" className="py-20 bg-white relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-fly-cyan-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-fly-orange-50/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Studio Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fly-cyan-100 text-fly-cyan-900 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Compass className="w-3.5 h-3.5 text-fly-orange" />
              <span>Interactive Bespoke Tour Studio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-fly-navy tracking-tight uppercase">
              Tour Architect Studio
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-lg font-medium">
              Add destinations, adjust stay lengths, and choose luxury hotels dynamically with live AUD pricing.
            </p>
          </div>

          {/* Australian Departure Airport Switcher */}
          <div className="mt-4 md:mt-0 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Plane className="w-3 h-3 text-fly-orange" />
              <span>Departing Airport:</span>
            </div>
            <select
              value={departureAirport.code}
              onChange={(e) => {
                const found = AUSTRALIAN_AIRPORTS.find((a) => a.code === e.target.value);
                if (found) setDepartureAirport(found);
              }}
              className="bg-white text-xs font-bold text-fly-navy px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fly-cyan"
            >
              {AUSTRALIAN_AIRPORTS.map((air) => (
                <option key={air.code} value={air.code}>
                  {air.city} ({air.code}) — {air.estFlightTime}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. Destination Palette / Stop Chips */}
        <div className="mb-8 p-4 rounded-3xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-fly-orange" />
              <span>Explore & Add Sri Lanka Destinations:</span>
            </span>
            <span className="text-[11px] text-fly-cyan-700 font-medium">
              Click any region to add or view curated stays
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SRI_LANKA_DESTINATIONS.map((dest) => {
              const isIncluded = stops.some((s) => s.destination.id === dest.id);
              const isActive = activeStop && activeStop.destination.id === dest.id;

              return (
                <button
                  key={dest.id}
                  onClick={() => handleAddDestination(dest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? "bg-fly-navy text-white shadow-md ring-2 ring-fly-orange scale-105"
                      : isIncluded
                      ? "bg-fly-cyan-50 text-fly-cyan-900 border border-fly-cyan-300 font-bold"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span className="font-display">{dest.name}</span>
                  {isIncluded ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                      ✓
                    </span>
                  ) : (
                    <Plus className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Main Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Itinerary Stops Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-display text-fly-navy flex items-center space-x-2">
                <span>Selected Journey Route</span>
                <span className="px-2 py-0.5 rounded-full bg-fly-cyan-50 text-fly-cyan-800 text-[11px] font-bold font-sans">
                  {stops.length} Stops &bull; {totalNights} Nights
                </span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {stops.map((stop, index) => {
                const isActive = index === activeStopIndex;

                return (
                  <div
                    key={`${stop.destination.id}-${index}`}
                    onClick={() => setActiveStopIndex(index)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-fly-navy-50/80 to-white border-fly-cyan shadow-sm ring-1 ring-fly-cyan/30"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-fly-orange to-fly-cyan"></div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isActive
                              ? "bg-fly-orange text-white shadow-xs"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <h4 className="text-sm font-display font-normal text-slate-900 leading-tight">
                            {stop.destination.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-fly-cyan-700 block uppercase">
                            {stop.destination.region}
                          </span>

                          {/* Selected Hotel Pill */}
                          <div className="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs">
                            <span className="text-fly-orange font-bold text-[10px]">🏨 Stay:</span>
                            <span className="truncate max-w-[170px] text-xs">{stop.selectedHotel.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Nights Stepper & Delete */}
                      <div className="flex flex-col items-end space-y-1.5">
                        <div className="flex items-center space-x-1 bg-slate-100 px-1.5 py-0.5 rounded-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNightsChange(index, stop.nights - 1);
                            }}
                            className="w-4 h-4 rounded bg-white text-slate-700 font-bold flex items-center justify-center text-[10px]"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-slate-900 px-1">
                            {stop.nights}N
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNightsChange(index, stop.nights + 1);
                            }}
                            className="w-4 h-4 rounded bg-white text-slate-700 font-bold flex items-center justify-center text-[10px]"
                          >
                            +
                          </button>
                        </div>

                        {stops.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveStop(index);
                            }}
                            className="text-slate-400 hover:text-red-500 p-0.5"
                            title="Remove Stop"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vehicle Fleet Selector */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Car className="w-3.5 h-3.5 text-fly-orange" />
                  <span>Chauffeured Vehicle:</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Included in Quote
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {["Executive Sedan", "Luxury Van", "4x4 Safari SUV", "Mercedes Coach"].map(
                  (v) => (
                    <button
                      key={v}
                      onClick={() => setVehicleType(v)}
                      className={`p-2 rounded-xl text-left transition border text-xs ${
                        vehicleType === v
                          ? "bg-fly-navy text-white border-fly-navy font-bold"
                          : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200 font-normal"
                      }`}
                    >
                      {v}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column: DYNAMIC NEARBY HOTELS & REVIEWS (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header for Active Destination */}
            {activeStop && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="relative h-40 w-full">
                  <Image
                    src={activeStop.destination.bannerImage}
                    alt={activeStop.destination.name}
                    fill
                    className="object-cover brightness-[0.75]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-fly-cyan-200 block">
                      Active Stop • {activeStop.destination.region}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-normal font-display text-white">{activeStop.destination.name}</h3>
                    <p className="text-xs text-slate-200 font-light line-clamp-1">
                      {activeStop.destination.tagline}
                    </p>
                  </div>
                </div>

                {/* Highlights bar */}
                <div className="p-2.5 bg-white flex flex-wrap items-center gap-1.5 text-xs border-b border-slate-100">
                  <span className="font-bold text-fly-navy flex items-center space-x-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-fly-orange" />
                    <span>Top Activities:</span>
                  </span>
                  {activeStop.destination.highlights.slice(0, 3).map((hl, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-light"
                    >
                      {hl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Nearby Hotels Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs sm:text-sm font-bold text-fly-navy flex items-center space-x-1.5">
                  <span>Dynamic Nearby Stays in {activeStop?.destination.name}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({nearbyHotels.length} options)
                  </span>
                </h4>
                <span className="text-[10px] text-fly-cyan-700 font-medium">
                  Tap to inspect verified reviews
                </span>
              </div>

              {nearbyHotels.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs font-light">
                  Our concierge partners with private villas and tea bungalows in this region. We will assign the premier boutique property upon inquiry.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {nearbyHotels.map((hotel) => {
                    const isSelected = activeStop.selectedHotel.id === hotel.id;

                    return (
                      <div
                        key={hotel.id}
                        className={`rounded-2xl border bg-white p-3 flex flex-col justify-between transition-all shadow-xs hover:shadow-md ${
                          isSelected
                            ? "border-fly-orange ring-1 ring-fly-orange/40 shadow-xs"
                            : "border-slate-200 hover:border-fly-cyan"
                        }`}
                      >
                        <div>
                          {/* Hotel Thumbnail & Score */}
                          <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                            <Image
                              src={hotel.image}
                              alt={hotel.name}
                              fill
                              className="object-cover"
                            />
                            {/* Score badge */}
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-fly-navy/90 text-white backdrop-blur-md text-[11px] font-black flex items-center space-x-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              <span>{hotel.reviewScore}</span>
                            </div>

                            {hotel.badge && (
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-fly-orange text-white text-[9px] font-black uppercase tracking-wider">
                                {hotel.badge}
                              </div>
                            )}
                          </div>

                          {/* Hotel Name & Stars */}
                          <div className="flex items-center space-x-1 mb-1">
                            {Array.from({ length: hotel.stars }).map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-[10px] font-medium text-slate-500 ml-1">
                              {hotel.category}
                            </span>
                          </div>

                          <h5 className="text-sm font-display font-normal text-slate-900 leading-snug">
                            {hotel.name}
                          </h5>

                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-light">
                            {hotel.roomType}
                          </p>

                          {/* Top Review Quote Sneak Peek */}
                          {hotel.reviews[0] && (
                            <div className="mt-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-600 italic font-display">
                              &ldquo;{hotel.reviews[0].comment.slice(0, 65)}...&rdquo;
                              <span className="block font-medium font-sans text-slate-800 not-italic text-[9px] mt-0.5">
                                — {hotel.reviews[0].author}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-medium text-slate-400 block tracking-wider">
                              Nightly Rate
                            </span>
                            <span className="text-sm font-normal font-display text-fly-navy">
                              ${hotel.pricePerNightAUD}{" "}
                              <span className="text-[10px] font-normal text-slate-500 font-sans">AUD</span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setReviewDrawerHotel(hotel);
                                setIsReviewDrawerOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center space-x-1"
                              title="View Guest Reviews"
                            >
                              <Eye className="w-3 h-3 text-fly-cyan" />
                              <span>Reviews</span>
                            </button>

                            <button
                              onClick={() => handleSelectHotelForStop(hotel)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-fly-navy hover:bg-fly-navy-800 text-white"
                              }`}
                            >
                              {isSelected ? "Selected ✓" : "Select"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Persistent Floating Live AUD Budget & Itinerary Ticker Dock */}
        <div className="mt-10 sticky bottom-3 z-40 rounded-2xl bg-fly-navy-950/95 backdrop-blur-2xl text-white p-3.5 sm:p-4 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">
                {totalDays} Days / {totalNights} Nights
              </span>
            </div>

            <div className="hidden md:block text-white/30">•</div>

            <div className="flex items-center space-x-1.5 text-slate-300">
              <Plane className="w-3.5 h-3.5 text-fly-cyan" />
              <span>
                {departureAirport.city} ({departureAirport.code}) ✈ Colombo
              </span>
            </div>

            <div className="hidden md:block text-white/30">•</div>

            <div className="flex items-center space-x-1.5 text-slate-300">
              <Car className="w-3.5 h-3.5 text-fly-orange" />
              <span>{vehicleType}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[9px] sm:text-[10px] uppercase text-slate-400 font-medium tracking-wider block">
                Estimated Total (pp)
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl sm:text-2xl font-bold font-display text-fly-orange">
                  ${totalEstimatedAUD.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-300 font-sans">AUD</span>
              </div>
            </div>

            <button
              onClick={() =>
                onFinalizeTour({
                  stops,
                  totalDays,
                  totalNights,
                  departureAirport,
                  vehicleType,
                  totalEstimatedAUD,
                })
              }
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange text-white text-xs sm:text-sm font-bold shadow-md shadow-fly-orange/40 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Lock In Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Drawer Modal */}
      <HotelReviewDrawer
        hotel={reviewDrawerHotel}
        isOpen={isReviewDrawerOpen}
        onClose={() => setIsReviewDrawerOpen(false)}
        onSelectHotel={handleSelectHotelForStop}
        isSelected={activeStop?.selectedHotel.id === reviewDrawerHotel?.id}
      />
    </section>
  );
}
