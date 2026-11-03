"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Star, Plus, Minus, Trash2, Check, ArrowRight, Car, MapPin, Info, Users } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Price } from "@/components/currency/CurrencyProvider";
import { estimateCustomTrip, defaultVehicle, VEHICLES, FALLBACK_NIGHTLY_USD, type VehicleId } from "@/lib/pricing";
import type { Destination, Hotel } from "@/lib/types";
import { TIER_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import HotelDrawer from "./HotelDrawer";
import RequestTripModal from "./RequestTripModal";

export interface ArchitectStop {
  destinationId: string;
  nights: number;
  hotelId: string | null;
}

interface Props {
  destinations: Destination[];
  hotels: Hotel[];
  /** Destination to add from a deep link (/tour-architect?add=ella). */
  requestedDestinationId?: string | null;
  /** Explicit list of stops to pre-load (e.g. from an AI itinerary card). */
  initialStops?: { destinationId: string; nights: number }[] | null;
}

const MIN_NIGHTS = 1;
const MAX_NIGHTS = 10;
const DEFAULT_ROUTE: [string, number][] = [
  ["sigiriya", 2],
  ["kandy", 1],
  ["ella", 2],
  ["yala", 2],
  ["galle", 1],
];

export default function TourArchitectStudio({ destinations, hotels, requestedDestinationId, initialStops }: Props) {
  const byId = useMemo(() => new Map(destinations.map((d) => [d.id, d])), [destinations]);
  const defaultHotelFor = (destinationId: string) =>
    (hotels.find((h) => h.destinationId === destinationId && h.tier === "superior") ?? hotels.find((h) => h.destinationId === destinationId))?.id ?? null;

  const [stops, setStops] = useState<ArchitectStop[]>(() => {
    if (initialStops && initialStops.length > 0) {
      const valid = initialStops.filter((s) => byId.has(s.destinationId));
      if (valid.length > 0) {
        return valid.map((s) => ({ destinationId: s.destinationId, nights: s.nights, hotelId: defaultHotelFor(s.destinationId) }));
      }
    }
    return DEFAULT_ROUTE.filter(([id]) => byId.has(id)).map(([id, nights]) => ({ destinationId: id, nights, hotelId: defaultHotelFor(id) }));
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleId>(defaultVehicle(2));
  const [drawerHotel, setDrawerHotel] = useState<Hotel | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const addDestination = (id: string) => {
    const existing = stops.findIndex((s) => s.destinationId === id);
    if (existing !== -1) {
      setActiveIndex(existing);
      return;
    }
    const d = byId.get(id);
    if (!d) return;
    setStops((prev) => [...prev, { destinationId: id, nights: d.recommendedNights || 2, hotelId: defaultHotelFor(id) }]);
    setActiveIndex(stops.length);
  };

  useEffect(() => {
    if (requestedDestinationId) addDestination(requestedDestinationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedDestinationId]);

  // Keep the vehicle big enough for the group.
  useEffect(() => {
    const travellers = adults + children;
    const current = VEHICLES.find((v) => v.id === vehicle);
    if (!current || travellers > current.maxTravellers) setVehicle(defaultVehicle(travellers));
  }, [adults, children, vehicle]);

  const removeStop = (index: number) => {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((current) => (index < current ? current - 1 : Math.max(0, Math.min(current, stops.length - 2))));
  };
  const setNights = (index: number, nights: number) =>
    setStops((prev) => prev.map((s, i) => (i === index ? { ...s, nights: Math.max(MIN_NIGHTS, Math.min(MAX_NIGHTS, nights)) } : s)));
  const selectHotel = (hotel: Hotel) => setStops((prev) => prev.map((s, i) => (i === activeIndex ? { ...s, hotelId: hotel.id } : s)));

  const hotelById = useMemo(() => new Map(hotels.map((h) => [h.id, h])), [hotels]);
  const estimate = estimateCustomTrip({
    stops: stops.map((s) => ({ nights: s.nights, nightlyUSD: s.hotelId ? hotelById.get(s.hotelId)?.pricePerNightUSD : null })),
    adults,
    children,
    vehicle,
  });

  const active = stops[activeIndex] ?? stops[0];
  const activeDestination = active ? byId.get(active.destinationId) : undefined;
  const nearbyHotels = active ? hotels.filter((h) => h.destinationId === active.destinationId) : [];
  const travellers = adults + children;

  return (
    <section id="tour-architect" className="section relative scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeader eyebrow="Tour Architect" title="Design your own Sri Lanka itinerary">
          <div className="flex flex-wrap gap-3">
            <Counter label="Adults" value={adults} min={1} max={12} onChange={setAdults} />
            <Counter label="Children" value={children} min={0} max={8} onChange={setChildren} />
          </div>
        </SectionHeader>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
          Add destinations, set how long you stay and choose your hotels. The estimate covers hotels, your private vehicle and chauffeur-guide, and planning, and updates as you go.
        </p>

        <div className="panel mt-10 p-5">
          <p className="text-[13px] font-medium text-slate-700">Add destinations</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {destinations.map((dest) => {
              const included = stops.some((s) => s.destinationId === dest.id);
              const isActive = active?.destinationId === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => addDestination(dest.id)}
                  aria-pressed={included}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "border-fly-navy bg-fly-navy text-white"
                      : included
                      ? "border-fly-cyan-300 bg-fly-cyan-50 text-fly-cyan-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-fly-navy"
                  )}
                >
                  {included ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 opacity-60" />}
                  {dest.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-fly-navy-900">Your route</h3>
              <span className="text-sm text-slate-500">
                {stops.length} stops · {estimate.nights} nights
              </span>
            </div>

            <ol className="space-y-3">
              {stops.map((stop, index) => {
                const dest = byId.get(stop.destinationId);
                const hotel = stop.hotelId ? hotelById.get(stop.hotelId) : undefined;
                const isActive = index === activeIndex;
                if (!dest) return null;
                return (
                  <li key={stop.destinationId}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveIndex(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveIndex(index);
                        }
                      }}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border p-4 transition-all sm:flex-nowrap",
                        isActive ? "border-fly-cyan bg-fly-cyan-50/40 shadow-sm ring-1 ring-fly-cyan/30" : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold", isActive ? "bg-fly-orange text-white" : "bg-slate-100 text-slate-500")}>
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1 basis-[calc(100%-3rem)] sm:basis-auto">
                        <p className="truncate font-semibold text-slate-900">{dest.name}</p>
                        <p className="truncate text-[13px] text-slate-500">{hotel ? `${hotel.name} or similar` : "We'll propose a hotel"}</p>
                      </div>
                      <div className="ml-12 flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white p-1 sm:ml-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNights(index, stop.nights - 1);
                          }}
                          disabled={stop.nights <= MIN_NIGHTS}
                          aria-label={`One less night in ${dest.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold tabular-nums text-slate-900">{stop.nights}n</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNights(index, stop.nights + 1);
                          }}
                          disabled={stop.nights >= MAX_NIGHTS}
                          aria-label={`One more night in ${dest.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStop(index);
                        }}
                        disabled={stops.length <= 1}
                        aria-label={`Remove ${dest.name}`}
                        className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:invisible sm:ml-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="panel mt-6 p-5">
              <p className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-700">
                <Car className="h-4 w-4 text-fly-orange" />
                Private vehicle with chauffeur-guide
              </p>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLES.map((v) => {
                  const tooSmall = travellers > v.maxTravellers;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicle(v.id)}
                      disabled={tooSmall}
                      aria-pressed={vehicle === v.id}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-left text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                        vehicle === v.id ? "border-fly-navy bg-fly-navy text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      )}
                    >
                      <span className="block font-semibold">{v.label}</span>
                      <span className={cn("block text-xs", vehicle === v.id ? "text-white/70" : "text-slate-400")}>{v.seats}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {activeDestination && (
              <div className="relative h-48 overflow-hidden rounded-2xl sm:h-56">
                <Image src={activeDestination.bannerImage} alt={activeDestination.name} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
                <div className="scrim-bottom absolute inset-0" />
                <div className="absolute inset-x-5 bottom-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fly-cyan-200">{activeDestination.region}</p>
                  <h3 className="mt-1 text-2xl font-bold sm:text-3xl">{activeDestination.name}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-200">{activeDestination.tagline}</p>
                </div>
              </div>
            )}

            <div className="mb-4 mt-6 flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-fly-navy-900">Where you&rsquo;ll stay</h4>
              <span className="text-sm text-slate-500">
                {nearbyHotels.length} {nearbyHotels.length === 1 ? "option" : "options"}
              </span>
            </div>

            {nearbyHotels.length === 0 ? (
              <div className="panel flex gap-3 p-6 text-sm text-slate-500">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-fly-cyan-700" />
                We&rsquo;ll propose the best-value hotel here with your quote. The estimate uses about <Price usd={FALLBACK_NIGHTLY_USD} /> a night.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nearbyHotels.map((hotel) => {
                  const isSelected = active?.hotelId === hotel.id;
                  return (
                    <div
                      key={hotel.id}
                      className={cn(
                        "flex flex-col overflow-hidden rounded-2xl border bg-white transition-all",
                        isSelected ? "border-fly-orange shadow-md ring-1 ring-fly-orange/30" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                      )}
                    >
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={hotel.image || activeDestination?.thumbnail || activeDestination?.bannerImage || ""}
                          alt={hotel.image ? hotel.name : ""}
                          fill
                          sizes="(min-width: 640px) 30vw, 100vw"
                          className="object-cover"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-fly-navy-900 shadow-sm">
                          {TIER_LABELS[hotel.tier]}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center gap-0.5" aria-label={`${hotel.stars} stars`}>
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="ml-1.5 text-xs text-slate-500">{hotel.category}</span>
                        </div>
                        <h5 className="mt-1.5 font-semibold leading-snug text-slate-900">
                          {hotel.name} <span className="text-xs font-normal text-slate-400">or similar</span>
                        </h5>
                        <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-500">{hotel.distanceToHighlight}</p>
                        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                          <p className="text-sm">
                            <span className="font-display text-lg font-bold text-fly-navy-900">
                              <Price usd={hotel.pricePerNightUSD} />
                            </span>
                            <span className="text-slate-400"> / night</span>
                          </p>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDrawerHotel(hotel)}
                              className="inline-flex h-8 items-center rounded-full border border-slate-200 px-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => selectHotel(hotel)}
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

        <div className="sticky bottom-3 z-30 mt-10 flex flex-col gap-2 rounded-2xl bg-fly-navy-950/95 p-4 text-white shadow-2xl shadow-fly-navy-950/30 ring-1 ring-white/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-300">
            <span className="font-semibold text-white">
              {estimate.days} days · {estimate.nights} nights
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Users className="h-3.5 w-3.5 text-fly-cyan-300" />
              {travellers} {travellers === 1 ? "traveller" : "travellers"}
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
                <Price usd={estimate.perPersonUSD} />
              </p>
            </div>
            <button type="button" onClick={() => setRequestOpen(true)} className="btn-primary shrink-0">
              Request this trip
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <HotelDrawer
        hotel={drawerHotel}
        fallbackImage={activeDestination?.thumbnail || activeDestination?.bannerImage || ""}
        onClose={() => setDrawerHotel(null)}
        onSelect={selectHotel}
        isSelected={active?.hotelId === drawerHotel?.id}
      />

      <RequestTripModal
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
        kind="custom"
        stops={stops.map((s) => ({
          destinationId: s.destinationId,
          destinationName: byId.get(s.destinationId)?.name ?? s.destinationId,
          nights: s.nights,
          hotelId: s.hotelId,
          hotelName: s.hotelId ? hotelById.get(s.hotelId)?.name ?? null : null,
        }))}
        adults={adults}
        childCount={children}
        vehicle={vehicle}
        totalUSD={estimate.totalUSD}
      />
    </section>
  );
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-4 pr-1">
      <span className="text-[13px] text-slate-500">{label}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Fewer ${label.toLowerCase()}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-5 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`More ${label.toLowerCase()}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
