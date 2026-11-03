/** @type {import('next').NextConfig} */

// Only this project's Supabase host may serve images through the optimiser.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return "";
  }
})();

const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "";

// Full policy runs in report-only mode first so it can't break the site; frame-ancestors is enforced.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://images.pexels.com ${supabaseOrigin}`,
  `media-src 'self' blob: https://assets.mixkit.co ${supabaseOrigin}`,
  "font-src 'self'",
  `connect-src 'self' ${supabaseOrigin} ${supabaseHost ? `wss://${supabaseHost}` : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .replace(/\s+/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      ...(supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/media/**" }] : []),
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
