import React from "react";
import { Plane, Compass, ShieldCheck, HeartHandshake } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const FEATURES = [
  {
    icon: Plane,
    title: "Flights from five capitals",
    description: "Direct and one-stop fares from MEL, SYD, BNE, PER and ADL with SriLankan, Singapore and Malaysia Airlines.",
  },
  {
    icon: Compass,
    title: "Tours built around you",
    description: "Choose your own destinations, hotels and pace, or start from one of our signature journeys.",
  },
  {
    icon: HeartHandshake,
    title: "Your own chauffeur-guide",
    description: "A licensed, English-speaking driver-guide and private air-conditioned vehicle for your whole trip.",
  },
  {
    icon: ShieldCheck,
    title: "Clear pricing in AUD",
    description: "Quotes in Australian dollars with no conversion surprises, backed by local support seven days a week.",
  },
];

export default function WhyFlyAmazing() {
  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Why Fly Amazing"
          title="Travel the way Australians want to"
          description="One team handles your flights, stays and touring, so the only thing you plan is what to see first."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fly-orange-50">
                <Icon className="h-5 w-5 text-fly-orange" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-fly-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
