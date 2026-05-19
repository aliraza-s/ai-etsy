import type { ReactNode } from "react";

/**
 * Blog content registry.
 *
 * Posts are TypeScript modules rather than `.mdx` files — same JSX-in-content
 * power as MDX without the loader plumbing, frontmatter syntax, or build-step
 * gotchas. The shared `<Prose>` component in `components/blog/prose.tsx`
 * styles them. Swap to actual MDX later by replacing this registry with a
 * file-glob over `content/blog/*.mdx` — the page templates won't change.
 */

export interface BlogPostMeta {
  slug: string;
  title: string;
  /** ≤ 155-char meta description / RSS summary. */
  description: string;
  /** Display author. */
  author: string;
  /** ISO date. Used for sitemap, RSS, JSON-LD `datePublished`. */
  date: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  /** Lowercase, kebab-case topic tags. */
  tags: string[];
  /** OG accent — "teal" (default) or "amber". */
  accent?: "teal" | "amber";
}

export interface BlogPost extends BlogPostMeta {
  /** Pre-rendered intro paragraph used by the index and the article hero. */
  excerpt: string;
  /** Full body as rendered JSX. Use the helpers below for consistency. */
  body: ReactNode;
}

/** Pull from `lib/content/blog-posts/` so this registry stays tiny. */
import { etsyTitleAnatomy } from "./blog-posts/etsy-title-anatomy";
import { thirteenTagStrategy } from "./blog-posts/thirteen-tag-strategy";
import { whyListingsStall } from "./blog-posts/why-listings-stall";

export const BLOG_POSTS: BlogPost[] = [etsyTitleAnatomy, thirteenTagStrategy, whyListingsStall];

export const BLOG_BY_SLUG = Object.fromEntries(BLOG_POSTS.map((p) => [p.slug, p])) as Record<
  string,
  BlogPost
>;

/** Posts other than `currentSlug`, newest first. */
export function relatedBlogPosts(currentSlug: string, count = 3): BlogPostMeta[] {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, count);
}
