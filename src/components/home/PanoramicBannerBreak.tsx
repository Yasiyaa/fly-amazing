import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

interface PanoramicBannerBreakProps {
  image: string;
  videoUrl?: string;
  badge: string;
  title: string;
  subtitle: string;
  quote?: string;
  actionText?: string;
  onAction?: () => void;
  reverse?: boolean;
}

export default function PanoramicBannerBreak({
  image,
  videoUrl,
  badge,
  title,
  subtitle,
  quote,
  actionText = "Design Your Tailored Itinerary",
  onAction,
}: PanoramicBannerBreakProps) {
  return (
    <section className="relative h-[400px] sm:h-[460px] w-full overflow-hidden flex items-center justify-center my-8 font-sans">
      {/* Background Media: Video or High-Res Image */}
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={image}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.62]"
        />
      ) : (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center brightness-[0.65] transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
      )}

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-fly-navy-950/85 via-fly-navy-900/50 to-black/60" />

      {/* Brand Accent Top/Bottom Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fly-orange via-fly-cyan to-fly-navy" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fly-navy via-fly-cyan to-fly-orange" />

      {/* Content Container (Minimal & Modern) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center text-white">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-fly-cyan uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
          <span>{badge}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
          {title}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-lg mx-auto font-normal">
          {subtitle}
        </p>

        {actionText && (
          <div className="mt-6 flex justify-center">
            <a
              href="#tour-architect"
              onClick={onAction}
              className="px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold tracking-wide text-white bg-gradient-to-r from-fly-orange to-amber-600 hover:from-amber-600 hover:to-fly-orange shadow-lg shadow-fly-orange/30 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
