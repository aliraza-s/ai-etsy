import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Craftly — eight tools for Etsy sellers";

export default function OG() {
  return ogImage({
    eyebrow: "Toolkit",
    title: "Eight tools, one toolkit.",
    subtitle:
      "Six AI-powered generators and audits, plus two free utilities — fee calculator and seasonal events calendar.",
    glyph: "+",
  });
}
