import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import { SiteSettingsProvider } from "@/components/layout/SiteSettingsProvider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import ChatWidget from "@/components/planner/ChatWidget";
import { getFxRates, getSiteSettings } from "@/lib/catalog";
import { COMPANY } from "@/lib/site";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: "Amazing World Travel | Private, tailor-made Sri Lanka tours",
    template: "%s | Amazing World Travel",
  },
  description:
    "Private Sri Lanka tours with your own chauffeur-guide, designed by a Colombo-based team. Clear USD prices, no commission stops, and an AI trip planner that builds your itinerary in minutes.",
  icons: { icon: "/logo.jpeg" },
  openGraph: {
    title: "Amazing World Travel · Sri Lanka tours",
    description: "Private, tailor-made Sri Lanka tours from a Colombo-based team.",
    siteName: COMPANY.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#011A37",
  width: "device-width",
  initialScale: 1,
};

export const revalidate = 300;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, rates] = await Promise.all([getSiteSettings(), getFxRates()]);
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        <SiteSettingsProvider settings={settings}>
          <CurrencyProvider rates={rates}>
            <SmoothScrollProvider>
              {children}
              <ChatWidget />
            </SmoothScrollProvider>
          </CurrencyProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
