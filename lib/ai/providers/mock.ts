import type { AIProvider } from "@prisma/client";
import type { LanguageModelV2, LanguageModelV2StreamPart } from "@ai-sdk/provider";

/**
 * Mock model for local development.
 *
 * Bypasses the network entirely. Returns deterministic JSON tuned per tool,
 * so the UI can be exercised without burning real API calls. Activated by
 * setting `MOCK_AI=true` in `.env.local`.
 */
export function createMockModel(provider: AIProvider, model: string): LanguageModelV2 {
  return {
    specificationVersion: "v2",
    provider: `mock-${provider.toLowerCase()}`,
    modelId: model,
    supportedUrls: {},

    async doGenerate({ prompt }) {
      const text = pickMockResponse(prompt);
      return {
        content: [{ type: "text", text }],
        finishReason: "stop",
        usage: { inputTokens: 100, outputTokens: 200, totalTokens: 300 },
        warnings: [],
        request: {},
        response: { id: `mock-${Date.now()}`, timestamp: new Date(), modelId: model },
      };
    },

    async doStream({ prompt }) {
      const text = pickMockResponse(prompt);
      const stream = new ReadableStream<LanguageModelV2StreamPart>({
        start(controller) {
          controller.enqueue({ type: "stream-start", warnings: [] });
          controller.enqueue({ type: "text-start", id: "1" });
          for (const chunk of chunkText(text, 32)) {
            controller.enqueue({ type: "text-delta", id: "1", delta: chunk });
          }
          controller.enqueue({ type: "text-end", id: "1" });
          controller.enqueue({
            type: "finish",
            finishReason: "stop",
            usage: { inputTokens: 100, outputTokens: 200, totalTokens: 300 },
          });
          controller.close();
        },
      });
      return { stream, request: {}, response: {} };
    },
  };
}

