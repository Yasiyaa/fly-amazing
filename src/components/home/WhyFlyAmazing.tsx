import React from "react";
import { Plane, Compass, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from "lucide-react";

export default function WhyFlyAmazing() {
  const features = [
    {
      icon: <Plane className="w-6 h-6 text-fly-orange" />,
      title: "Direct Flights from Australia",
      highlight: "MEL, SYD, BNE, PER, ADL",
      description: "Direct & 1-stop allocations with SriLankan, Singapore, and Malaysia Airlines.",
    },
    {
      icon: <Compass className="w-6 h-6 text-fly-cyan" />,
      title: "100% Bespoke Custom Tours",
      highlight: "Interactive Architect",
      description: "Pick your own destinations, boutique resorts, and length of stay.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-fly-orange" />,
      title: "Private Dedicated Chauffeur",
      highlight: "A/C Luxury Vehicles",
      description: "Licensed English-speaking chauffeur-guide for your private group.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-fly-cyan" />,
      title: "Transparent AUD Pricing",
      highlight: "No Hidden Conversion Fees",
      description: "Guaranteed locked-in AUD rates backed by 24/7 Aussie support.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden font-sans">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fly-cyan/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-fly-orange/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-fly-cyan-300 text-xs font-bold uppercase tracking-wider mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
            <span>The Fly Amazing Standard</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            WHY TRAVELERS CHOOSE US
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal">
            Australia’s premier gateway to Sri Lanka: cheap international airfares united with private island luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-fly-cyan/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                  {feat.icon}
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-fly-orange block mb-1">
                  {feat.highlight}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center space-x-1.5 text-xs text-fly-cyan font-bold">
                <CheckCircle2 className="w-4 h-4 text-fly-cyan" />
                <span>Verified Guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
