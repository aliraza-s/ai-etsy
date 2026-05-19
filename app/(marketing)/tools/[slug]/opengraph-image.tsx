import { notFound } from "next/navigation";
import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { TOOLS } from "@/lib/content/tools";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Craftly — AI tool for Etsy sellers";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const isFree = tool.category === "free";
  return ogImage({
    eyebrow: isFree ? "Free tool" : "AI tool",
    title: tool.name,
    subtitle: tool.tagline,
    glyph: isFree ? "/" : "+",
    accent: isFree ? "amber" : "teal",
  });
}
