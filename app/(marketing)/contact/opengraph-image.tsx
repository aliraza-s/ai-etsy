import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact Craftly";

export default function OG() {
  return ogImage({
    eyebrow: "Contact",
    title: "We read every message.",
    subtitle:
      "Bug reports, feature ideas, partnership asks, refunds — a real human replies within 24 hours.",
    glyph: "@",
    accent: "amber",
  });
}
