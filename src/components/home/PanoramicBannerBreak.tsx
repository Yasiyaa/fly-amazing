import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

interface PanoramicBannerBreakProps {
  image: string;
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
  badge,
  title,
  subtitle,
  quote,
  actionText = "Design Your Tailored Itinerary",
  onAction,
}: PanoramicBannerBreakProps) {
  return (
    <section className="relative h-[420px] sm:h-[480px] w-full overflow-hidden flex items-center justify-center my-6 font-sans">
      {/* Background High-Res Image with subtle parallax feel */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover object-center brightness-[0.70] transform scale-105 hover:scale-100 transition-transform duration-1000"
      />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-fly-navy-950/85 via-fly-navy-900/60 to-black/60"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-fly-navy-950/80"></div>

      {/* Brand Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fly-orange via-fly-cyan to-fly-navy"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fly-navy via-fly-cyan to-fly-orange"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center text-white">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-fly-cyan-200 uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
          <span>{badge}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal font-serif text-white tracking-tight leading-tight">
          {title}
        </h2>

        <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-200 max-w-xl mx-auto leading-relaxed font-light">
          {subtitle}
        </p>

        {quote && (
          <p className="mt-3.5 text-xs sm:text-sm italic text-amber-100 font-serif max-w-lg mx-auto">
            &ldquo;{quote}&rdquo;
          </p>
        )}

        {actionText && (
          <div className="mt-6 flex justify-center">
            <a
              href="#tour-architect"
              onClick={onAction}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide text-white bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange shadow-lg shadow-fly-orange/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
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
