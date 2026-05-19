import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Craftly — AI tools for Etsy sellers";

export default function OG() {
  return ogImage({
    eyebrow: "AI tools for Etsy sellers",
    title: "Sell more. Type less.",
    subtitle:
      "Tags, titles, keywords, descriptions, listing & shop audits — paste your product, get optimized output in seconds.",
    glyph: "C",
  });
}
