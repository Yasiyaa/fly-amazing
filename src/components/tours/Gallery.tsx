"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { useOverlay } from "@/lib/useOverlay";
import { cn } from "@/lib/utils";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useOverlay(open !== null, close);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  if (images.length === 0) return null;
  const shown = images.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        {shown.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-slate-200",
              i === 0 ? "col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-auto" : "aspect-[4/3]"
            )}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <Image
              src={src}
              alt={`${title}, photo ${i + 1}`}
              fill
              sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "25vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {i === shown.length - 1 && images.length > shown.length && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                +{images.length - shown.length} photos
              </span>
            )}
            {i === 0 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <Expand className="h-3.5 w-3.5" />
                View gallery
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90" role="dialog" aria-modal="true" aria-label={`${title} photos`}>
          <button type="button" onClick={close} className="absolute inset-0 cursor-default" aria-label="Close gallery" />
          <div className="relative h-[80vh] w-[92vw] max-w-6xl">
            <Image src={images[open]} alt={`${title}, photo ${open + 1}`} fill sizes="92vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <p className="absolute bottom-5 text-sm text-white/70">
            {open + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
