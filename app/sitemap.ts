import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";
import { TOOLS } from "@/lib/content/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/refund-policy", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const toolRoutes = TOOLS.map((tool) => ({
    path: `/tools/${tool.slug}`,
    priority: tool.category === "free" ? 0.95 : 0.85,
    changeFrequency: "weekly" as const,
  }));

  return [...staticRoutes, ...toolRoutes].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
