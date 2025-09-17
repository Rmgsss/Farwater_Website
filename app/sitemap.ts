import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const staticRoutes = [
  "/",
  "/about",
  "/posts",
  "/gallery",
  "/forum",
  "/join",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
