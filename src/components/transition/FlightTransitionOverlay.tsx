"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlightTransitionOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Flight duration ~1.8s, then slide the orange curtain up
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="flight-curtain"
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-[#E66017] via-[#F26E20] to-[#CF530F] text-white overflow-hidden pointer-events-auto select-none"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/10 rounded-full blur-[140px] pointer-events-none"></div>

          {/* Gentle Animated Drifting Background Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Cloud 1 */}
            <motion.div
              initial={{ x: "105vw", y: "22vh" }}
              animate={{ x: "-35vw" }}
              transition={{ duration: 2.2, ease: "linear" }}
              className="absolute w-72 h-24 bg-white/12 rounded-full blur-xl"
            />
            {/* Cloud 2 */}
            <motion.div
              initial={{ x: "105vw", y: "58vh" }}
              animate={{ x: "-45vw" }}
              transition={{ duration: 2.4, delay: 0.15, ease: "linear" }}
              className="absolute w-96 h-32 bg-white/10 rounded-full blur-2xl"
            />
          </div>

          {/* Airplane & Curved Flight Path SVG Canvas */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Glowing Dashed Vapor Flight Trail */}
              <motion.path
                d="M -50,520 C 300,480 600,320 1050,120"
                stroke="rgba(255, 255, 255, 0.55)"
                strokeWidth="4"
                strokeDasharray="14 14"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />

              {/* Cyan Vapor Accent Trail */}
              <motion.path
                d="M -50,520 C 300,480 600,320 1050,120"
                stroke="rgba(1, 164, 169, 0.75)"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </svg>

            {/* Airplane Element soaring smoothly along the curved trajectory */}
            {/* Note: The airplane SVG base is oriented with nose pointing straight UP (0 deg).
                The rotation angles [81, 74, 69, 67, 65] match the exact tangent of the flight path,
                ensuring the nose ALWAYS points directly forward into the direction of motion! */}
            <motion.div
              initial={{
                x: "-8vw",
                y: "88vh",
                rotate: 81,
                scale: 0.75,
                opacity: 0,
              }}
              animate={{
                x: ["-5vw", "16vw", "36vw", "57vw", "80vw", "106vw"],
                y: ["86vh", "80vh", "70vh", "56vh", "39vh", "18vh"],
                rotate: [81, 74, 69, 67, 66, 65],
                scale: [0.8, 0.92, 1.05, 1.15, 1.22, 1.28],
                opacity: [0, 1, 1, 1, 1, 1],
              }}
              transition={{
                duration: 1.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 text-white filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] origin-center"
            >
              {/* Detailed Commercial Passenger Jetliner SVG */}
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Jet Fuselage Body (Aerodynamic nose at (32, 2) pointing UP) */}
                <path
                  d="M32 2C30 4 28.5 9 28.5 16L28.5 48C28.5 54 30.5 59 32 62C33.5 59 35.5 54 35.5 48L35.5 16C35.5 9 34 4 32 2Z"
                  fill="#FFFFFF"
                />

                {/* Swept Main Wings */}
                <path
                  d="M28.5 24L5 40L5 44L28.5 35Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M35.5 24L59 40L59 44L35.5 35Z"
                  fill="#FFFFFF"
                />

                {/* Teal Wingtips / Sharklets */}
                <path
                  d="M5 38L5 44L8 42Z"
                  fill="#01A4A9"
                />
                <path
                  d="M59 38L59 44L56 42Z"
                  fill="#01A4A9"
                />

                {/* Under-Wing Jet Engine Nacelles */}
                <rect x="18" y="29" width="3.5" height="9" rx="1.75" fill="#E2E8F0" />
                <rect x="42.5" y="29" width="3.5" height="9" rx="1.75" fill="#E2E8F0" />
                {/* Engine Intakes (Dark Blue) */}
                <ellipse cx="19.75" cy="29.5" rx="1.5" ry="0.75" fill="#033F7E" />
                <ellipse cx="44.25" cy="29.5" rx="1.5" ry="0.75" fill="#033F7E" />

                {/* Horizontal Tail Stabilizers */}
                <path
                  d="M29 53L16 60L16 62.5L29 57Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M35 53L48 60L48 62.5L35 57Z"
                  fill="#FFFFFF"
                />

                {/* Tail Fin Vertical Stabilizer with Fly Amazing Navy & Orange Livery */}
                <path
                  d="M31 46L33 46L33 61L31 61Z"
                  fill="#033F7E"
                />
                <path
                  d="M31.5 54L32.5 54L32.5 60L31.5 60Z"
                  fill="#E66017"
                />

                {/* Cockpit Windshield Band (Navy pilot sunglasses style) */}
                <path
                  d="M30 11C30.8 9.5 33.2 9.5 34 11L34.5 14L29.5 14Z"
                  fill="#033F7E"
                />

                {/* Passenger Window Belt Accent (Subtle Teal Line) */}
                <line x1="30" y1="18" x2="30" y2="44" stroke="#01A4A9" strokeWidth="0.8" strokeDasharray="1 1.5" />
                <line x1="34" y1="18" x2="34" y2="44" stroke="#01A4A9" strokeWidth="0.8" strokeDasharray="1 1.5" />
              </svg>
            </motion.div>
          </div>

          {/* Center Brand Pulse & Progress */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-2.5"
            >
              {/* Slogan Pill */}
              <div className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white shadow-lg">
                <span>fly cheaper &bull; fly smarter</span>
              </div>

              <div className="text-xl sm:text-3xl font-display font-extrabold tracking-tight text-white drop-shadow-md">
                Flying You to Sri Lanka...
              </div>

              {/* Progress Indicator Bar */}
              <div className="w-56 h-1.5 bg-white/25 rounded-full overflow-hidden mx-auto mt-4 backdrop-blur-sm">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.7, ease: "easeInOut" }}
                  className="w-full h-full bg-white rounded-full shadow-[0_0_10px_#ffffff]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
