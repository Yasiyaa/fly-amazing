"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Star, Plus, Minus, Trash2, Check, ArrowRight, Car, Plane, MessageSquareQuote } from "lucide-react";
import { SRI_LANKA_DESTINATIONS, Destination } from "@/data/destinations";
import { HOTELS_CATALOG, Hotel } from "@/data/hotels";
import { AUSTRALIAN_AIRPORTS, AustralianAirport } from "@/data/australianAirports";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn, formatAUD } from "@/lib/utils";
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
  /** Destination to add from outside the studio (e.g. a destination card); nonce makes repeat requests fire. */
  requestedDestination?: { id: string; nonce: number } | null;
  className?: string;
}

const VEHICLES = ["Executive Sedan", "Luxury Van", "4x4 Safari SUV", "Mercedes Coach"];
const MIN_NIGHTS = 1;
const MAX_NIGHTS = 10;

// Pricing: flights + hotel nights + chauffeur-guide ($120 AUD/day) + permits & concierge ($50 AUD/day)
const CHAUFFEUR_PER_DAY = 120;
const PERMITS_PER_DAY = 50;
const FALLBACK_NIGHTLY_RATE = 200;

function defaultHotelFor(destinationId: string) {
  return HOTELS_CATALOG.find((h) => h.destinationId === destinationId) || HOTELS_CATALOG[0];
}

function makeStop(destination: Destination, nights = destination.recommendedNights || 2): SelectedStop {
  return { destination, nights, selectedHotel: defaultHotelFor(destination.id) };
}

const DEFAULT_ROUTE = ["sigiriya", "ella", "yala", "galle"]
  .map((id) => SRI_LANKA_DESTINATIONS.find((d) => d.id === id))
  .filter((d): d is Destination => Boolean(d))
  .map((d) => makeStop(d, 2));

