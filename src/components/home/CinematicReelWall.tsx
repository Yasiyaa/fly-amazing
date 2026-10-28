"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface CinemaCard {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  videoUrl?: string;
  imageUrl: string;
}

const CINEMA_CARDS: CinemaCard[] = [
  {
    id: "sigiriya",
    title: "Sigiriya Lion Rock",
    subtitle: "5th-century sky palace",
    tag: "Cultural Triangle",
    imageUrl: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ella",
    title: "Ella & the tea country",
    subtitle: "Nine Arch Bridge and misty estates",
    tag: "Central Highlands",
    videoUrl: "https://assets.mixkit.co/videos/11193/11193-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "yala",
    title: "Yala & Minneriya",
    subtitle: "Leopards and wild elephant herds",
    tag: "Wildlife",
    videoUrl: "https://assets.mixkit.co/videos/11059/11059-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1621847473222-d85c022cbf07?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "mirissa",
    title: "Mirissa Stilt Fishermen",
    subtitle: "Surf breaks and blue whales",
    tag: "Southern Coast",
    videoUrl: "https://assets.mixkit.co/videos/11376/11376-720.mp4",
    imageUrl: "https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function CinematicReelWall() {
  return (
    <section className="section relative overflow-hidden bg-fly-navy-950 text-white">
      <div className="container-page">
        <SectionHeader
          tone="dark"
          eyebrow="Sri Lanka in motion"
          title="Moments worth the long-haul"
          description="Ancient fortresses, mountain railways, stilt fishermen and wild safaris, all within a few hours' drive."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CINEMA_CARDS.map((card) => (
            <ReelCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReelCard({ card }: { card: CinemaCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideo = Boolean(card.videoUrl);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => undefined);
  };
  const stop = () => videoRef.current?.pause();

  return (
    <Link
      href={`/destinations#${card.id}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10"
    >
      <Image
        src={card.imageUrl}
        alt={card.title}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className={hasVideo ? "object-cover transition-opacity duration-700 group-hover:opacity-0" : "object-cover transition-transform duration-700 group-hover:scale-[1.04]"}
      />
      {hasVideo && (
        <video
          ref={videoRef}
          src={card.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

      <span className="chip-glass absolute left-4 top-4">{card.tag}</span>

      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[13px] text-slate-300">{card.subtitle}</p>
          <h3 className="mt-1 text-xl font-bold leading-tight text-white">{card.title}</h3>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors group-hover:bg-fly-orange">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
