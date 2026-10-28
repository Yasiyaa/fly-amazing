"use client";

import React, { useEffect, useRef, useState } from "react";
import SmartBookingIsland from "./SmartBookingIsland";
import { AustralianAirport } from "@/data/australianAirports";
import { cn } from "@/lib/utils";

interface HeroCinemaProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

// Auto-cycling cinematic Sri Lanka scenes (continuous video playback, no manual buttons)
const HERO_SCENES = [
  {
    videoUrl: "/videos/coconut-palms.mp4",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
    tag: "Tropical Coast",
    location: "Coconut palm groves & gentle island breeze",
  },
  {
    videoUrl: "/videos/vecteezy_aerial-view-of-sand-beach-and-water-surface-texture-foamy_7515199.mp4",
    poster: "https://images.unsplash.com/photo-1734279135136-dcaca9fdffaf?q=80&w=2000&auto=format&fit=crop",
    tag: "Mirissa & Bentota",
    location: "Golden sandy shores & turquoise Indian Ocean surf",
  },
  {
    videoUrl: "/videos/wildlife-elephant.mp4",
    poster: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop",
    tag: "Yala & Minneriya",
    location: "Wild Asian elephant gathering & safari wetlands",
  },
  {
    videoUrl: "/videos/vecteezy_aerial-view-of-person-walking-on-bamboo-bridge-amidst-lush_78250928.mp4",
    poster: "/images/dylan-shaw-smUAKwMT8XA-unsplash.jpg",
    tag: "Central Rainforest",
    location: "Lush canopy & bamboo suspension bridge",
  },
];

const SCENE_DURATION_MS = 7500; // 7.5 seconds per scene

export default function HeroCinema({ onSelectDeparture, onOpenArchitect }: HeroCinemaProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Automatically cycle through scenes
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % HERO_SCENES.length);
    }, SCENE_DURATION_MS);

    return () => clearInterval(timer);
  }, []);

  // Play the current scene's video and pause others once faded
  useEffect(() => {
    const activeVideo = videoRefs.current[currentScene];
    if (activeVideo) {
      activeVideo.play().catch(() => undefined);
    }

    // Preload next video
    const nextIdx = (currentScene + 1) % HERO_SCENES.length;
    const nextVideo = videoRefs.current[nextIdx];
    if (nextVideo && nextVideo.preload !== "auto") {
      nextVideo.preload = "auto";
    }
  }, [currentScene]);

  const scene = HERO_SCENES[currentScene];

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-fly-navy-950 pt-[72px] text-white">
      {/* Seamless crossfading background video layers */}
      {HERO_SCENES.map((item, idx) => (
        <video
          key={item.videoUrl}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          src={item.videoUrl}
          poster={item.poster}
          autoPlay={idx === 0}
          loop
          muted
          playsInline
          preload={idx <= 1 ? "auto" : "metadata"}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            idx === currentScene ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        />
      ))}

      {/* Atmospheric depth overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fly-navy-950/60 via-fly-navy-950/35 to-fly-navy-950" />

      <div className="container-page flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-20">
        <p className="eyebrow-light">
          <span className="h-1.5 w-1.5 rounded-full bg-fly-orange" />
          Fly cheaper · Fly smarter
        </p>

        <h1 className="mt-5 max-w-4xl text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          Australia to Sri Lanka,
          <span className="block text-fly-orange-300">beautifully planned.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Direct flights from Melbourne and Sydney, boutique stays, and a private chauffeur for every journey.
        </p>

        {/* Ambient location indicator - smooth auto-updating badge without manual toggle buttons */}
        <div className="mt-8 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fly-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-fly-cyan-300" />
          </span>
          <p className="text-xs font-medium text-slate-200 transition-all duration-500" aria-live="polite">
            <span className="font-semibold text-fly-cyan-200">{scene.tag}</span>
            <span className="mx-1.5 text-white/30">·</span>
            <span>{scene.location}</span>
          </p>
        </div>
      </div>

      <div className="container-page pb-10 sm:pb-14">
        <SmartBookingIsland onSelectDeparture={onSelectDeparture} onOpenArchitect={onOpenArchitect} />
      </div>
    </section>
  );
}
