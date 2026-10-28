"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/layout/SmoothScrollProvider";

/**
 * Shared behaviour for modals, drawers and the mobile menu:
 * locks page scroll (Lenis + native) and closes on Escape while open.
 */
export function useOverlay(isOpen: boolean, onClose: () => void) {
  const lenis = useLenis();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, lenis]);
}

/** Smoothly scrolls to an element id, using Lenis when available. */
export function scrollToId(id: string, lenis: ReturnType<typeof useLenis>) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -88 });
  else el.scrollIntoView({ behavior: "smooth" });
}
