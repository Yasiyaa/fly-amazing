"use client";

import React, { useEffect, useRef, useState } from "react";
import PlannerIsland from "./PlannerIsland";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const SCENE_DURATION_MS = 7500;

/** Full-screen hero that crossfades through the client's background videos (set in admin). */
export default function HeroCinema({ videos }: { videos: SiteSettings["heroVideos"] }) {
  const [currentScene, setCurrentScene] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    // Posters only for reduced motion or Save-Data visitors.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setMotionOk(!reduce && !saveData);
  }, []);

  useEffect(() => {
    if (videos.length < 2 || !motionOk) return;
    const timer = setInterval(() => setCurrentScene((prev) => (prev + 1) % videos.length), SCENE_DURATION_MS);
    return () => clearInterval(timer);
  }, [videos.length, motionOk]);

  useEffect(() => {
    if (!motionOk) {
      videoRefs.current.forEach((v) => v?.pause());
      return;
    }
    videoRefs.current[currentScene]?.play().catch(() => undefined);
    // Start fetching the next clip a few seconds in, so only one video downloads at a time.
    const t = setTimeout(() => {
      const next = videoRefs.current[(currentScene + 1) % videos.length];
      if (next && next.preload !== "auto") next.preload = "auto";
    }, 3000);
    return () => clearTimeout(t);
  }, [currentScene, videos.length, motionOk]);

  const scene = videos[currentScene];

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-fly-navy-950 pt-[72px] text-white">
      {videos.map((item, idx) => (
        <video
          key={item.url}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          src={item.url}
          poster={item.poster}
          autoPlay={idx === 0 && motionOk}
          loop
          muted
          playsInline
          preload={idx === 0 ? "auto" : "none"}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            idx === currentScene ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fly-navy-950/60 via-fly-navy-950/35 to-fly-navy-950" />

      <div className="container-page flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-20">
        <p className="eyebrow-light">
          <span className="h-1.5 w-1.5 rounded-full bg-fly-orange" />
          Private tours · Colombo-based team
        </p>

        <h1 className="mt-5 max-w-4xl text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          Sri Lanka,
          <span className="block text-fly-orange-300">your way.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Tailor-made tours with your own chauffeur-guide, handpicked hotels and clear prices, designed by people who live here.
        </p>

        {scene && (
          <div className="mt-8 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fly-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-fly-cyan-300" />
            </span>
            <p className="text-xs font-medium text-slate-200" aria-live="polite">
              {scene.label}
            </p>
          </div>
        )}
      </div>

      <div className="container-page pb-10 sm:pb-14">
        <PlannerIsland />
      </div>
    </section>
  );
}
