/**
 * Canonical site metadata. Single source of truth for SEO + JSON-LD.
 */
export const SITE = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  tagline: "AI tools for Etsy sellers",
  description:
    "AI-powered tag, title, keyword, description, listing & shop tools for Etsy sellers. Plus free fee calculator and seasonal events calendar. No Etsy API required — paste and go.",
  /** Author / brand info for E-E-A-T. */
  brand: {
    legalName: "Craftly",
    foundingDate: "2026",
    founder: "Craftly Team",
  },
  /** Sitemap + AI ingestion. */
  defaultOgImage: "/og-default.png",
} as const;
