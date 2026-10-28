"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOverlay } from "@/lib/useOverlay";

export const PHONE_DISPLAY = "1300 359 269";
export const PHONE_HREF = "tel:1300359269";

const NAV_LINKS = [
  { name: "Flights", href: "/flights" },
  { name: "Packages", href: "/packages" },
  { name: "Tour Architect", href: "/tour-architect" },
  { name: "Destinations", href: "/destinations" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
          <Link href="/" className="relative block h-9 w-[125px] shrink-0 sm:h-10 sm:w-[139px]" aria-label="Fly Amazing home">
            <Image src="/logo.png" alt="Fly Amazing" fill priority sizes="140px" className="object-contain object-left" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                    isActive(link.href)
                      ? "text-fly-navy"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-fly-navy"
                  )}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-4 -bottom-[3px] h-[2px] rounded-full bg-fly-orange" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_HREF}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold text-fly-navy transition-colors hover:bg-slate-100 xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-fly-orange" />
              {PHONE_DISPLAY}
            </a>
            <Link href="/tour-architect" className="btn-primary btn-sm hidden sm:inline-flex">
              Plan my trip
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
            <Link href="/tour-architect" onClick={closeMenu} className="btn-primary btn-lg w-full">
              Plan my trip
            </Link>
            <a href={PHONE_HREF} className="btn-secondary btn-lg w-full">
              <Phone className="h-4 w-4 text-fly-orange" />
              Call {PHONE_DISPLAY}
            </a>
            <p className="pt-2 text-center text-xs text-slate-400">Mon–Sat, 8:30am–7:30pm AEST</p>
          </div>
        </div>
      </div>
    </>
  );
}
