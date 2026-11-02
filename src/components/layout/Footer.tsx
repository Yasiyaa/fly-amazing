import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, MapPin, Phone, HeartHandshake, Ban } from "lucide-react";
import Logo from "./Logo";
import { getSiteSettings, getTours } from "@/lib/catalog";
import { COMPANY, whatsappLink } from "@/lib/site";

const PILLARS = [
  {
    icon: HeartHandshake,
    title: "Your own chauffeur-guide",
    body: "A licensed, English-speaking driver-guide and a private air-conditioned vehicle for your whole trip.",
  },
  {
    icon: Ban,
    title: "No commission stops",
    body: "Your guide never takes you to shops or gem dealers for commission. The day is about what you came to see.",
  },
  {
    icon: ShieldCheck,
    title: "Clear prices, local team",
    body: "Published USD prices, no payment until you approve your confirmation, and a Colombo team on call 24/7.",
  },
];

export default async function Footer() {
  const [settings, tours] = await Promise.all([getSiteSettings(), getTours()]);
  const whatsapp = whatsappLink(settings.whatsapp, "Hello! I'd like to plan a Sri Lanka tour.");

  return (
    <footer className="relative overflow-hidden bg-fly-navy-950 text-slate-300">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-fly-cyan/10 blur-3xl" />

      <div className="container-page relative">
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

        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              {COMPANY.name} designs private, tailor-made tours of Sri Lanka for travellers from around the world, run by our own team in Colombo.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fly-orange" />
                <address className="not-italic">{settings.address.join(", ")}</address>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-3 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-fly-orange" />
                  {settings.email}
                </a>
              </li>
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-3 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 shrink-0 text-fly-orange" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 shrink-0 text-fly-orange" />
                    WhatsApp us
                  </a>
                </li>
              )}
            </ul>
          </div>

          <FooterColumn title="Tours" className="lg:col-span-4">
            {tours.slice(0, 7).map((t) => (
              <FooterLink key={t.slug} href={`/tours/${t.slug}`}>
                {t.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Plan" className="lg:col-span-2">
            <FooterLink href="/plan">AI trip planner</FooterLink>
            <FooterLink href="/tour-architect">Build your own trip</FooterLink>
            <FooterLink href="/destinations">Destination guide</FooterLink>
            <FooterLink href="/tours">All tours</FooterLink>
          </FooterColumn>

          <FooterColumn title="Help" className="lg:col-span-2">
            <FooterLink href="/booking">Manage booking</FooterLink>
            <FooterLink href="/booking-terms">Booking terms</FooterLink>
            <FooterLink href="/contact">Contact us</FooterLink>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.name}. Prices in USD.
            {settings.sltdaLicence && <> · Licensed by the Sri Lanka Tourism Development Authority, licence no. {settings.sltdaLicence}</>}
          </p>
          <p className="text-slate-400">Colombo, Sri Lanka</p>
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
