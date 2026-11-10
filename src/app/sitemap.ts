
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://accewa.cc.cd";

  const pages = [
    { path: "", priority: 1, frequency: "weekly" as const },
    { path: "/about", priority: 0.8, frequency: "monthly" as const },
    { path: "/pricing", priority: 0.9, frequency: "weekly" as const },
    { path: "/#features", priority: 0.9, frequency: "weekly" as const },
    { path: "/docs", priority: 0.8, frequency: "weekly" as const },
    { path: "/blog", priority: 0.8, frequency: "weekly" as const },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.frequency,
    priority: page.priority,
  }));
}
