import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Fly Amazing | Australia to Sri Lanka Cheap Flights & Bespoke Tours",
  description:
    "Australia's premier flight and custom holiday booking platform for Sri Lanka. Direct flights from Melbourne and Sydney, dynamic hotel discovery with real reviews, and interactive Tour Architect.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-800 bg-white selection:bg-fly-cyan selection:text-white">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
