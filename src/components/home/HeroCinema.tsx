"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Compass, ShieldCheck, Star } from "lucide-react";
import SmartBookingIsland from "./SmartBookingIsland";
import { AustralianAirport } from "@/data/australianAirports";

interface HeroCinemaProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=2000&auto=format&fit=crop",
    title: "The Citadel in the Clouds",
    location: "Sigiriya Rock Fortress",
    caption: "Ascend 5th-century sky palaces towering above emerald rainforests.",
  },
  {
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop",
    title: "The Legendary Blue Mountain Train",
    location: "Nine Arch Bridge, Ella",
    caption: "Glide through misty tea hills and colonial viaducts suspended in clouds.",
  },
  {
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000&auto=format&fit=crop",
    title: "Realm of the Elusive Ceylon Leopard",
    location: "Yala National Park",
    caption: "Track wild elephants and leopards on dawn 4x4 private safaris.",
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
    title: "Golden Beaches & Blue Whales",
    location: "Mirissa & Weligama Bay",
    caption: "Sail alongside ocean giants and unwind under swaying palms.",
  },
];

export default function HeroCinema({ onSelectDeparture, onOpenArchitect }: HeroCinemaProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 overflow-hidden bg-fly-navy-950 font-sans">
      {/* Background Cinematic Slide Carousels */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.location}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transition: "opacity 1.2s ease-in-out, transform 8s ease-out" }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center brightness-[0.72]"
          />
        </div>
      ))}

      {/* Multi-layered Vignette & Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-fly-navy-950 via-fly-navy-950/40 to-black/40 z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-fly-navy-950/60 z-10 pointer-events-none"></div>

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-fly-cyan/20 rounded-full blur-[100px] z-10 pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-fly-orange/20 rounded-full blur-[110px] z-10 pointer-events-none animate-pulse-slow"></div>

      {/* Hero Content Center */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 pt-6 sm:pt-12 pb-4 text-center text-white flex-1 flex flex-col justify-center items-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-4 shadow-md text-fly-cyan-100">
          <Sparkles className="w-3.5 h-3.5 text-fly-orange animate-spin" style={{ animationDuration: "12s" }} />
          <span>Bespoke Australian Concierge &bull; Handcrafted Ceylon Expeditions</span>
          <span className="hidden sm:inline-block bg-fly-orange text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
            All-Inclusive
          </span>
        </div>

        {/* Main Editorial Headline - Scaled into balanced proportions */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight leading-[1.18] max-w-4xl">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-fly-cyan-300 block mb-2">
            Fly Cheaper &bull; Fly Smarter
          </span>
          Experience the <span className="italic font-normal text-white">Untamed Soul</span> of{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-fly-orange via-amber-200 to-white font-normal">
            Sri Lanka
          </span>.
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-xs sm:text-base text-slate-200 max-w-2xl font-light leading-relaxed">
          Curated flights from <strong>Melbourne, Sydney, Brisbane, Perth & Adelaide</strong> bundled with handpicked boutique tea estates, ocean villas, private chauffeured travel, and tailored itineraries.
        </p>

        {/* Location Ticker Pill */}
        <div className="mt-4 inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-fly-orange animate-ping"></span>
          <span className="text-slate-400">Showcasing:</span>
          <strong className="text-white font-serif italic text-sm">{HERO_SLIDES[currentSlide].location}</strong>
          <span className="hidden sm:inline-block text-slate-400 font-light">— {HERO_SLIDES[currentSlide].caption}</span>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center space-x-1.5 mt-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-6 bg-fly-orange" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
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
