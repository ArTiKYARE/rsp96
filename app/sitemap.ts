import type { MetadataRoute } from "next";
import { siteConfig, services } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about-us/",
    "/services/",
    "/history/",
    "/gallery/",
    "/vacancies/",
    "/docs/",
    "/contacts/",
    "/privacy-policy/",
    "/consent/",
    "/cookie/",
  ];

  const serviceRoutes = services.map((service) => `/services/${service.slug}/`);

  return [...routes, ...serviceRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