export default function TourArchitectStudio({
  onFinalizeTour,
  initialAirport,
  requestedDestination,
  className,
}: TourArchitectStudioProps) {
  const [departureAirport, setDepartureAirport] = useState<AustralianAirport>(initialAirport || AUSTRALIAN_AIRPORTS[0]);
  const [vehicleType, setVehicleType] = useState<string>(VEHICLES[0]);
  const [stops, setStops] = useState<SelectedStop[]>(DEFAULT_ROUTE);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [reviewDrawerHotel, setReviewDrawerHotel] = useState<Hotel | null>(null);

  // Keep in sync when the departure city is changed elsewhere on the page
  useEffect(() => {
    if (initialAirport) setDepartureAirport(initialAirport);
  }, [initialAirport]);

  const activeStop = stops[activeStopIndex] ?? stops[0];
  const nearbyHotels = HOTELS_CATALOG.filter((h) => h.destinationId === activeStop.destination.id);

  const handleAddDestination = (dest: Destination) => {
    const existing = stops.findIndex((s) => s.destination.id === dest.id);
    if (existing !== -1) {
      setActiveStopIndex(existing);
      return;
    }
    setStops((prev) => [...prev, makeStop(dest)]);
    setActiveStopIndex(stops.length);
  };

  useEffect(() => {
    if (!requestedDestination) return;
    const dest = SRI_LANKA_DESTINATIONS.find((d) => d.id === requestedDestination.id);
    if (dest) handleAddDestination(dest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedDestination?.nonce]);

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((_, i) => i !== index));
    setActiveStopIndex((current) => {
      if (index < current) return current - 1;
      if (index === current) return Math.max(0, Math.min(current, stops.length - 2));
      return current;
    });
  };

  const handleNightsChange = (index: number, nights: number) => {
    setStops((prev) =>
      prev.map((s, i) => (i === index ? { ...s, nights: Math.max(MIN_NIGHTS, Math.min(MAX_NIGHTS, nights)) } : s))
    );
  };

  const handleSelectHotelForStop = (hotel: Hotel) => {
    setStops((prev) => prev.map((s, i) => (i === activeStopIndex ? { ...s, selectedHotel: hotel } : s)));
  };

  const totalNights = stops.reduce((acc, s) => acc + s.nights, 0);
  const totalDays = totalNights + 1;
  const accommodationCost = stops.reduce(
    (acc, s) => acc + (s.selectedHotel ? s.selectedHotel.pricePerNightAUD : FALLBACK_NIGHTLY_RATE) * s.nights,
    0
  );
  const totalEstimatedAUD = Math.round(
    departureAirport.baseFareAUD + accommodationCost + totalDays * (CHAUFFEUR_PER_DAY + PERMITS_PER_DAY)
  );

  return (
    <section id="tour-architect" className={cn("section relative scroll-mt-20 bg-white", className)}>
      <div className="container-page">
        <SectionHeader eyebrow="Tour Architect" title="Design your own Sri Lanka itinerary">
          <label className="block w-full md:w-auto">
            <span className="field-label flex items-center gap-1.5">
              <Plane className="h-3.5 w-3.5 text-fly-orange" />
              Flying from
            </span>
            <select
              value={departureAirport.code}
              onChange={(e) => {
                const found = AUSTRALIAN_AIRPORTS.find((a) => a.code === e.target.value);
                if (found) setDepartureAirport(found);
              }}
              className="field-input cursor-pointer py-2.5 font-medium md:w-72"
            >
              {AUSTRALIAN_AIRPORTS.map((air) => (
                <option key={air.code} value={air.code}>
                  {air.city} ({air.code}) · {air.estFlightTime}
                </option>
              ))}
            </select>
          </label>
        </SectionHeader>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
          Add destinations, set how long you stay, and choose your hotels. The estimate updates live in AUD.
        </p>

        {/* Destination picker */}
        <div className="panel mt-10 p-5">
          <p className="text-[13px] font-medium text-slate-700">Add destinations</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SRI_LANKA_DESTINATIONS.map((dest) => {
              const isIncluded = stops.some((s) => s.destination.id === dest.id);
              const isActive = activeStop.destination.id === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleAddDestination(dest)}
                  aria-pressed={isIncluded}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "border-fly-navy bg-fly-navy text-white"
                      : isIncluded
                      ? "border-fly-cyan-300 bg-fly-cyan-50 text-fly-cyan-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-fly-navy"
                  )}
                >
                  {isIncluded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 opacity-60" />}
                  {dest.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Route */}
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-fly-navy-900">Your route</h3>
              <span className="text-sm text-slate-500">
                {stops.length} stops · {totalNights} nights
              </span>
            </div>

            <ol className="space-y-3">
              {stops.map((stop, index) => {
                const isActive = index === activeStopIndex;
                return (
                  <li key={stop.destination.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveStopIndex(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveStopIndex(index);
                        }
                      }}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border p-4 transition-all sm:flex-nowrap",
                        isActive
                          ? "border-fly-cyan bg-fly-cyan-50/40 shadow-sm ring-1 ring-fly-cyan/30"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                          isActive ? "bg-fly-orange text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1 basis-[calc(100%-3rem)] sm:basis-auto">
                        <p className="truncate font-semibold text-slate-900">{stop.destination.name}</p>
                        <p className="truncate text-[13px] text-slate-500">{stop.selectedHotel.name}</p>
                      </div>

                      <div className="ml-12 flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white p-1 sm:ml-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNightsChange(index, stop.nights - 1);
                          }}
                          disabled={stop.nights <= MIN_NIGHTS}
                          aria-label={`One less night in ${stop.destination.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold tabular-nums text-slate-900">
                          {stop.nights}n
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNightsChange(index, stop.nights + 1);
                          }}
                          disabled={stop.nights >= MAX_NIGHTS}
                          aria-label={`One more night in ${stop.destination.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStop(index);
                        }}
                        disabled={stops.length <= 1}
                        aria-label={`Remove ${stop.destination.name}`}
                        className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:invisible sm:ml-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="panel mt-6 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                  <Car className="h-4 w-4 text-fly-orange" />
                  Private vehicle
                </p>
                <span className="text-xs font-medium text-emerald-700">Included in estimate</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicleType(v)}
                    aria-pressed={vehicleType === v}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                      vehicleType === v
                        ? "border-fly-navy bg-fly-navy text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active stop & hotels */}
          <div className="lg:col-span-7">
            <div className="relative h-48 overflow-hidden rounded-2xl sm:h-56">
              <Image
                src={activeStop.destination.bannerImage}
                alt={activeStop.destination.name}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="scrim-bottom absolute inset-0" />
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fly-cyan-200">
                  {activeStop.destination.region}
                </p>
                <h3 className="mt-1 text-2xl font-bold sm:text-3xl">{activeStop.destination.name}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-slate-200">{activeStop.destination.tagline}</p>
              </div>
            </div>

            <div className="mb-4 mt-6 flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-fly-navy-900">Where you&rsquo;ll stay</h4>
              <span className="text-sm text-slate-500">
                {nearbyHotels.length} {nearbyHotels.length === 1 ? "option" : "options"}
              </span>
            </div>

            {nearbyHotels.length === 0 ? (
              <div className="panel p-6 text-center text-sm text-slate-500">
                We work with private villas and tea bungalows here and will propose the best property with your quote.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nearbyHotels.map((hotel) => {
                  const isSelected = activeStop.selectedHotel.id === hotel.id;
                  return (
                    <div
                      key={hotel.id}
                      className={cn(
                        "flex flex-col overflow-hidden rounded-2xl border bg-white transition-all",
                        isSelected
                          ? "border-fly-orange shadow-md ring-1 ring-fly-orange/30"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                      )}
                    >
                      <div className="relative aspect-[16/10]">
                        <Image src={hotel.image} alt={hotel.name} fill sizes="(min-width: 640px) 30vw, 100vw" className="object-cover" />
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-fly-navy-900 shadow-sm">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {hotel.reviewScore}
                        </span>
                        {hotel.badge && <span className="badge-accent absolute bottom-3 left-3">{hotel.badge}</span>}
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center gap-0.5" aria-label={`${hotel.stars} star hotel`}>
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="ml-1.5 text-xs text-slate-500">{hotel.category}</span>
                        </div>
                        <h5 className="mt-1.5 font-semibold leading-snug text-slate-900">{hotel.name}</h5>
                        <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-500">{hotel.roomType}</p>

                        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                          <p className="text-sm">
                            <span className="font-display text-lg font-bold text-fly-navy-900">
                              {formatAUD(hotel.pricePerNightAUD)}
                            </span>
                            <span className="text-slate-400"> / night</span>
                          </p>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setReviewDrawerHotel(hotel)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                              aria-label={`Read reviews for ${hotel.name}`}
                              title="Guest reviews"
                            >
                              <MessageSquareQuote className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectHotelForStop(hotel)}
                              aria-pressed={isSelected}
                              className={cn(
                                "inline-flex h-8 items-center gap-1 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
                                isSelected ? "bg-emerald-600 text-white" : "bg-fly-navy text-white hover:bg-fly-navy-700"
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live estimate dock */}
        <div className="sticky bottom-3 z-30 mt-10 flex flex-col gap-2 rounded-2xl bg-fly-navy-950/95 p-4 text-white shadow-2xl shadow-fly-navy-950/30 ring-1 ring-white/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-300">
            <span className="font-semibold text-white">
              {totalDays} days · {totalNights} nights
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Plane className="h-3.5 w-3.5 text-fly-cyan-300" />
              {departureAirport.city} → Colombo
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <Car className="h-3.5 w-3.5 text-fly-cyan-300" />
              {vehicleType}
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <MapPin className="h-3.5 w-3.5 text-fly-cyan-300" />
              {stops.length} stops
            </span>
          </div>

          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <div className="sm:text-right">
              <p className="hidden text-[11px] uppercase tracking-wider text-slate-400 sm:block">Estimate per person</p>
              <p className="font-display text-xl font-bold sm:text-2xl">
                {formatAUD(totalEstimatedAUD)} <span className="text-sm font-medium text-slate-400">AUD pp</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onFinalizeTour({ stops, totalDays, totalNights, departureAirport, vehicleType, totalEstimatedAUD })
              }
              className="btn-primary shrink-0"
            >
              Request quote
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <HotelReviewDrawer
        hotel={reviewDrawerHotel}
        isOpen={reviewDrawerHotel !== null}
        onClose={() => setReviewDrawerHotel(null)}
        onSelectHotel={handleSelectHotelForStop}
        isSelected={activeStop.selectedHotel.id === reviewDrawerHotel?.id}
      />
    </section>
  );
}
