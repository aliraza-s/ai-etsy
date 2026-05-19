import { z } from "zod";
import type { Tool } from "@prisma/client";

// ─── Input schemas (validated server-side from POST body) ────────────────────

export const tagGeneratorInput = z.object({
  productTitle: z.string().trim().min(3).max(140),
  productDetails: z.string().trim().max(2000).optional(),
});

export const titleGeneratorInput = z.object({
  productDescription: z.string().trim().min(10).max(2000),
  attributes: z.array(z.string().trim().max(80)).max(8).optional(),
});

export const keywordGeneratorInput = z.object({
  seed: z.string().trim().min(2).max(80),
  niche: z.string().trim().max(80).optional(),
});

export const descriptionGeneratorInput = z.object({
  productBullets: z.array(z.string().trim().min(2).max(200)).min(1).max(12),
  tone: z.enum(["friendly", "professional", "playful"]).default("friendly"),
});

export const listingAnalyzerInput = z.object({
  title: z.string().trim().min(3).max(200),
  tags: z.array(z.string().trim().min(1).max(20)).max(13),
  description: z.string().trim().min(10).max(5000),
  attributes: z.array(z.string().trim().max(80)).max(20).optional(),
  priceUsd: z.number().nonnegative().max(100000).optional(),
  photoCount: z.number().int().min(0).max(10).optional(),
  category: z.string().trim().max(120).optional(),
});

export const shopAnalyzerInput = z.object({
  shopName: z.string().trim().min(1).max(80),
  about: z.string().trim().min(10).max(3000),
  announcement: z.string().trim().max(1000).optional(),
  niche: z.string().trim().max(120).optional(),
  listingCount: z.number().int().min(0).max(10000),
  reviewCount: z.number().int().min(0).max(1000000).optional(),
  topListingsText: z.string().trim().max(3000).optional(),
});

// ─── Output schemas (used to constrain AI structured output) ─────────────────

export const tagGeneratorOutput = z.object({
  tags: z
    .array(z.string().min(2).max(20))
    .length(13)
    .describe("Exactly 13 Etsy tags, multi-word phrases, each <=20 characters."),
});

export const titleGeneratorOutput = z.object({
  titles: z
    .array(z.string().min(20).max(140))
    .length(5)
    .describe("Exactly 5 Etsy listing titles, each <=140 characters, keyword front-loaded."),
});

export const keywordGeneratorOutput = z.object({
  keywords: z
    .array(
      z.object({
        phrase: z.string().min(2).max(80),
        intent: z.enum(["high", "medium", "low"]),
      }),
    )
    .length(30)
    .describe("Exactly 30 long-tail Etsy keywords with buyer-intent scoring."),
});

export const descriptionGeneratorOutput = z.object({
  description: z
    .string()
    .min(150)
    .max(2000)
    .describe(
      "180-280 word Etsy product description with first-line hook, scannable bullets, and soft CTA.",
    ),
});

const axisScore = z.object({
  score: z.number().int().min(0).max(100).describe("0-100 score for this axis."),
  why: z.string().min(8).max(400).describe("One-paragraph explanation for the score."),
  fixes: z
    .array(z.string().min(8).max(200))
    .min(1)
    .max(3)
    .describe("1-3 specific fixes for this axis."),
});

export const listingAnalyzerOutput = z.object({
  score: z.number().int().min(0).max(100).describe("Overall listing visibility score 0-100."),
  axes: z.object({
    titleSeo: axisScore,
    tagRelevance: axisScore,
    descriptionQuality: axisScore,
    photoCoverage: axisScore,
    attributes: axisScore,
  }),
  topWins: z.array(z.string().min(8).max(200)).length(3).describe("Three things working well."),
  topFixes: z
    .array(z.string().min(8).max(200))
    .length(3)
    .describe("Three highest-impact fixes, ordered by ROI."),
  quickWin: z.string().min(8).max(200).describe("The single easiest improvement to ship today."),
});

const pillarScore = z.object({
  score: z.number().int().min(0).max(100),
  why: z.string().min(8).max(400),
});

export const shopAnalyzerOutput = z.object({
  overallScore: z.number().int().min(0).max(100).describe("Overall shop health score 0-100."),
  pillars: z.object({
    branding: pillarScore,
    seo: pillarScore,
    conversion: pillarScore,
    policy: pillarScore,
    diversity: pillarScore,
  }),
  topWins: z.array(z.string().min(8).max(200)).length(3).describe("Three shop-level strengths."),
  topFixes: z
    .array(z.string().min(8).max(200))
    .length(3)
    .describe("Three highest-impact fixes ordered by ROI."),
  brandVoiceNotes: z
    .string()
    .min(8)
    .max(400)
    .describe("1-2 sentences on brand voice consistency across About + announcement + listings."),
});

// ─── Tool-to-schema mapping ──────────────────────────────────────────────────

export const TOOL_INPUT_SCHEMA = {
  TAG_GENERATOR: tagGeneratorInput,
  TITLE_GENERATOR: titleGeneratorInput,
  KEYWORD_GENERATOR: keywordGeneratorInput,
  DESCRIPTION_GENERATOR: descriptionGeneratorInput,
  LISTING_ANALYZER: listingAnalyzerInput,
  SHOP_ANALYZER: shopAnalyzerInput,
} as const;

export const TOOL_OUTPUT_SCHEMA = {
  TAG_GENERATOR: tagGeneratorOutput,
  TITLE_GENERATOR: titleGeneratorOutput,
  KEYWORD_GENERATOR: keywordGeneratorOutput,
  DESCRIPTION_GENERATOR: descriptionGeneratorOutput,
  LISTING_ANALYZER: listingAnalyzerOutput,
  SHOP_ANALYZER: shopAnalyzerOutput,
} as const;

