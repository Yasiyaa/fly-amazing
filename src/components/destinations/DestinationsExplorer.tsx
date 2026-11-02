"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Lightbulb, Moon } from "lucide-react";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  destinations: Destination[];
  toursByDestination: Record<string, { slug: string; title: string }[]>;
}

export default function DestinationsExplorer({ destinations, toursByDestination }: Props) {
  const [region, setRegion] = useState("All");
  const regions = ["All", ...Array.from(new Set(destinations.map((d) => d.region)))];
  const filtered = region === "All" ? destinations : destinations.filter((d) => d.region === region);

  return (
    <>
      <section className="container-page relative z-10 -mt-12">
        <div className="card flex flex-col gap-4 p-4 shadow-lg shadow-fly-navy/5 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                aria-pressed={region === r}
                className={cn("filter-pill shrink-0", region === r ? "filter-pill-active" : "filter-pill-idle")}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="shrink-0 text-sm text-slate-500" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "destination" : "destinations"}
          </p>
        </div>
      </section>

      <section className="container-page py-12 pb-24 sm:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {filtered.map((dest) => {
            const tours = toursByDestination[dest.id] ?? [];
            return (
              <article id={dest.id} key={dest.id} className="card flex scroll-mt-28 flex-col overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <Image src={dest.bannerImage} alt={dest.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  <div className="scrim-bottom absolute inset-0" />
                  <span className="chip-glass absolute left-4 top-4">{dest.region}</span>
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <h2 className="text-2xl font-bold sm:text-3xl">{dest.name}</h2>
                    <p className="mt-1 text-sm text-slate-200">{dest.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[15px] leading-relaxed text-slate-600">{dest.description}</p>

                  <p className="mt-6 text-[13px] font-medium text-slate-700">Things to do</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {dest.highlights.map((hl) => (
                      <span key={hl} className="chip">
                        {hl}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3 rounded-xl bg-fly-orange-50/70 p-4 text-sm text-slate-600">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-fly-orange" />
                    <p>
                      <span className="font-semibold text-slate-900">Local tip: </span>
                      {dest.travelTips}
                    </p>
                  </div>

                  {tours.length > 0 && (
                    <div className="mt-6">
                      <p className="text-[13px] font-medium text-slate-700">Tours that visit {dest.name.split(" ")[0]}</p>
                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                        {tours.slice(0, 4).map((t) => (
                          <li key={t.slug}>
                            <Link href={`/tours/${t.slug}`} className="font-medium text-fly-cyan-700 hover:text-fly-navy">
                              {t.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="h-6 shrink-0" />
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Moon className="h-4 w-4 text-fly-cyan-700" />
                      Stay {dest.recommendedNights} {dest.recommendedNights === 1 ? "night" : "nights"}
                    </span>
                    <Link href={`/tour-architect?add=${dest.id}`} className="btn-navy btn-sm">
                      <Plus className="h-4 w-4" />
                      Add to my tour
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
