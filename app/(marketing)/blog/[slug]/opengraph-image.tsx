import { notFound } from "next/navigation";
import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { BLOG_BY_SLUG } from "@/lib/content/blog";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Craftly blog post";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_BY_SLUG[slug];
  if (!post) notFound();

  return ogImage({
    eyebrow: `Blog · ${post.readingMinutes} min read`,
    title: post.title,
    subtitle: post.description,
    glyph: "B",
    accent: post.accent ?? "teal",
  });
}
