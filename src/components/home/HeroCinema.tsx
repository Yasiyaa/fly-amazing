"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Video, Volume2, VolumeX } from "lucide-react";
import SmartBookingIsland from "./SmartBookingIsland";
import { AustralianAirport } from "@/data/australianAirports";

interface HeroCinemaProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

const CLIENT_HERO_VIDEOS = [
  {
    id: "beach-surf",
    name: "Golden Coastline & Waves",
    tag: "South Coast Waters",
    videoUrl: "/videos/vecteezy_aerial-view-of-sand-beach-and-water-surface-texture-foamy_7515199.mp4",
    poster: "/images/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash.jpg",
  },
  {
    id: "rainforest-canopy",
    name: "Lush Tropical Canopy",
    tag: "Ceylon Rainforest & Trails",
    videoUrl: "/videos/vecteezy_aerial-view-of-person-walking-on-bamboo-bridge-amidst-lush_78250928.mp4",
    poster: "/images/dylan-shaw-smUAKwMT8XA-unsplash.jpg",
  },
];

export default function HeroCinema({ onSelectDeparture, onOpenArchitect }: HeroCinemaProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = CLIENT_HERO_VIDEOS[activeVideoIndex];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 overflow-hidden bg-fly-navy-950 font-sans">
      {/* Background Media Layer: Pure Continuous Background Video (No Slideshow) */}
      <div className="absolute inset-0 z-0">
        <video
          key={currentVideo.videoUrl}
          ref={videoRef}
          src={currentVideo.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={currentVideo.poster}
          className="w-full h-full object-cover brightness-[0.72] scale-105 transition-all duration-700 ease-out"
        />
      </div>

      {/* Cinematic Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/30 to-black/50 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-fly-navy-950/20 to-fly-navy-950/70 z-10 pointer-events-none" />

      {/* Ambient Radial Color Pulses */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-fly-cyan/20 rounded-full blur-[120px] z-10 pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-fly-orange/20 rounded-full blur-[130px] z-10 pointer-events-none" />

      {/* Top Floating Video Controls */}
      <div className="absolute top-24 right-4 sm:right-8 z-30 flex items-center space-x-2">
        {/* Switch between user's two videos */}
        <div className="flex items-center p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg">
          {CLIENT_HERO_VIDEOS.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setActiveVideoIndex(idx)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                idx === activeVideoIndex
                  ? "bg-fly-orange text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {idx === 0 ? "🏖️ Coast" : "🌿 Canopy"}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white transition-all shadow-lg"
          title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-fly-cyan" />}
        </button>
      </div>

      {/* Hero Content: Bold, Minimal, Impactful */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-4 text-center text-white flex-1 flex flex-col justify-center items-center">
        {/* Brand Slogan Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-xl mb-4">
          <span className="w-2 h-2 rounded-full bg-fly-orange animate-ping" />
          <span>FLY CHEAPER &bull; FLY SMARTER</span>
        </div>

        {/* High-Impact Modern Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.08] max-w-4xl">
          AUSTRALIA TO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fly-orange via-amber-200 to-fly-cyan">
            SRI LANKA
          </span>
        </h1>

        {/* Minimal 1-Line Tagline */}
        <p className="mt-4 text-sm sm:text-lg text-slate-200 max-w-xl font-medium tracking-wide">
          Direct flights from Melbourne & Sydney bundled with boutique Ceylon stays, private chauffeurs, and bespoke tours.
        </p>

        {/* Minimal Visual Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-white">
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            ✈️ MEL &bull; SYD &bull; BNE &bull; PER &bull; ADL
          </span>
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            🏝️ Handpicked Ceylon Resorts
          </span>
          <span className="px-3 py-1 rounded-full bg-fly-orange/80 backdrop-blur-md border border-fly-orange text-white">
            ★ Best Price In AUD
          </span>
        </div>

        {/* Active Scene Ticker */}
        <div className="mt-5 inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs text-slate-300">
          <span className="text-fly-cyan font-bold uppercase tracking-wider">{currentVideo.tag}</span>
          <span className="text-white font-semibold">&bull; {currentVideo.name}</span>
        </div>
      </div>

      {/* Floating Smart Booking Island */}
      <div className="relative z-30 px-4 sm:px-8 mt-2">
        <SmartBookingIsland
          onSelectDeparture={onSelectDeparture}
          onOpenArchitect={onOpenArchitect}
        />
      </div>
    </section>
  );
}
