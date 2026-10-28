"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import SmartBookingIsland from "./SmartBookingIsland";
import { AustralianAirport } from "@/data/australianAirports";
import { cn } from "@/lib/utils";

interface HeroCinemaProps {
  onSelectDeparture?: (airport: AustralianAirport) => void;
  onOpenArchitect?: () => void;
}

// Client-supplied 4K footage: one continuous background video (no auto-rotating slideshow).
// Visitors can switch between the two clips.
const CLIENT_HERO_VIDEOS = [
  {
    videoUrl: "/videos/vecteezy_aerial-view-of-sand-beach-and-water-surface-texture-foamy_7515199.mp4",
    poster: "https://images.unsplash.com/photo-1734279135136-dcaca9fdffaf?q=80&w=2000&auto=format&fit=crop",
    label: "Coast",
    location: "Golden coastline & Indian Ocean surf",
    tag: "Southern coast",
  },
  {
    videoUrl: "/videos/vecteezy_aerial-view-of-person-walking-on-bamboo-bridge-amidst-lush_78250928.mp4",
    poster: "/images/dylan-shaw-smUAKwMT8XA-unsplash.jpg",
    label: "Rainforest",
    location: "Rainforest canopy & jungle trails",
    tag: "Hill country",
  },
];

export default function HeroCinema({ onSelectDeparture, onOpenArchitect }: HeroCinemaProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setIsPlaying(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => undefined);
    else video.pause();
  }, [isPlaying, currentVideo]);

  const reel = CLIENT_HERO_VIDEOS[currentVideo];

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-fly-navy-950 pt-[72px] text-white">
      <video
        key={reel.videoUrl}
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.poster}
        autoPlay={isPlaying}
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
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

        <div className="mt-8 flex items-center gap-4">
          <div
            className="flex items-center rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md"
            role="tablist"
            aria-label="Background video"
          >
            {CLIENT_HERO_VIDEOS.map((item, idx) => (
              <button
                key={item.videoUrl}
                type="button"
                role="tab"
                aria-selected={idx === currentVideo}
                onClick={() => setCurrentVideo(idx)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  idx === currentVideo ? "bg-white text-fly-navy-900" : "text-white/80 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-300" aria-live="polite">
          <span className="text-fly-cyan-200">{reel.tag}</span> · {reel.location}
        </p>
      </div>

      <div className="container-page pb-10 sm:pb-14">
        <SmartBookingIsland onSelectDeparture={onSelectDeparture} onOpenArchitect={onOpenArchitect} />
      </div>
    </section>
  );
}
