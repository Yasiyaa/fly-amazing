import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, Award, HeartHandshake, Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-fly-navy-950 text-white pt-20 pb-12 border-t border-white/10 relative overflow-hidden font-sans">
      {/* Subtle atmospheric glow matching logo colors */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fly-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-fly-orange/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Top Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-12 border-b border-white/10">
          <div className="flex items-start space-x-3.5 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-fly-cyan/20 text-fly-cyan-300 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-display">Australian Consumer Protection</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-light">
                Book with total confidence. All international airfares, boutique hotels, and chauffeured tours strictly comply with Australian consumer travel standards.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-fly-orange/20 text-fly-orange-300 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-display">Direct Airline Contracts</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-light">
                Direct partnerships with SriLankan Airlines, Singapore Airlines, and Malaysia Airlines, securing unbeatable wholesale seat allocations into Colombo (CMB).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-fly-cyan/20 text-fly-cyan-300 flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-display">Private Chauffeur Included</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-light">
                No crowded buses. Every bespoke booking includes a private, modern air-conditioned vehicle with a certified, English-speaking personal guide.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation & Details Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="relative h-11 w-44 bg-white/95 rounded-lg p-1.5 inline-block">
              <Image
                src="/logo.jpeg"
                alt="Fly Amazing - fly cheaper, fly smarter"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-light">
              Australia’s specialist travel platform offering seamless air ticket booking and bespoke tailor-made luxury tours to Sri Lanka. From the misty tea hills of Nuwara Eliya to the leopard kingdoms of Yala.
            </p>

            <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-fly-orange flex-shrink-0" />
                <span>Australia Toll-Free: <strong>1300 FLY AMZ (1300 359 269)</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-fly-cyan flex-shrink-0" />
                <span>Inquiries: <strong>bookings@flyamazing.com.au</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Australian Concierge: Melbourne &bull; Sydney &bull; Colombo</span>
              </div>
            </div>
          </div>

          {/* Australian Departures */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider mb-3 text-fly-cyan-300">
              Departures to CMB
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/flights" className="hover:text-fly-cyan transition flex items-center space-x-1.5">
                  <Plane className="w-3 h-3 text-fly-orange" />
                  <span>Melbourne (MEL) Direct</span>
                </Link>
              </li>
              <li>
                <Link href="/flights" className="hover:text-fly-cyan transition flex items-center space-x-1.5">
                  <Plane className="w-3 h-3 text-fly-orange" />
                  <span>Sydney (SYD) Direct</span>
                </Link>
              </li>
              <li>
                <Link href="/flights" className="hover:text-fly-cyan transition flex items-center space-x-1.5">
                  <Plane className="w-3 h-3 text-fly-cyan" />
                  <span>Brisbane (BNE) 1-Stop</span>
                </Link>
              </li>
              <li>
                <Link href="/flights" className="hover:text-fly-cyan transition flex items-center space-x-1.5">
                  <Plane className="w-3 h-3 text-fly-cyan" />
                  <span>Perth (PER) 1-Stop</span>
                </Link>
              </li>
              <li>
                <Link href="/flights" className="hover:text-fly-cyan transition flex items-center space-x-1.5">
                  <Plane className="w-3 h-3 text-fly-cyan" />
                  <span>Adelaide (ADL) 1-Stop</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sri Lanka Highlights */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider mb-3 text-fly-orange-300">
              Curated Circuits
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/packages/emerald-highland-tea-odyssey" className="hover:text-white transition">
                  Ceylon Tea & Scenic Train Odyssey
                </Link>
              </li>
              <li>
                <Link href="/packages/wild-serendib-safari-ocean-giants" className="hover:text-white transition">
                  Wild Serendib & Leopard Safari
                </Link>
              </li>
              <li>
                <Link href="/packages/kingdoms-of-stone-golden-sands" className="hover:text-white transition">
                  Kingdoms of Stone & Golden Sands
                </Link>
              </li>
              <li>
                <Link href="/packages/grand-celestial-ceylon-panorama" className="hover:text-white transition">
                  The Grand Celestial Panorama (15D)
                </Link>
              </li>
              <li>
                <Link href="/packages/tropical-drift-surf-spice-sunset-forts" className="hover:text-white transition">
                  Southern Beach Villas & Surf
                </Link>
              </li>
            </ul>
          </div>

          {/* Bespoke Tools */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider mb-3 text-fly-cyan-300">
              Tailor-Made Travel
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/tour-architect" className="text-fly-orange font-semibold hover:underline flex items-center space-x-1">
                  <span>🛠️ Tour Architect Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white transition">
                  Sri Lanka Destination Guide
                </Link>
              </li>
              <li>
                <Link href="/flights" className="hover:text-white transition">
                  Compare Australian Airfares
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Talk to an Australian Specialist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 space-y-4 sm:space-y-0 font-light">
          <p>© {new Date().getFullYear()} Fly Amazing Australia Pty Ltd. Slogan: "fly cheaper, fly smarter".</p>
          <div className="flex items-center space-x-6">
            <span>Australian Business Standard</span>
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
