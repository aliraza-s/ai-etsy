import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Craftly pricing — Free, Pro $5.99/mo, Max $11.99/mo";

export default function OG() {
  return ogImage({
    eyebrow: "Pricing",
    title: "Honest pricing. Cancel any time.",
    subtitle:
      "Free forever with 15 credits/month. Pro $5.99/mo. Max $11.99/mo with Claude Sonnet on analyzers.",
    glyph: "$",
    accent: "amber",
  });
}