/** Per-tool request timeout (ms). Generators are quick, analyzers may take 30-60s. */
export const TOOL_TIMEOUT_MS: Record<Tool, number> = {
  TAG_GENERATOR: 30_000,
  TITLE_GENERATOR: 30_000,
  KEYWORD_GENERATOR: 45_000,
  DESCRIPTION_GENERATOR: 30_000,
  LISTING_ANALYZER: 90_000,
  SHOP_ANALYZER: 90_000,
};

export type GeneratorTool = keyof typeof TOOL_INPUT_SCHEMA;

export const GENERATOR_TOOLS: GeneratorTool[] = [
  "TAG_GENERATOR",
  "TITLE_GENERATOR",
  "KEYWORD_GENERATOR",
  "DESCRIPTION_GENERATOR",
];

/** Slug used in URLs and Prisma `Tool` enum mapping. */
export const TOOL_SLUG_TO_ENUM: Record<string, Tool> = {
  "tag-generator": "TAG_GENERATOR",
  "title-generator": "TITLE_GENERATOR",
  "keyword-generator": "KEYWORD_GENERATOR",
  "description-generator": "DESCRIPTION_GENERATOR",
  "listing-analyzer": "LISTING_ANALYZER",
  "shop-analyzer": "SHOP_ANALYZER",
};

export const TOOL_ENUM_TO_SLUG: Record<Tool, string> = Object.fromEntries(
  Object.entries(TOOL_SLUG_TO_ENUM).map(([slug, e]) => [e, slug]),
) as Record<Tool, string>;

export const CREDIT_COST: Record<Tool, number> = {
  TAG_GENERATOR: 1,
  TITLE_GENERATOR: 1,
  KEYWORD_GENERATOR: 2,
  DESCRIPTION_GENERATOR: 3,
  LISTING_ANALYZER: 5,
  SHOP_ANALYZER: 8,
};

/** Tools where MAX-tier subscribers get the premium model. */
export const MAX_BOOST_TOOLS: Tool[] = ["LISTING_ANALYZER", "SHOP_ANALYZER"];

/** Premium model spec for MAX-tier subscribers on analyzer tools. */
export const MAX_BOOST_MODEL = {
  provider: "ANTHROPIC" as const,
  model: "claude-sonnet-4-6",
};

/** User-facing prompt sent alongside the system prompt. Tool-specific shaping. */
export function buildUserPrompt(tool: Tool, input: unknown): string {
  switch (tool) {
    case "TAG_GENERATOR": {
      const i = tagGeneratorInput.parse(input);
      return [
        `Product title: ${i.productTitle}`,
        i.productDetails ? `Details: ${i.productDetails}` : null,
        "Generate exactly 13 Etsy tags. Each must be 2-3 words and <=20 characters. No duplicate words across tags. No words already in the title.",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "TITLE_GENERATOR": {
      const i = titleGeneratorInput.parse(input);
      return [
        `Product description: ${i.productDescription}`,
        i.attributes?.length ? `Attributes: ${i.attributes.join(", ")}` : null,
        "Generate exactly 5 Etsy listing titles. Each <=140 characters, keyword-front-loaded in the first 60 characters, comma-separated phrases.",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "KEYWORD_GENERATOR": {
      const i = keywordGeneratorInput.parse(input);
      return [
        `Seed keyword: ${i.seed}`,
        i.niche ? `Niche: ${i.niche}` : null,
        "Generate exactly 30 long-tail Etsy keywords (2-5 words each). Score each by buyer intent: high (clear purchase intent), medium (browsing), or low (informational).",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "DESCRIPTION_GENERATOR": {
      const i = descriptionGeneratorInput.parse(input);
      return [
        `Tone: ${i.tone}`,
        `Product bullets:\n- ${i.productBullets.join("\n- ")}`,
        "Write an Etsy listing description, 180-280 words. Open with a first-line hook describing appeal (not features). Then bullets for features. End with a soft CTA.",
      ].join("\n\n");
    }
    case "LISTING_ANALYZER": {
      const i = listingAnalyzerInput.parse(input);
      return [
        "Audit the following Etsy listing across five axes (title SEO, tag relevance, description quality, photo coverage, attributes). Score each axis 0-100, explain the score, and list 1-3 specific fixes. Then surface 3 top wins, 3 top fixes ordered by ROI, and 1 quick win.",
        "",
        `Title: ${i.title}`,
        `Tags (${i.tags.length}/13): ${i.tags.join(", ") || "(none provided)"}`,
        i.attributes?.length ? `Attributes: ${i.attributes.join(", ")}` : null,
        i.priceUsd != null ? `Price: $${i.priceUsd.toFixed(2)} USD` : null,
        i.photoCount != null ? `Photos: ${i.photoCount}/10` : null,
        i.category ? `Category: ${i.category}` : null,
        "",
        `Description:\n${i.description}`,
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "SHOP_ANALYZER": {
      const i = shopAnalyzerInput.parse(input);
      return [
        "Audit this Etsy shop across five pillars (branding, SEO, conversion, policy, diversity). Score each pillar 0-100 and explain. Then surface 3 strengths, 3 prioritized fixes, and notes on brand-voice consistency between About, announcement, and listings.",
        "",
        `Shop: ${i.shopName}`,
        i.niche ? `Niche: ${i.niche}` : null,
        `Listings: ${i.listingCount}`,
        i.reviewCount != null ? `Reviews: ${i.reviewCount}` : null,
        "",
        `About:\n${i.about}`,
        i.announcement ? `\nAnnouncement:\n${i.announcement}` : null,
        i.topListingsText ? `\nTop listings (titles):\n${i.topListingsText}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    }
    default:
      throw new Error(`buildUserPrompt: unsupported tool ${tool}`);
  }
}
