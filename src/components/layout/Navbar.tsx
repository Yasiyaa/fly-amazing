"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOverlay } from "@/lib/useOverlay";
import Logo from "./Logo";
import { CurrencySelect } from "@/components/currency/CurrencyProvider";
import { useSiteSettings } from "./SiteSettingsProvider";

const NAV_LINKS = [
  { name: "Tours", href: "/tours" },
  { name: "Destinations", href: "/destinations" },
  { name: "Build your trip", href: "/tour-architect" },
  { name: "AI planner", href: "/plan" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const settings = useSiteSettings();

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);
  useOverlay(mobileMenuOpen, closeMenu);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          scrolled || mobileMenuOpen
            ? "border-b border-slate-200/80 bg-white/95 shadow-[0_1px_24px_-12px_rgba(2,37,77,0.25)] backdrop-blur-xl"
            : "border-b border-transparent bg-white/90 backdrop-blur-md"
        )}
      >
        <nav className="container-page flex h-[72px] items-center justify-between gap-6" aria-label="Main">
          <Link href="/" className="shrink-0" aria-label="Amazing World Travel home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors xl:px-4",
                    isActive(link.href) ? "text-fly-navy" : "text-slate-600 hover:bg-slate-100/80 hover:text-fly-navy"
                  )}
                >
                  {link.href === "/plan" && <Sparkles className="h-3.5 w-3.5 text-fly-orange" />}
                  {link.name}
                  {isActive(link.href) && <span className="absolute inset-x-4 -bottom-[3px] h-[2px] rounded-full bg-fly-orange" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <CurrencySelect className="hidden sm:block" />
            <Link href="/tours" className="btn-primary btn-sm hidden md:inline-flex">
              Book a tour
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-fly-navy transition-colors hover:bg-slate-100 lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: outside the header, whose backdrop-filter would otherwise contain this fixed panel */}
      <div
        id="mobile-menu"
        data-lenis-prevent
        className={cn(
          "fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-white transition-[opacity,visibility] duration-200 lg:hidden",
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="container-page flex min-h-full flex-col py-6">
          <ul className="divide-y divide-slate-100">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between py-4 font-display text-xl font-semibold",
                    isActive(link.href) ? "text-fly-orange" : "text-fly-navy-900"
                  )}
                >
                  {link.name}
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-8">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <span className="text-sm text-slate-600">Show prices in</span>
              <CurrencySelect />
            </div>
            <Link href="/tours" onClick={closeMenu} className="btn-primary btn-lg w-full">
              Book a tour
            </Link>
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="btn-secondary btn-lg w-full">
                <Phone className="h-4 w-4 text-fly-orange" />
                Call {settings.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
