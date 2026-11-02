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
      url: "/videos/coconut-palms.mp4",
      poster: "https://images.unsplash.com/photo-1580910531902-1112518b26ea?q=80&w=2000&auto=format&fit=crop",
      label: "Coconut palms on the south coast",
    },
    {
      url: "/videos/vecteezy_aerial-view-of-sand-beach-and-water-surface-texture-foamy_7515199.mp4",
      poster: "https://images.unsplash.com/photo-1734279135136-dcaca9fdffaf?q=80&w=2000&auto=format&fit=crop",
      label: "Mirissa & Bentota beaches",
    },
    {
      url: "/videos/wildlife-elephant.mp4",
      poster: "/images/tom-paisley-v2zEiziFb44-unsplash.jpg",
      label: "Wild elephants in Yala & Minneriya",
    },
    {
      url: "/videos/vecteezy_aerial-view-of-person-walking-on-bamboo-bridge-amidst-lush_78250928.mp4",
      poster: "/images/dylan-shaw-smUAKwMT8XA-unsplash.jpg",
      label: "Rainforest canopy trails",
    },
  ],
};

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
