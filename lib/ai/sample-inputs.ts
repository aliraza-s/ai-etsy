import type { Tool } from "@prisma/client";

/**
 * Canned sample inputs used by the admin Test button.
 *
 * Each value satisfies the corresponding TOOL_INPUT_SCHEMA in `lib/ai/schemas.ts`,
 * so `buildUserPrompt(tool, SAMPLE_INPUTS[tool])` is safe.
 */
export const SAMPLE_INPUTS: Record<Tool, unknown> = {
  TAG_GENERATOR: {
    productTitle: "Hand-poured vanilla soy candle in 8oz amber jar",
    productDetails: "Natural soy wax, cotton wick, 40h burn time, small-batch.",
  },
  TITLE_GENERATOR: {
    productDescription:
      "Hand-knit chunky merino wool throw blanket, 60x80, cozy bed throw in oatmeal beige.",
    attributes: ["merino wool", "60x80", "hand knit", "oatmeal"],
  },
  KEYWORD_GENERATOR: {
    seed: "soy candle",
    niche: "home decor gifts",
  },
  DESCRIPTION_GENERATOR: {
    productBullets: [
      "100% soy wax, no paraffin",
      "Cotton wick — clean, even burn",
      "8oz amber jar, reusable",
      "40-hour burn time",
      "Hand-poured in small batches",
    ],
    tone: "friendly",
  },
  LISTING_ANALYZER: {
    title: "Soy Candle Vanilla Scent 8oz",
    tags: ["soy candle", "vanilla candle", "scented candle", "gift candle"],
    description:
      "A vanilla-scented soy candle in an 8oz amber jar. Burns for about 40 hours. Hand-poured.",
    attributes: ["soy wax", "vanilla", "8oz"],
    priceUsd: 18,
    photoCount: 4,
    category: "Home & Living",
  },
  NICHE_FINDER: {
    seedCategory: "home decor",
    targetAudience: "remote workers and minimalist apartment dwellers",
    pricePointHint: "mid",
  },
  SHOP_ANALYZER: {
    shopName: "WildwoodCandles",
    about: "We hand-pour small-batch soy candles inspired by Pacific Northwest forests.",
    announcement: "Free U.S. shipping on orders over $35.",
    niche: "hand-poured candles",
    listingCount: 23,
    reviewCount: 41,
    topListingsText:
      "Cedar & Smoke Soy Candle 8oz\nVanilla Oat Soy Candle\nDouglas Fir Holiday Candle",
  },
};
