import React from "react";
import Image from "next/image";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
}

/** Shared dark photographic header for inner pages. Leaves room below for an overlapping panel. */
export default function PageHero({ eyebrow, title, subtitle, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-fly-navy-950 pb-28 pt-[152px] text-white sm:pb-32 sm:pt-[176px]">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-10 object-cover opacity-50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fly-navy-950/70 via-fly-navy-950/60 to-fly-navy-950" />

      <div className="container-page text-center">
        <p className="eyebrow-light">{eyebrow}</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>
      </div>
    </section>
  );
}
