import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/book/", "/booking/"],
    },
    sitemap: `${COMPANY.url}/sitemap.xml`,
  };
}
