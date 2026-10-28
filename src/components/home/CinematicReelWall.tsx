"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, ArrowRight, Eye, Film } from "lucide-react";

interface CinemaCard {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  videoUrl: string;
  imageUrl: string;
  link: string;
}

const CINEMA_CARDS: CinemaCard[] = [
  {
    id: "sigiriya",
    title: "Sigiriya Rock Citadel",
    subtitle: "5th-Century Sky Palace",
    tag: "Aerial Drone Reel",
    videoUrl: "https://assets.mixkit.co/videos/1496/1496-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1200&auto=format&fit=crop",
    link: "/destinations#sigiriya",
  },
  {
    id: "ella",
    title: "Ella Nine Arch Bridge",
    subtitle: "Misty Mountain Railway",
    tag: "Highland Expedition",
    videoUrl: "https://assets.mixkit.co/videos/42283/42283-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
    link: "/destinations#ella",
  },
  {
    id: "mirissa",
    title: "Mirissa & Weligama",
    subtitle: "Turquoise Waves & Whales",
    tag: "South Coast Surf",
    videoUrl: "https://assets.mixkit.co/videos/5016/5016-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    link: "/destinations#mirissa",
  },
  {
    id: "yala",
    title: "Yala National Park",
    subtitle: "Wild Ceylon Safari",
    tag: "Untamed Wildlife",
    videoUrl: "https://assets.mixkit.co/videos/42168/42168-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1200&auto=format&fit=crop",
    link: "/destinations#yala",
  },
];

export default function CinematicReelWall() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="py-14 sm:py-20 bg-slate-950 text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fly-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fly-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-[0.2em] text-fly-cyan mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>4K Visual Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white">
              EXPERIENCE SRI LANKA IN MOTION
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-slate-300 text-sm sm:text-base max-w-sm">
            Cinematic aerial footage of Sri Lanka&apos;s wonders waiting for your arrival.
          </p>
        </div>

        {/* 4-Column Video / Image Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CINEMA_CARDS.map((card) => {
            const isHovered = activeCard === card.id;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
                className="group relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-white/10 bg-slate-900"
              >
                {/* Media Layer: Image by default, Video on Hover/Active */}
                <div className="absolute inset-0">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className={`object-cover object-center transition-all duration-700 ${
                      isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
                    }`}
                  />
                  <video
                    src={card.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                    }`}
                  />
                </div>

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20 group-hover:from-black/90 transition-all duration-300" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-wider uppercase text-fly-cyan">
                    {card.tag}
                  </span>
                </div>

                {/* Play Indicator Icon */}
                <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-fly-orange transition-colors duration-300">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>

                {/* Bottom Content (Ultra-Minimal) */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end">
                  <span className="text-xs text-fly-orange font-bold uppercase tracking-wider mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-fly-cyan transition-colors duration-300">
                    {card.title}
                  </h3>

                  {/* One-Click Action Link */}
                  <Link
                    href={card.link}
                    className="mt-4 inline-flex items-center justify-between w-full px-4 py-2 rounded-xl bg-white/10 hover:bg-fly-orange border border-white/20 text-xs font-bold text-white transition-all duration-300 group-hover:border-fly-orange"
                  >
                    <span>Explore Destination</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
