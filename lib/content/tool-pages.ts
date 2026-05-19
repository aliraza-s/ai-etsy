import type { LucideIcon } from "lucide-react";
import { Tag, Sparkles, Zap, ShieldCheck, TrendingUp, Layers, Pencil } from "lucide-react";
import type { ToolSlug } from "./tools";

export interface Citation {
  source: string;
  href?: string;
}

export interface ToolPageContent {
  /** Hero TL;DR (≤ 50 words) — AIO/GEO direct-answer capture. */
  tldr: string;

  /** First-line meta description (≤ 155 chars). */
  metaDescription: string;

  /** "What is [tool]?" definition block. */
  definition: {
    heading: string;
    /** Plain prose definition. First sentence is the direct answer. */
    body: string;
    stats: { value: string; label: string; citation?: Citation }[];
  };

  /** "Who it's for" persona cards. */
  personas: { title: string; body: string }[];

  /** 3 steps for the HowItWorks block. */
  steps: { title: string; body: string }[];

  /** Before / After example. */
  example: {
    before: { label: string; lines: string[] };
    after: { label: string; lines: string[] };
  };

  /** 4–6 features. */
  features: { icon: LucideIcon; title: string; body: string }[];

  /** Comparison-table rows. Columns are: feature | this tool | manual | other generic tool. */
  comparison: {
    rows: { feature: string; values: (boolean | string)[] }[];
  };

  /** 8–12 FAQ items. */
  faq: { q: string; a: string }[];
}

/**
 * Per-tool marketing content. We fill out the full registry incrementally.
 * Pages whose content is `null` here fall back to a minimal template.
 */
export const TOOL_PAGES: Partial<Record<ToolSlug, ToolPageContent>> = {
  "tag-generator": {
    tldr: "An Etsy tag generator fills all 13 tag slots with multi-word phrases that match real buyer searches. Craftly's runs on Qwen 7B, returns results in under 5 seconds, and ranks each tag by intent so you copy the strongest ones first.",
    metaDescription:
      "Free Etsy tag generator that fills all 13 tag slots with high-search, low-competition multi-word phrases in under 5 seconds. AI-powered, no API.",

    definition: {
      heading: "What is an Etsy tag generator?",
      body: "An Etsy tag generator is software that suggests multi-word phrases to place in your listing's 13 tag slots. Tags are one of Etsy's top three ranking signals — they help match your listing to buyer searches. A good generator considers Etsy's 20-character tag limit, prefers long-tail phrases over single words, and avoids duplicating words already in your title (which Etsy treats as the same signal).",
      stats: [
        {
          value: "13",
          label: "Tag slots per listing",
          citation: { source: "Etsy Seller Handbook" },
        },
        {
          value: "20",
          label: "Max characters per tag",
          citation: { source: "Etsy Seller Handbook" },
        },
        { value: "<5s", label: "Average generation time" },
      ],
    },

    personas: [
      {
        title: "New sellers stuck on what to tag",
        body: "You know your product, but staring at 13 empty slots and 20 characters each feels like a puzzle. Paste your title and let the generator do the searching.",
      },
      {
        title: "Veteran sellers refreshing old listings",
        body: "Your tags are 3 years old. Buyer search habits changed. Bulk-refresh tags across your top listings without rewriting from scratch.",
      },
      {
        title: "Multi-shop sellers scaling up",
        body: "Tagging 200 listings by hand isn't a workflow, it's a punishment. Generate, copy, paste, repeat — in seconds per listing.",
      },
    ],

    steps: [
      {
        title: "Paste your product title or short description",
        body: 'Drop in the basics: "hand-poured soy candle, vanilla scent, 8oz tin". No URL, no API, no scraping.',
      },
      {
        title: "AI generates 13 tags ranked by intent",
        body: "Qwen 7B produces 13 multi-word phrases under 20 characters each, all distinct from your title.",
      },
      {
        title: "Copy the top tags into Etsy",
        body: "Click to copy any tag. Refresh for a new batch if you'd like alternatives. Save the generation to your history for later.",
      },
    ],

    example: {
      before: {
        label: "Your input",
        lines: ["hand-poured soy candle", "vanilla scent", "8oz tin"],
      },
      after: {
        label: "13 generated tags",
        lines: [
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
          "bridesmaid gift idea",
          "self care gift",
          "non toxic candle",
        ],
      },
    },

    features: [
      {
        icon: Tag,
        title: "All 13 slots, every time",
        body: "Etsy weights each tag slot equally. Empty slots are wasted ranking signal — we always fill 13.",
      },
      {
        icon: Sparkles,
        title: "Multi-word phrases by default",
        body: "Single-word tags compete with millions of listings. Long-tail phrases capture real buyer queries.",
      },
      {
        icon: Zap,
        title: "Under 5 seconds per batch",
        body: "Qwen 7B is fast. You won't even open another tab.",
      },
      {
        icon: TrendingUp,
        title: "Title-aware, not duplicative",
        body: "Etsy ignores tag-word overlap with your title. The generator de-dupes automatically.",
      },
      {
        icon: ShieldCheck,
        title: "Within Etsy's 20-char tag limit",
        body: "No truncation surprises. Every tag fits.",
      },
      {
        icon: Layers,
        title: "Save and refresh batches",
        body: "Pin generations to your history, or refresh for an alternative batch.",
      },
    ],

    comparison: {
      rows: [
        { feature: "Fills 13 tags in one click", values: [true, false, true] },
        { feature: "Multi-word phrases", values: [true, "manual", "mixed"] },
        { feature: "Title-aware deduplication", values: [true, false, false] },
        { feature: "Sub-5-second results", values: [true, "—", "varies"] },
        { feature: "Etsy-specific (20-char limit aware)", values: [true, true, false] },
        { feature: "Free plan available", values: ["15 credits/mo", "—", "varies"] },
        { feature: "No Etsy API or scraping", values: [true, true, "varies"] },
      ],
    },

    faq: [
      {
        q: "How many tags can you use on Etsy?",
        a: "Etsy allows up to 13 tags per listing. Each tag can be up to 20 characters and should ideally be a multi-word phrase. Empty tag slots are wasted ranking signal, so Craftly's Tag Generator always returns 13.",
      },
      {
        q: "Do Etsy tags still matter in 2026?",
        a: "Yes. Tags remain one of the top three signals Etsy uses to match listings to searches (alongside title and listing attributes). Etsy's own Seller Handbook recommends filling all 13 slots with descriptive, multi-word phrases.",
      },
      {
        q: "What are the best tags for an Etsy listing?",
        a: "The best Etsy tags are multi-word phrases (2–3 words) that buyers actually search for, fit within the 20-character limit, and don't duplicate words already in your title. They should balance high-volume head terms with long-tail buyer-intent phrases.",
      },
      {
        q: "Should Etsy tags match the title?",
        a: "Not directly — Etsy treats title words and tag words as the same ranking signal, so duplicating wastes a slot. Tags should expand on the title by covering synonyms, gift occasions, materials, styles, and use cases.",
      },
      {
        q: "How often should I update Etsy tags?",
        a: "Refresh tags whenever a listing's traffic drops noticeably, when seasonal demand shifts (Q4, Valentine's, Mother's Day), or every 60–90 days as a baseline hygiene practice. Etsy's Seller Handbook suggests \"freshness\" itself can lift visibility.",
      },
      {
        q: "What's the difference between tags and attributes on Etsy?",
        a: "Attributes are fixed selections from Etsy's dropdowns (color, occasion, holiday, material) — they're separate from tags and don't share the 13-tag limit. Tags are your free-form keyword phrases. Both are ranking signals; both should be filled.",
      },
      {
        q: "Are AI-generated Etsy tags safe to use?",
        a: "Yes. Etsy's policies don't restrict using software to generate suggestions — they govern what you sell, not how you optimize listings. You remain in full control of which tags you copy into your listing.",
      },
      {
        q: "Why does Craftly cost 1 credit per generation?",
        a: "Each generation runs on the Qwen 7B model via OpenRouter, which has a per-call cost. We pass that through transparently: 1 credit covers one full 13-tag batch. The free plan includes 15 credits/month — enough to refresh 15 listings.",
      },
      {
        q: "Can I see the prompt used to generate tags?",
        a: "The system prompt and model are visible in your Admin AI-Config panel (admin users) or documented in our changelog (everyone). We deliberately keep the prompt transparent so you understand exactly what shapes the output.",
      },
    ],
  },

  // Other 7 tools — content filled in Wave 2.
};

