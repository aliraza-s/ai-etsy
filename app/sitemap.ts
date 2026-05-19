import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";
import { TOOLS } from "@/lib/content/tools";
import { BLOG_POSTS } from "@/lib/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const, lastModified: now },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const, lastModified: now },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" as const, lastModified: now },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const, lastModified: now },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" as const, lastModified: now },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const, lastModified: now },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const, lastModified: now },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const, lastModified: now },
    {
      path: "/refund-policy",
      priority: 0.2,
      changeFrequency: "yearly" as const,
      lastModified: now,
    },
  ];

  const toolRoutes = TOOLS.map((tool) => ({
    path: `/tools/${tool.slug}`,
    priority: tool.category === "free" ? 0.95 : 0.85,
    changeFrequency: "weekly" as const,
    lastModified: now,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes].map(
    ({ path, priority, changeFrequency, lastModified }) => ({
      url: `${SITE.url}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );
}
