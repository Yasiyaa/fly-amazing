/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Media uploaded through the admin area (Supabase Storage public bucket)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    // Old Fly Amazing URLs → new pages, so existing links and search results keep working.
    const oldPackages = {
      "emerald-highland-tea-odyssey": "tea-country-and-scenic-rail",
      "wild-serendib-safari-ocean-giants": "leopards-and-elephants-safari",
      "kingdoms-of-stone-golden-sands": "cultural-triangle-and-hill-country",
      "grand-celestial-ceylon-panorama": "grand-tour-of-sri-lanka",
      "tropical-drift-surf-spice-sunset-forts": "east-coast-summer",
    };
    return [
      ...Object.entries(oldPackages).map(([from, to]) => ({ source: `/packages/${from}`, destination: `/tours/${to}`, permanent: true })),
      { source: "/packages", destination: "/tours", permanent: true },
      { source: "/packages/:slug", destination: "/tours", permanent: true },
      { source: "/flights", destination: "/tours", permanent: true },
    ];
  },
};

export default nextConfig;