/** Fallback content for tools whose marketing page is still TBD. */
export function fallbackToolContent(toolName: string): ToolPageContent {
  return {
    tldr: `${toolName} marketing content coming soon. The tool itself is on its way in a later phase.`,
    metaDescription: `${toolName} — coming soon. AI-powered Etsy seller tool.`,
    definition: {
      heading: `What is the ${toolName}?`,
      body: `Detailed content for the ${toolName} marketing page is coming in the next content sprint. The tool will be paste-based, AI-powered, and built specifically for Etsy sellers.`,
      stats: [
        { value: "Soon", label: "Marketing page complete" },
        { value: "Soon", label: "Live tool" },
        { value: "8", label: "Total tools planned" },
      ],
    },
    personas: [
      { title: "Etsy sellers of all sizes", body: "From your first listing to your thousandth." },
      {
        title: "Side-hustlers and full-timers",
        body: "Optimization shouldn't require an SEO degree.",
      },
      { title: "Multi-shop owners", body: "Scale your workflow without scaling your headaches." },
    ],
    steps: [
      { title: "Paste your input", body: "Listing, shop URL, or short description." },
      { title: "AI processes it", body: "Powered by Claude or Qwen." },
      { title: "Copy results to Etsy", body: "Save to history if you want them later." },
    ],
    example: {
      before: { label: "Input", lines: ["Coming soon"] },
      after: { label: "Output", lines: ["Coming soon"] },
    },
    features: [
      { icon: Sparkles, title: "AI-powered", body: "Real LLMs, not regex." },
      { icon: Zap, title: "Fast", body: "Results in seconds." },
      { icon: ShieldCheck, title: "Private", body: "No Etsy API, no scraping." },
      { icon: Pencil, title: "Paste-based", body: "Copy in, copy out." },
    ],
    comparison: {
      rows: [
        { feature: "AI-powered", values: [true, false, true] },
        { feature: "Etsy-specific", values: [true, true, false] },
        { feature: "Paste-based (no API)", values: [true, true, "varies"] },
      ],
    },
    faq: [
      {
        q: `When will the ${toolName} ship?`,
        a: "The marketing page is in our content sprint queue. The live tool comes online in the AI-router phase. Watch the changelog.",
      },
      {
        q: "Will I be charged for it?",
        a: "It runs on the same credit system as other Craftly tools. Free plan includes 15 credits/month.",
      },
    ],
  };
}