function chunkText(text: string, size: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

function pickMockResponse(prompt: unknown): string {
  const promptStr = JSON.stringify(prompt).toLowerCase();

  if (promptStr.includes("13 etsy tags") || promptStr.includes("tag generator")) {
    return JSON.stringify({
      tags: [
        "soy wax candle",
        "vanilla scented",
        "small batch candle",
        "natural soy candle",
        "8oz candle tin",
        "hand poured gift",
        "vanilla home decor",
        "vegan candle gift",
        "cozy home scent",
        "housewarming gift",
        "bridesmaid gift",
        "self care gift",
        "non toxic candle",
      ],
    });
  }

  if (promptStr.includes("5 etsy listing titles") || promptStr.includes("title generator")) {
    return JSON.stringify({
      titles: [
        "Chunky Knit Wool Throw Blanket, 100% Merino, 60x80 Cozy Bed Throw, Hand Knit Housewarming Gift",
        "Hand Knit Merino Wool Throw, Chunky Knit Blanket 60x80, Soft Wool Bed Throw, Cozy Living Decor",
        "Merino Wool Chunky Knit Throw, 60x80 Wool Bed Blanket, Hand Knit Cozy Throw, Housewarming Gift",
        "Chunky Wool Throw Blanket, Hand Knit 100% Merino, 60x80 Bed Throw, Cozy Living Room Decor",
        "Hand Knit Chunky Throw, Merino Wool 60x80, Cozy Bed Throw Blanket, Soft Living Room Decor Gift",
      ],
    });
  }

  if (promptStr.includes("30 long-tail") || promptStr.includes("keyword generator")) {
    const phrases = [
      "vanilla soy candle",
      "soy candle housewarming gift",
      "non toxic soy candle",
      "hand poured candle gift",
      "small batch candle",
      "natural soy candle",
      "vegan candle gift",
      "amber jar candle",
      "cozy fall candle",
      "minimalist candle decor",
      "candle subscription box",
      "candle in glass jar",
      "candle for bridesmaids",
      "candle for housewarming",
      "candle gift set",
      "lavender candle",
      "vanilla scented candle",
      "rustic farmhouse candle",
      "boho home candle",
      "tea light candle",
      "scented candle gift",
      "personalized candle",
      "wedding favor candle",
      "anniversary candle",
      "self care candle",
      "spa candle gift",
      "luxury soy candle",
      "long burn candle",
      "clean burn candle",
      "essential oil candle",
    ];
    const intents = ["high", "medium", "low"] as const;
    return JSON.stringify({
      keywords: phrases.map((phrase, i) => ({ phrase, intent: intents[i % 3] })),
    });
  }

  if (
    promptStr.includes("audit the following etsy listing") ||
    promptStr.includes("listing analyzer")
  ) {
    return JSON.stringify({
      score: 64,
      axes: {
        titleSeo: {
          score: 58,
          why: "Title is 72 characters and front-loads the primary keyword, but lacks 2-3 secondary phrases that buyers commonly search for in this niche.",
          fixes: [
            "Expand to 110-140 characters with comma-separated secondary phrases.",
            "Add a gift-occasion phrase (e.g., 'housewarming gift').",
          ],
        },
        tagRelevance: {
          score: 71,
          why: "Tags fill 11 of 13 slots and most are multi-word, but two duplicate words already in the title.",
          fixes: [
            "Fill the last two empty slots with long-tail gift phrases.",
            "Replace duplicated-word tags with synonyms (e.g., 'cozy', 'cottage').",
          ],
        },
        descriptionQuality: {
          score: 62,
          why: "Has a first-line hook but the middle is wall-of-text. No bullets, no shipping callout, weak CTA.",
          fixes: [
            "Restructure 4-5 features as bullets.",
            "Add a 1-sentence shipping/processing line.",
            "End with a soft CTA ('message me for custom orders').",
          ],
        },
        photoCoverage: {
          score: 55,
          why: "Only 4 of 10 photo slots used; missing scale shot, lifestyle shot, and back/detail.",
          fixes: ["Add a scale-reference photo.", "Add a lifestyle / in-context shot."],
        },
        attributes: {
          score: 78,
          why: "Most key attributes filled, but 'occasion' is empty and several buyers filter by it.",
          fixes: ["Set occasion to the highest-relevance value ('housewarming' or 'wedding')."],
        },
      },
      topWins: [
        "Primary keyword front-loaded in the first 60 chars of the title.",
        "Tags are mostly multi-word, not single-word noise.",
        "First-line description hook actually conveys appeal.",
      ],
      topFixes: [
        "Restructure description with bullets + shipping line + soft CTA.",
        "Expand title to 110-140 chars with secondary keyword phrases.",
        "Add 2-3 more photos (scale shot, lifestyle, detail).",
      ],
      quickWin:
        "Fill the two remaining tag slots with long-tail gift phrases — takes 30 seconds and lifts visibility immediately.",
    });
  }

  if (promptStr.includes("audit this etsy shop") || promptStr.includes("shop analyzer")) {
    return JSON.stringify({
      overallScore: 58,
      pillars: {
        branding: {
          score: 52,
          why: "About is short and lacks a founder story. Announcement is empty. Banner is the Etsy default.",
        },
        seo: {
          score: 66,
          why: "Most listings have multi-word tags and reasonable titles, but title strategy varies — no consistent keyword pattern across listings.",
        },
        conversion: {
          score: 49,
          why: "Low review count (8) for shop age; no shop policies visible; weak shop announcement reduces buyer trust.",
        },
        policy: {
          score: 38,
          why: "Shipping and return policies are at default. International shipping unclear. No processing-time note.",
        },
        diversity: {
          score: 71,
          why: "23 listings spread across a reasonable niche range; tight enough that Etsy categorizes the shop confidently.",
        },
      },
      topWins: [
        "Tight niche focus — Etsy can confidently categorize this shop.",
        "Multi-word tags used consistently across listings.",
        "Photo aesthetic is consistent (warm light, neutral backgrounds).",
      ],
      topFixes: [
        "Expand About to 200+ words with a founder story and niche statement.",
        "Fill shipping, return, and processing-time policies (highest-leverage conversion fix).",
        "Add a shop announcement with current shipping timing and a sentence on what makes the shop special.",
      ],
      brandVoiceNotes:
        "Brand voice is barely established — the About section is too thin to set a tone, and the announcement is empty so listings carry the entire voice load. Once About expands, voice can ladder up across announcement and listings.",
    });
  }

  if (
    promptStr.includes("etsy listing description") ||
    promptStr.includes("description generator")
  ) {
    return JSON.stringify({
      description:
        "Lavender and warm vanilla, hand-poured in 8oz amber glass — your evenings just got cozier.\n\n→ 100% soy wax, no paraffin or additives\n→ 40-hour burn time on a clean cotton wick\n→ 8oz amber glass jar, reusable after the candle finishes\n→ Hand-poured in small batches in our home studio\n→ Made in the United States\n\nMost candles arrive within 3-5 business days. Free U.S. shipping on orders over $35.\n\nIf you need a custom scent for an event or favor, just message us — we love getting creative.",
    });
  }

  return JSON.stringify({ error: "mock_no_match", promptPreview: promptStr.slice(0, 200) });
}
