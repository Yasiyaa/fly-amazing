import type { SiteSettings } from "./types";

export const COMPANY = {
  name: "Amazing World Travel",
  shortName: "Amazing World",
  domain: "amazingworldtravel.com",
  url: "https://amazingworldtravel.com",
  tagline: "Private, tailor-made tours of Sri Lanka",
};

/**
 * Defaults used until staff save site settings in admin. Empty phone/WhatsApp/SLTDA values hide
 * the related buttons and badges rather than showing a placeholder number.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  phone: "",
  whatsapp: "",
  email: "info@amazingworldtravel.com",
  address: ["Unit 94D, 75 Galle Road", "Colombo 03", "Sri Lanka"],
  sltdaLicence: "",
  heroVideos: [
    {
      url: "/videos/web/coconut-palms.mp4",
      poster: "/images/posters/coconut-palms.jpg",
      label: "Coconut palms on the south coast",
    },
    {
      url: "/videos/web/south-coast-beach.mp4",
      poster: "/images/posters/south-coast-beach.jpg",
      label: "Golden beaches of the south coast",
    },
    {
      url: "https://assets.mixkit.co/videos/11059/11059-720.mp4",
      poster: "https://images.unsplash.com/photo-1674556275189-e78fd6223e6d?q=80&w=2000&auto=format&fit=crop",
      label: "Wild elephant herds in Minneriya & Udawalawe",
    },
    {
      url: "/videos/web/rainforest-bridge.mp4",
      poster: "/images/posters/rainforest-bridge.jpg",
      label: "Rainforest canopy trails",
    },
  ],
};

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
