import React from "react";
import { Plane, Compass, ShieldCheck, HeartHandshake, Award, Sparkles } from "lucide-react";

export default function WhyFlyAmazing() {
  const features = [
    {
      icon: <Plane className="w-5 h-5 text-fly-orange" />,
      title: "Direct & 1-Stop Flights",
      description:
        "Specialist airline allocations with SriLankan Airlines, Singapore Airlines, and Malaysia Airlines connecting MEL, SYD, BNE, PER, and ADL directly to Colombo.",
    },
    {
      icon: <Compass className="w-5 h-5 text-fly-cyan" />,
      title: "Interactive Tour Studio",
      description:
        "Never settle for rigid group itineraries. Pick your exact destinations, adjust stay lengths, and choose luxury hotels dynamically with real guest ratings.",
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-fly-orange" />,
      title: "Private Dedicated Chauffeur",
      description:
        "No crowded tour buses. Every booking includes a private, modern air-conditioned vehicle with a licensed, English-speaking personal chauffeur-guide.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-fly-cyan" />,
      title: "Australian Peace of Mind",
      description:
        "All bookings are structured in Australian Dollars (AUD) with no hidden conversion surprises, backed by 24/7 dedicated local Australian support.",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden font-sans">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-fly-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-fly-orange/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-fly-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-fly-orange" />
            <span>The Fly Amazing Standard</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal font-serif text-white tracking-tight">
            Why Australian Travelers <span className="italic">Choose Us</span>.
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
            We bridge the gap between affordable international airfares and bespoke Sri Lankan luxury. Here is why discerning travelers entrust their journey to Fly Amazing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, index) => (
            <div
              key={index}
              className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-fly-cyan/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                {feat.icon}
              </div>
              <h3 className="text-base font-normal font-serif text-white mb-1.5">{feat.title}</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
