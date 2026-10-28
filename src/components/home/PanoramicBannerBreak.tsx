import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PanoramicBannerBreakProps {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  actionText: string;
  href: string;
}

/** Full-bleed photographic interlude between home sections. */
export default function PanoramicBannerBreak({ image, eyebrow, title, subtitle, actionText, href }: PanoramicBannerBreakProps) {
  return (
    <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-fly-navy-950 py-20 text-white sm:min-h-[520px]">
      <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-fly-navy-950/90 via-fly-navy-950/60 to-fly-navy-950/10" />

      <div className="container-page">
        <div className="max-w-xl">
          <p className="eyebrow-light">{eyebrow}</p>
          <h2 className="heading-section-light mt-3">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg">{subtitle}</p>
          <Link href={href} className="btn-primary btn-lg mt-8">
            {actionText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
