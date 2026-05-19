import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About Craftly — built by sellers, for sellers";

export default function OG() {
  return ogImage({
    eyebrow: "About",
    title: "Built by sellers, for sellers.",
    subtitle:
      "An independent team of AI engineers building the toolkit we wished existed when we were squinting at our own listings at 2 a.m.",
    glyph: "@",
  });
}
