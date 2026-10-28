"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface CinemaCard {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  videoUrl?: string;
  /** Cards without a photo show the video's first frame instead. */
  imageUrl?: string;
}

const CINEMA_CARDS: CinemaCard[] = [
  {
    id: "sigiriya",
    title: "Sigiriya Lion Rock",
    subtitle: "5th-century sky palace",
    tag: "Cultural Triangle",
    imageUrl: "/images/dylan-shaw-smUAKwMT8XA-unsplash.jpg",
  },
  {
    id: "ella",
    title: "Ella & the tea country",
    subtitle: "Nine Arch Bridge and misty estates",
    tag: "Central Highlands",
    videoUrl: "https://assets.mixkit.co/videos/11193/11193-720.mp4",
    imageUrl: "/images/yves-alarie-3R50kTNBKiE-unsplash.jpg",
  },
  {
    id: "yala",
    title: "Yala & Minneriya",
    subtitle: "Leopards and wild elephant herds",
    tag: "Wildlife",
    videoUrl: "https://assets.mixkit.co/videos/11059/11059-720.mp4",
    imageUrl: "/images/tom-paisley-v2zEiziFb44-unsplash.jpg",
  },
  {
    id: "nuwara-eliya",
    title: "Emerald canopy trails",
    subtitle: "Rainforest walks and bamboo bridges",
    tag: "Highland rainforest",
    videoUrl: "/videos/vecteezy_aerial-view-of-person-walking-on-bamboo-bridge-amidst-lush_78250928.mp4",
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
          description="Ancient fortresses, mountain railways, wild safaris and rainforest trails, all within a few hours' drive."
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
  const hasImage = Boolean(card.imageUrl);

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
      {hasImage && (
        <Image
          src={card.imageUrl!}
          alt={card.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={hasVideo ? "object-cover transition-opacity duration-700 group-hover:opacity-0" : "object-cover transition-transform duration-700 group-hover:scale-[1.04]"}
        />
      )}
      {hasVideo && (
        <video
          ref={videoRef}
          src={hasImage ? card.videoUrl : `${card.videoUrl}#t=1`}
          muted
          loop
          playsInline
          preload={hasImage ? "none" : "metadata"}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            hasImage && "opacity-0 group-hover:opacity-100"
          )}
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
