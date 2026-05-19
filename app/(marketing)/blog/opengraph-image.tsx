import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Craftly blog — field-tested Etsy SEO";

export default function OG() {
  return ogImage({
    eyebrow: "Blog",
    title: "Field-tested Etsy SEO.",
    subtitle:
      "Specific tactics from people who actually run shops. Updated as the platform changes.",
    glyph: "B",
  });
}
