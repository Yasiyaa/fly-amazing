"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Compass, Plane, MapPin, Sparkles, Menu, X, ArrowRight, MessageSquare } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Flights", href: "/flights", icon: Plane, color: "text-fly-cyan" },
    { name: "Curated Packages", href: "/packages", icon: Sparkles, color: "text-fly-orange" },
    { name: "Tour Architect", href: "/tour-architect", icon: Compass, color: "text-fly-cyan", badge: "Custom" },
    { name: "Destinations", href: "/destinations", icon: MapPin, color: "text-fly-navy" },
    { name: "Contact", href: "/contact", icon: MessageSquare, color: "text-slate-600" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans">
      {/* Top Australian Trust Strip */}
      <div className="bg-fly-navy-950 text-white text-xs py-1.5 px-4 sm:px-8 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 font-medium text-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>🇦🇺 Australia to Sri Lanka Travel Concierge</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-slate-300 font-light">ATAS & IATA Accredited Partner</span>
            <span className="text-white/20">•</span>
            <span className="text-fly-cyan-300 font-semibold">Direct: MEL & SYD &bull; 1-Stop: BNE, PER, ADL</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-200">
            <a href="tel:1300359269" className="flex items-center space-x-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-fly-orange" />
              <span>Australian Hotline: <strong className="text-white font-bold">1300 FLY AMZ</strong></span>
            </a>
            <div className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-fly-cyan-200">
              AUD $
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav
        className={`transition-all duration-300 px-4 sm:px-8 ${
          scrolled
            ? "py-2.5 bg-white/95 backdrop-blur-md shadow-md shadow-fly-navy/5 border-b border-slate-200"
            : "py-3 bg-white/90 backdrop-blur-sm border-b border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-10 w-44 sm:h-11 sm:w-48 overflow-hidden rounded-md transition-transform group-hover:scale-[1.02]">
              <Image
                src="/logo.jpeg"
                alt="Fly Amazing - fly cheaper, fly smarter"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1.5 text-sm font-semibold transition-colors py-1 relative ${
                    isActive
                      ? "text-fly-navy font-bold"
                      : "text-slate-700 hover:text-fly-navy"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.color}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded-full bg-fly-cyan-50 text-fly-cyan-800 border border-fly-cyan-200">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-fly-orange to-fly-cyan rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <a
              href="tel:1300359269"
              className="px-3.5 py-1.5 text-xs font-bold text-fly-navy rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-fly-navy" />
              <span>1300 359 269</span>
            </a>

            <Link
              href="/tour-architect"
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-fly-orange to-fly-orange-600 hover:from-fly-orange-600 hover:to-fly-orange shadow-sm shadow-fly-orange/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5"
            >
              <span>Build Custom Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-3 pb-5 px-4 bg-white/95 rounded-2xl border border-slate-200 shadow-xl space-y-2 font-sans">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800 text-sm"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${link.color}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-fly-cyan-50 text-fly-cyan-800">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                href="/tour-architect"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-white bg-fly-orange shadow-sm"
              >
                Plan Custom Tour Now
              </Link>
              <a
                href="tel:1300359269"
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-fly-orange" />
                <span>Call Australian Concierge: 1300 359 269</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
