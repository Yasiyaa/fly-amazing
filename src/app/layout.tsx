import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Fly Amazing | Australia to Sri Lanka Flights & Tailor-Made Tours",
  description:
    "Flights from Melbourne, Sydney, Brisbane, Perth and Adelaide to Colombo, bundled with boutique hotels, private chauffeurs and tailor-made Sri Lanka tours. Priced in AUD.",
  icons: {
    icon: "/logo.jpeg",
  },
  openGraph: {
    title: "Fly Amazing | Australia to Sri Lanka",
    description: "Flights and tailor-made Sri Lanka holidays for Australian travellers, priced in AUD.",
    locale: "en_AU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#011A37",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
