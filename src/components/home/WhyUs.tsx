"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Ban, Compass, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: HeartHandshake,
    tag: "Private",
    title: "Your own chauffeur-guide",
    description: "A licensed, English-speaking driver-guide and a private air-conditioned vehicle from arrival to departure.",
    gradient: "from-fly-orange to-fly-orange-400",
    glowColor: "group-hover:shadow-fly-orange/30",
  },
  {
    icon: Ban,
    tag: "Our pledge",
    title: "No commission stops",
    description: "No detours to gem shops or spice stalls for commission. Your days are spent on what you came to see.",
    gradient: "from-fly-cyan to-fly-cyan-400",
    glowColor: "group-hover:shadow-fly-cyan/30",
  },
  {
    icon: Compass,
    tag: "Tailor-made",
    title: "Built around you",
    description: "Start from a signature tour or design your own route, pace and hotels. Our AI planner drafts it in minutes.",
    gradient: "from-fly-orange to-rose-500",
    glowColor: "group-hover:shadow-fly-orange/30",
  },
  {
    icon: ShieldCheck,
    tag: "Clear pricing",
    title: "Prices you can see",
    description: "Published USD prices on every tour, no payment until you approve your confirmation, and a Colombo team on call 24/7.",
    gradient: "from-fly-cyan to-blue-500",
    glowColor: "group-hover:shadow-fly-cyan/30",
  },
];

export default function WhyUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Background parallax movement: moves slightly slower than scroll for 3D depth
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-fly-navy-950 text-white font-sans"
    >
      {/* 1. Parallax High-Resolution Background Image */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute -top-[15%] left-0 right-0 -bottom-[15%] z-0 pointer-events-none will-change-transform"
      >
        <Image
          src="/images/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash.jpg"
          alt=""
          fill
          priority={false}
          className="object-cover object-center brightness-[0.45] contrast-[1.05]"
        />
      </motion.div>

      {/* 2. Atmospheric Gradient Overlays & Deep Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-fly-navy-950 via-fly-navy-950/75 to-fly-navy-950 z-10 pointer-events-none" />
      
      {/* 3. Ambient Radial Glow Pulses */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-fly-cyan/15 rounded-full blur-[140px] z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-fly-orange/15 rounded-full blur-[140px] z-10 pointer-events-none" />

      {/* 4. Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em] text-fly-cyan mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
            <span>Why Amazing World Travel</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white leading-tight">
            Sri Lanka, from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fly-orange via-fly-orange-200 to-fly-cyan">
              people who live here
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Our Colombo team plans every route, books every hotel and stays on call while you travel, so the only thing you need to decide is what to see first.
          </p>
        </div>

        {/* 5. Frosted Glassmorphic Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, tag, title, description, gradient, glowColor }) => (
            <div
              key={title}
              className={`group relative rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2.5 backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-fly-cyan/50 shadow-xl ${glowColor} hover:shadow-2xl flex flex-col justify-between`}
            >
              {/* Subtle Card Inner Ambient Lighting on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-extrabold uppercase tracking-wider text-slate-200">
                    {tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-fly-cyan transition-colors duration-300 mb-2.5">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-300 font-normal">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
