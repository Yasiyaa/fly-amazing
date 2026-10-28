import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-800 bg-white selection:bg-fly-cyan selection:text-white">
        {children}
      </body>
    </html>
  );
}
