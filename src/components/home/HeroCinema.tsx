"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Video, Image as ImageIcon, Volume2, VolumeX, ChevronRight, Play } from "lucide-react";
import SmartBookingIsland from "./SmartBookingIsland";
import { AustralianAirport } from "@/data/australianAirports";

interface HeroCinemaProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

const CINEMATIC_REELS = [
  {
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/42488/42488-720.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
    title: "Tropical Ocean Sanctuaries",
    location: "Bentota & Mirissa Bay",
    tag: "South Coast Waters",
  },
  {
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/1496/1496-720.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=2000&auto=format&fit=crop",
    title: "Ancient Rock in the Sky",
    location: "Sigiriya Fortress Citadel",
    tag: "Cultural Triangle",
  },
  {
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/42283/42283-720.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop",
    title: "Misty Emerald Highlands",
    location: "Nine Arch Bridge, Ella",
    tag: "Tea Country",
  },
  {
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/42168/42168-720.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000&auto=format&fit=crop",
    title: "Wild Leopards & Coast",
    location: "Yala National Park",
    tag: "Untamed Safari",
  },
];

export default function HeroCinema({ onSelectDeparture, onOpenArchitect }: HeroCinemaProps) {
  const [currentReel, setCurrentReel] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReel((prev) => (prev + 1) % CINEMATIC_REELS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const reel = CINEMATIC_REELS[currentReel];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 overflow-hidden bg-fly-navy-950 font-sans">
      {/* Background Media Layer: Video & Photography */}
      <div className="absolute inset-0 z-0">
        {isVideoMode ? (
          <video
            key={reel.videoUrl}
            ref={videoRef}
            src={reel.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={reel.fallbackImage}
            className="w-full h-full object-cover brightness-[0.68] scale-105 transition-all duration-1000 ease-out"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={reel.fallbackImage}
              alt={reel.title}
              fill
              priority
              className="object-cover object-center brightness-[0.70] transition-transform duration-10000 ease-out scale-105"
            />
          </div>
        )}
      </div>

      {/* Cinematic Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/30 to-black/50 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-fly-navy-950/20 to-fly-navy-950/70 z-10 pointer-events-none" />

      {/* Ambient Radial Color Pulses */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-fly-cyan/20 rounded-full blur-[120px] z-10 pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-fly-orange/20 rounded-full blur-[130px] z-10 pointer-events-none" />

      {/* Top Floating Controls: Video/Photo Switcher */}
      <div className="absolute top-24 right-4 sm:right-8 z-30 flex items-center space-x-2">
        <button
          onClick={() => setIsVideoMode(!isVideoMode)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white transition-all shadow-lg hover:scale-105"
          title={isVideoMode ? "Switch to High-Res Photography" : "Switch to 4K Video Reels"}
        >
          {isVideoMode ? (
            <>
              <Video className="w-3.5 h-3.5 text-fly-cyan" />
              <span>4K Drone Reel</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5 text-fly-orange" />
              <span>Photo Mode</span>
            </>
          )}
        </button>

        {isVideoMode && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all shadow-lg"
            title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-fly-cyan" />}
          </button>
        )}
      </div>

      {/* Hero Content: Ultra-Minimal & High-Impact */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-4 text-center text-white flex-1 flex flex-col justify-center items-center">
        {/* Brand Slogan Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-xl mb-4">
          <span className="w-2 h-2 rounded-full bg-fly-orange animate-ping" />
          <span>FLY CHEAPER &bull; FLY SMARTER</span>
        </div>

        {/* High-Impact Modern Headline (No newspaper serif, pure Outfit modern sans) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.08] max-w-4xl">
          AUSTRALIA TO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fly-orange via-amber-200 to-fly-cyan">
            SRI LANKA
          </span>
        </h1>

        {/* Minimal 1-Line Tagline */}
        <p className="mt-4 text-sm sm:text-lg text-slate-200 max-w-xl font-medium tracking-wide">
          Bespoke flights from Melbourne & Sydney bundled with luxury villas, private drivers, and custom tours.
        </p>

        {/* Minimal Visual Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-white">
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            ✈️ MEL &bull; SYD &bull; BNE &bull; PER &bull; ADL
          </span>
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            🏝️ 5★ Handpicked Resorts
          </span>
          <span className="px-3 py-1 rounded-full bg-fly-orange/80 backdrop-blur-md border border-fly-orange text-white">
            ★ Best Price In AUD
          </span>
        </div>

        {/* Location Ticker Pill */}
        <div className="mt-5 inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs text-slate-300">
          <span className="text-fly-cyan font-bold uppercase tracking-wider">{reel.tag}</span>
          <span className="text-white font-semibold">&bull; {reel.location}</span>
        </div>

        {/* Interactive Reel Indicator Switches */}
        <div className="flex items-center space-x-2 mt-4">
          {CINEMATIC_REELS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReel(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentReel ? "w-8 bg-fly-orange" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={item.location}
            />
          ))}
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
