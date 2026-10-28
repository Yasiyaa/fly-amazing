import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, Award, HeartHandshake } from "lucide-react";
import { CURATED_PACKAGES } from "@/data/packages";
import { AUSTRALIAN_AIRPORTS } from "@/data/australianAirports";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Australian consumer protection",
    body: "Airfares, hotels and touring are booked to Australian consumer travel standards.",
  },
  {
    icon: Award,
    title: "Direct airline contracts",
    body: "Wholesale seat allocations with SriLankan, Singapore and Malaysia Airlines into Colombo.",
  },
  {
    icon: HeartHandshake,
    title: "Private chauffeur included",
    body: "Every tour includes a private air-conditioned vehicle and an English-speaking guide.",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-fly-navy-950 text-slate-300">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-fly-cyan/10 blur-3xl" />

      <div className="container-page relative">
        {/* Trust pillars */}
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 py-14 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-fly-cyan-300" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="inline-flex rounded-xl bg-white px-4 py-3">
              <div className="relative h-9 w-[125px]">
                <Image src="/logo.png" alt="Fly Amazing" fill sizes="125px" className="object-contain" />
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Australia&rsquo;s Sri Lanka specialist: return flights from five capital cities and tailor-made holidays from the
              tea hills of Nuwara Eliya to the leopard country of Yala.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href="tel:1300359269" className="inline-flex items-center gap-3 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-fly-orange" />
                  1300 359 269 <span className="text-slate-500">(1300 FLY AMZ)</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:bookings@flyamazing.com.au"
                  className="inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-fly-orange" />
                  bookings@flyamazing.com.au
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-fly-orange" />
                Melbourne &middot; Sydney &middot; Colombo
              </li>
            </ul>
          </div>

          <FooterColumn title="Fly from" className="lg:col-span-2">
            {AUSTRALIAN_AIRPORTS.map((a) => (
              <FooterLink key={a.code} href="/flights">
                {a.city} ({a.code})
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Curated packages" className="lg:col-span-4">
            {CURATED_PACKAGES.map((p) => (
              <FooterLink key={p.id} href={`/packages/${p.id}`}>
                {p.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Plan" className="lg:col-span-2">
            <FooterLink href="/tour-architect">Tour Architect</FooterLink>
            <FooterLink href="/destinations">Destination guide</FooterLink>
            <FooterLink href="/flights">Compare airfares</FooterLink>
            <FooterLink href="/contact">Talk to a specialist</FooterLink>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Fly Amazing Australia Pty Ltd. All prices in AUD.</p>
          <p className="font-medium tracking-wide text-slate-400">fly cheaper &middot; fly smarter</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-slate-400 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
