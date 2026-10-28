"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, ArrowRight, Minus, Plus } from "lucide-react";
import { AUSTRALIAN_AIRPORTS, AustralianAirport } from "@/data/australianAirports";
import { cn, formatAUD } from "@/lib/utils";

interface SmartBookingIslandProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

type Mode = "bundle" | "packages" | "flights";

const MODES: { id: Mode; label: string; cta: string }[] = [
  { id: "bundle", label: "Flights + tour", cta: "Build my tour" },
  { id: "packages", label: "Curated packages", cta: "View packages" },
  { id: "flights", label: "Flights only", cta: "Compare fares" },
];

const MONTHS = ["Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027"];

export default function SmartBookingIsland({ onSelectDeparture, onOpenArchitect }: SmartBookingIslandProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("bundle");
  const [selectedAirport, setSelectedAirport] = useState<AustralianAirport>(AUSTRALIAN_AIRPORTS[0]);
  const [adults, setAdults] = useState(2);
  const [travelMonth, setTravelMonth] = useState(MONTHS[0]);

  const activeMode = MODES.find((m) => m.id === mode)!;

  const handleAirportChange = (airport: AustralianAirport) => {
    setSelectedAirport(airport);
    onSelectDeparture?.(airport);
  };

  const handleAction = () => {
    if (mode === "packages") router.push("/packages");
    else if (mode === "flights") router.push("/flights");
    else if (onOpenArchitect) onOpenArchitect();
    else router.push("/tour-architect");
  };

  return (
    <div id="smart-search" className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-4 text-left text-slate-700 shadow-2xl shadow-black/30 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-1 flex overflow-x-auto px-1">
          <div className="inline-flex shrink-0 rounded-full bg-slate-100 p-1" role="tablist" aria-label="Trip type">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                  mode === m.id ? "bg-white text-fly-navy shadow-sm" : "text-slate-500 hover:text-fly-navy"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[13px] text-slate-500">
          Return flights from{" "}
          <span className="font-display text-base font-bold text-fly-navy-900">{formatAUD(selectedAirport.baseFareAUD)}</span>
          <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {selectedAirport.directToCMB ? "Direct" : "1 stop"}
          </span>
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
        <fieldset className="rounded-2xl border border-slate-200 p-3.5 md:col-span-6">
          <legend className="sr-only">Departure city</legend>
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-fly-orange" />
            Flying from
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {AUSTRALIAN_AIRPORTS.map((airport) => {
              const isSelected = selectedAirport.code === airport.code;
              return (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => handleAirportChange(airport)}
                  aria-pressed={isSelected}
                  title={`${airport.city} · ${airport.estFlightTime}`}
                  className={cn(
                    "rounded-xl py-2 text-center text-[13px] font-semibold transition-colors",
                    isSelected ? "bg-fly-navy text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {airport.code}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="rounded-2xl border border-slate-200 p-3.5 md:col-span-3">
          <span className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-fly-orange" />
            When
          </span>
          <select
            value={travelMonth}
            onChange={(e) => setTravelMonth(e.target.value)}
            className="w-full cursor-pointer rounded-lg bg-transparent py-1.5 text-sm font-semibold text-slate-900 focus:outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-slate-200 p-3.5 md:col-span-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users className="h-3.5 w-3.5 text-fly-orange" />
            Travellers
          </p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAdults((n) => Math.max(1, n - 1))}
              disabled={adults <= 1}
              aria-label="Fewer travellers"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm font-semibold tabular-nums text-slate-900">
              {adults} {adults === 1 ? "adult" : "adults"}
            </span>
            <button
              type="button"
              onClick={() => setAdults((n) => Math.min(10, n + 1))}
              disabled={adults >= 10}
              aria-label="More travellers"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-slate-500">
          {selectedAirport.city} → Colombo · {selectedAirport.estFlightTime}
        </p>
        <button type="button" onClick={handleAction} className="btn-primary btn-lg w-full sm:w-auto">
          {activeMode.cta}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
