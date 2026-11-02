import type { Metadata } from "next";
import { Phone, Mail, MapPin, ArrowUpRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/catalog";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to our Sri Lanka travel specialists in Colombo by email, phone or WhatsApp.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsapp = whatsappLink(settings.whatsapp, "Hello! I'd like to plan a Sri Lanka tour.");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address.join(", "))}`;

  const channels = [
    { icon: Mail, label: "Email", value: settings.email, note: "We reply within one business day", href: `mailto:${settings.email}` },
    ...(whatsapp ? [{ icon: MessageCircle, label: "WhatsApp", value: settings.whatsapp, note: "Chat with our team", href: whatsapp }] : []),
    ...(settings.phone
      ? [{ icon: Phone, label: "Phone", value: settings.phone, note: "Colombo, GMT+5:30", href: `tel:${settings.phone.replace(/[^\d+]/g, "")}` }]
      : []),
    { icon: MapPin, label: "Office", value: settings.address.join(", "), note: "Open in Google Maps", href: mapsUrl },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <PageHero
        eyebrow="Contact"
        title="Talk to a Sri Lanka specialist"
        subtitle="Tell us your dates, who's travelling and what you'd love to see. Our Colombo team will come back with ideas and a tailored proposal."
        image="/images/posters/coconut-palms.jpg"
        imageAlt="Coconut palms against a blue sky"
        video="/videos/web/coconut-palms.mp4"
      />

      <section className="container-page relative z-10 -mt-16 pb-24">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="card p-6 shadow-xl shadow-fly-navy/5 sm:p-8 lg:col-span-5">
            <h2 className="text-xl font-bold text-fly-navy-900">Get in touch</h2>
            <ul className="mt-6 space-y-3">
              {channels.map(({ icon: Icon, label, value, note, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-fly-orange/40 hover:bg-fly-orange-50/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fly-orange-50">
                      <Icon className="h-5 w-5 text-fly-orange" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-slate-500">{label}</span>
                      <span className="block break-words font-semibold text-slate-900">{value}</span>
                      <span className="block text-xs text-slate-500">{note}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-fly-orange" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-500">
              We work with travellers worldwide. Calls can be arranged at a time that suits your time zone.
            </p>
          </div>

          <div className="card p-6 shadow-xl shadow-fly-navy/5 sm:p-10 lg:col-span-7">
            <h2 className="text-2xl font-bold text-fly-navy-900 sm:text-3xl">Send us a message</h2>
            <p className="mt-2 text-slate-500">We&rsquo;ll reply with ideas and a tailored proposal within one business day.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
