import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Award,
  BarChart3,
  Calculator,
  CalendarDays,
  Compass,
  DollarSign,
  FileText,
  Gift,
  Globe,
  Heading1,
  Layers,
  ListChecks,
  Pencil,
  PieChart,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Tag,
  Target,
  TrendingUp,
  Truck,
  Wand2,
  Zap,
} from "lucide-react";
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

  "title-generator": {
    tldr: "An Etsy title generator writes SEO-optimized listing titles under Etsy's 140-character limit with the primary keyword front-loaded. Craftly's runs on Qwen 7B and returns five distinct variations in under 8 seconds — pick one, copy, paste.",
    metaDescription:
      "Etsy title generator that writes 5 SEO-optimized titles per listing, each under 140 characters with front-loaded keywords. AI-powered. Free plan available.",
    definition: {
      heading: "What is an Etsy title generator?",
      body: "An Etsy title generator is software that writes SEO-optimized titles for Etsy listings within Etsy's 140-character limit. The best generators front-load the primary keyword (Etsy weights the first 60 characters heaviest), use comma-separated keyword phrases that mirror how buyers search, and avoid keyword stuffing. Craftly returns five title variations per generation so you can A/B test what works.",
      stats: [
        {
          value: "140",
          label: "Max title characters",
          citation: { source: "Etsy Seller Handbook" },
        },
        {
          value: "60",
          label: "First chars Etsy weights most",
          citation: { source: "Etsy Seller Handbook" },
        },
        { value: "5", label: "Variations per generation" },
      ],
    },
    personas: [
      {
        title: "Sellers stuck rewriting the same title",
        body: "You've rewritten this title eight times. Move on. Generate five fresh options in seconds.",
      },
      {
        title: "Sellers launching new products",
        body: "Every new listing needs a title. Drafting from scratch is slow. Generate, pick, polish.",
      },
      {
        title: "Power sellers managing 100+ listings",
        body: "Title hygiene across your shop matters. Bulk-regen during seasonal shifts.",
      },
    ],
    steps: [
      {
        title: "Paste your product details",
        body: "A short description or your current title. Mention the key attribute — color, material, occasion, size.",
      },
      {
        title: "AI generates 5 title variations",
        body: "Each under 140 chars, keyword-front-loaded, comma-separated. Five different angles.",
      },
      {
        title: "Pick your favorite and paste into Etsy",
        body: "Click to copy. Save the batch to history. Try another variant if traffic stalls later.",
      },
    ],
    example: {
      before: {
        label: "Your input",
        lines: [
          "wool throw blanket",
          "chunky knit, 100% merino",
          "60x80 inches",
          "housewarming gift",
        ],
      },
      after: {
        label: "5 generated titles (1 shown)",
        lines: [
          "Chunky Knit Wool Throw Blanket, 100% Merino Wool, 60x80 Inch Hand Knit Blanket, Cozy Bed Throw, Housewarming Gift",
          "Hand Knit Merino Wool Throw, Chunky Knit Blanket 60x80, Soft Wool Bed Throw, Cozy Living Room Decor",
          "Merino Wool Chunky Knit Throw, 60x80 Wool Bed Blanket, Hand Knit Cozy Throw, Housewarming Gift Idea",
          "Chunky Wool Throw Blanket, Hand Knit 100% Merino, 60x80 Bed Throw, Cozy Living Room Decor",
          "Hand Knit Chunky Throw, Merino Wool 60x80, Cozy Bed Throw Blanket, Soft Living Room Decor Gift",
        ],
      },
    },
    features: [
      {
        icon: Heading1,
        title: "140 chars, never overflow",
        body: "Strict character-count enforcement. No truncation in Etsy search-result previews.",
      },
      {
        icon: Wand2,
        title: "Primary keyword in first 60 chars",
        body: "Etsy weights the start of the title most. We front-load — every variation.",
      },
      {
        icon: Sparkles,
        title: "5 variations per run",
        body: "Different angles, different phrasings. Pick the one that fits your voice.",
      },
      {
        icon: TrendingUp,
        title: "Etsy-comma syntax",
        body: "Phrases separated by commas — the format Etsy's algorithm parses best.",
      },
      {
        icon: ShieldCheck,
        title: "No keyword stuffing",
        body: "Repeating words is a ranking penalty. The generator dedupes automatically.",
      },
      {
        icon: Layers,
        title: "Save and revise later",
        body: "Pin variants to history. Refresh for a new batch when seasonal demand shifts.",
      },
    ],
    comparison: {
      rows: [
        { feature: "Under 140 chars guaranteed", values: [true, "manual", "mixed"] },
        { feature: "Keyword in first 60 chars", values: [true, "manual", false] },
        { feature: "5 distinct variations", values: [true, false, true] },
        { feature: "Comma-separated phrasing", values: [true, true, "mixed"] },
        { feature: "No keyword stuffing", values: [true, "manual", false] },
        { feature: "Etsy-specific (not generic SEO)", values: [true, true, false] },
        { feature: "Free plan available", values: ["15 credits/mo", "—", "varies"] },
      ],
    },
    faq: [
      {
        q: "How long should an Etsy title be?",
        a: "Etsy allows up to 140 characters. The first 60 characters carry the most weight in Etsy's search algorithm, so primary keywords should appear early. Most strong-performing listings use 110–140 characters to maximize searchable terms without diluting the keyword signal.",
      },
      {
        q: "What makes a good Etsy title?",
        a: "A good Etsy title front-loads the primary keyword in the first 60 characters, uses comma-separated phrases (which Etsy parses as individual search signals), avoids repeating words from tags, and reads naturally to humans. The best titles balance SEO with buyer-friendly language.",
      },
      {
        q: "How do I write Etsy titles that rank?",
        a: "Start with the buyer search query (e.g., 'chunky knit blanket'). Front-load it. Follow with material, size, attribute, and occasion phrases separated by commas. Don't stuff keywords. Don't repeat words. Aim for 110–140 characters.",
      },
      {
        q: "Should Etsy titles match the tags?",
        a: "No. Etsy treats title and tag words as a single ranking signal — duplicating wastes one of your 13 tag slots. Use tags to cover synonyms, gift occasions, and attributes the title doesn't mention.",
      },
      {
        q: "Does the first word of an Etsy title matter?",
        a: "Yes. The first 60 characters get the most ranking weight, and Etsy search results truncate at ~60–70 chars on mobile. The first word should be a buyer-relevant keyword — not 'Handmade' or your shop name.",
      },
      {
        q: "How often should I update Etsy titles?",
        a: "Refresh titles when traffic drops noticeably, when seasonal demand shifts (Valentine's, Mother's Day, Q4), or every 90 days as baseline hygiene. Etsy rewards listing freshness.",
      },
      {
        q: "Can I use punctuation or emojis in Etsy titles?",
        a: "Commas are fine and recommended (Etsy parses them as separators). Avoid emojis, brackets, slashes, and ALL CAPS — they hurt clickthrough and some get filtered. Pipes (|) and dashes (-) are OK but less indexable than commas.",
      },
      {
        q: "Why does Craftly cost 1 credit per generation?",
        a: "Each generation runs on Qwen 7B via OpenRouter, which has a per-call cost. We pass that through transparently: 1 credit = one 5-variation batch. The free plan includes 15 credits/month.",
      },
    ],
  },

  "keyword-generator": {
    tldr: "An Etsy keyword generator surfaces long-tail phrases buyers actually type into Etsy search, scored by buyer intent (high / medium / low). Craftly's runs on Qwen 32B, returns 30 keywords per seed, and surfaces where intent is highest so you optimize for searches that actually convert.",
    metaDescription:
      "Etsy keyword generator that produces 30 long-tail keywords per seed, ranked by buyer intent. AI-powered by Qwen 32B. Free plan available.",
    definition: {
      heading: "What is an Etsy keyword generator?",
      body: "An Etsy keyword generator is a research tool that takes a seed term (your product type or niche) and outputs phrases buyers actually search for. Unlike generic keyword tools that pull from Google data, Etsy-specific generators model how buyers shop on Etsy: more long-tail, more intent-driven, more gift- and occasion-themed. Craftly's tool surfaces 30 keywords per seed and tags each with buyer-intent strength.",
      stats: [
        { value: "30", label: "Keywords per seed" },
        { value: "3", label: "Intent tiers (high / med / low)" },
        { value: "<10s", label: "Average generation time" },
      ],
    },
    personas: [
      {
        title: "Sellers researching a new niche",
        body: "Before listing your first product in a niche, know what buyers actually search for.",
      },
      {
        title: "Sellers expanding product lines",
        body: "You sell candles. What about wax melts? Reed diffusers? Find adjacent keywords with real demand.",
      },
      {
        title: "Sellers preparing for Q4",
        body: "Seasonal keywords shift fast. Generate fresh keyword pools for holiday-themed listings.",
      },
    ],
    steps: [
      {
        title: "Enter a seed keyword",
        body: "Your product type, niche, or even a competing tag (e.g., 'soy candle', 'boho jewelry').",
      },
      {
        title: "AI surfaces 30 long-tail phrases",
        body: "Each scored by buyer intent. Long-tail captures niche buyers who actually convert.",
      },
      {
        title: "Use the high-intent ones in tags and titles",
        body: "Copy individual keywords or pipe the list through the Tag Generator for one-click tags.",
      },
    ],
    example: {
      before: { label: "Input", lines: ["soy candle"] },
      after: {
        label: "30 long-tail keywords (5 shown)",
        lines: [
          "vanilla soy candle (high)",
          "soy candle housewarming gift (high)",
          "non toxic soy candle (high)",
          "soy candle subscription box (medium)",
          "soy candle in glass jar (medium)",
        ],
      },
    },
    features: [
      {
        icon: Search,
        title: "30 keywords per seed",
        body: "More variety than you can use. Pick the strongest, save the rest for next refresh.",
      },
      {
        icon: Target,
        title: "Buyer-intent scoring",
        body: "Each keyword tagged high / medium / low intent — focus on the converters.",
      },
      {
        icon: TrendingUp,
        title: "Long-tail by default",
        body: "Single-word keywords are noise. Long-tail captures buyers with real intent.",
      },
      {
        icon: BarChart3,
        title: "Etsy-search-modeled",
        body: "Trained on how buyers actually search on Etsy — not generic Google data.",
      },
      {
        icon: Layers,
        title: "Pipe into other tools",
        body: "Save the pool, then feed it into the Tag Generator for one-click batch tags.",
      },
      {
        icon: ShieldCheck,
        title: "No scraping",
        body: "We don't scrape etsy.com. AI generates from learned patterns — your shop stays safe.",
      },
    ],
    comparison: {
      rows: [
        { feature: "30 keywords per seed", values: [true, "manual", "varies"] },
        { feature: "Buyer-intent scoring", values: [true, false, false] },
        { feature: "Long-tail focused", values: [true, "manual", "mixed"] },
        { feature: "Etsy-search-modeled (not Google)", values: [true, true, false] },
        { feature: "Under 10 seconds", values: [true, "—", "varies"] },
        { feature: "Free plan available", values: ["15 credits/mo", "—", "varies"] },
      ],
    },
    faq: [
      {
        q: "How do I find the best keywords for Etsy?",
        a: "Start with a seed term that matches your product type, then research adjacent phrases buyers use to find similar items. Look for long-tail (3+ word) keywords with clear buyer intent. Craftly's Keyword Generator automates this in under 10 seconds, producing 30 phrases per seed.",
      },
      {
        q: "What's the best free Etsy keyword tool?",
        a: "Free options include eRank's free tier (limited searches), Marmalead's free tier, and Craftly's Keyword Generator on the free plan (15 credits/month covers ~7 keyword pools). All have different strengths; Craftly's edge is buyer-intent scoring per phrase.",
      },
      {
        q: "How does Etsy search work?",
        a: "Etsy's search algorithm matches buyer queries to listings based on title, tags, attributes, category, listing quality score (clicks, favorites, conversions), shop quality, and shipping/price competitiveness. Keywords in title and tags are the foundational match signal.",
      },
      {
        q: "What keywords sell best on Etsy?",
        a: "Long-tail keywords with clear buyer intent — '4-letter monogram bracelet' beats 'bracelet'. Gift-occasion phrases ('bridesmaid gift', 'housewarming') and personalization keywords ('personalized', 'custom') consistently outperform generic terms.",
      },
      {
        q: "How do I do Etsy SEO in 2026?",
        a: "Etsy SEO in 2026 is still keyword-driven, but listing quality and freshness matter more than ever. Strong fundamentals: front-loaded keyword titles, all 13 tags filled, complete attributes, fast-shipping signals, and regular refreshes every 60–90 days.",
      },
      {
        q: "Do hashtags work on Etsy?",
        a: "No. Etsy doesn't use hashtags as ranking signals — only tags, title, and attributes. Hashtags work on Instagram and Pinterest where you share Etsy listings, but they're invisible to Etsy's own search.",
      },
      {
        q: "What's the difference between Etsy keywords and Google keywords?",
        a: "Etsy keywords skew shorter (1–4 words) and lean heavily on gift, occasion, and personalization phrases. Google keywords can be longer questions ('how to clean a soy candle'). Tools that mix the two over-recommend broad terms that don't perform on Etsy.",
      },
      {
        q: "How many keywords should I use per listing?",
        a: "Etsy gives you 13 tag slots and 140 title characters — about 15–20 distinct keyword phrases total per listing. Spread them across primary and secondary terms; never repeat the same word twice across tags and title.",
      },
    ],
  },

  "description-generator": {
    tldr: "An Etsy description generator writes scannable, hooked, conversion-tuned product copy in one click. Craftly's runs on Qwen 32B, opens with a first-sentence hook, structures features as scannable bullets, and ends with a soft CTA — the format that converts best on Etsy.",
    metaDescription:
      "Etsy description generator that writes scannable, conversion-tuned listings with first-sentence hook, scannable bullets, and soft CTA. AI-powered. Free plan available.",
    definition: {
      heading: "What is an Etsy description generator?",
      body: "An Etsy description generator is software that writes the body copy for your Etsy listing. The best generators open with a hook (the first ~120 characters Etsy may display in search-result previews), structure product details as scannable bullets, address common buyer questions before they arise, and end with a soft call-to-action. Etsy doesn't heavily index description text for search, but it's where conversion happens — vague descriptions kill sales.",
      stats: [
        { value: "180–280", label: "Words per generated description" },
        { value: "3", label: "Tone options" },
        { value: "<15s", label: "Average generation time" },
      ],
    },
    personas: [
      {
        title: "Sellers who hate writing copy",
        body: "You're a maker, not a marketer. Generate, tweak, paste. Move on with your day.",
      },
      {
        title: "Sellers fighting low conversion rates",
        body: "Traffic but no sales? Your photos got them here; weak descriptions are losing them.",
      },
      {
        title: "Multi-shop sellers needing consistent voice",
        body: "Consistent voice across 50+ listings isn't realistic if you write each one by hand.",
      },
    ],
    steps: [
      {
        title: "Paste product details and pick a tone",
        body: "Bullet your key features, materials, sizes, options. Choose friendly, professional, or playful.",
      },
      {
        title: "AI generates a 180–280 word description",
        body: "Hooked opening, scannable bullets, FAQ-style addressing, soft CTA — Etsy's converting format.",
      },
      {
        title: "Tweak and paste into Etsy",
        body: "Copy as plain text or HTML. Save to history for re-use across similar listings.",
      },
    ],
    example: {
      before: {
        label: "Input bullets",
        lines: [
          "hand-poured soy candle",
          "8oz amber glass jar",
          "lavender + vanilla scent",
          "40hr burn time",
          "cotton wick",
        ],
      },
      after: {
        label: "Generated description (excerpt)",
        lines: [
          "Lavender and warm vanilla, hand-poured in 8oz amber glass — your evenings just got cozier.",
          "→ 100% soy wax, no paraffin or additives",
          "→ 40-hour burn time on a clean cotton wick",
          "→ 8oz amber glass jar, reusable after the candle finishes",
          "→ Hand-poured in small batches in our home studio",
          "Most candles arrive within 3-5 business days. Free U.S. shipping on orders $35+.",
        ],
      },
    },
    features: [
      {
        icon: FileText,
        title: "Scannable structure",
        body: "First-sentence hook → bullets → FAQ → soft CTA. The format Etsy buyers skim.",
      },
      {
        icon: Sparkles,
        title: "Tone control",
        body: "Friendly, professional, or playful — matches your shop's voice.",
      },
      {
        icon: Wand2,
        title: "Trained on top-converting copy",
        body: "Patterns learned from descriptions that sell, not generic e-commerce templates.",
      },
      {
        icon: ListChecks,
        title: "Bullets, not walls of text",
        body: "Etsy buyers skim. Bullets keep them in the listing instead of bouncing.",
      },
      {
        icon: ShieldCheck,
        title: "Plain text or HTML output",
        body: "Copy in whichever format your workflow needs.",
      },
      {
        icon: Layers,
        title: "Save to history",
        body: "Re-use winning templates across similar listings without rewriting.",
      },
    ],
    comparison: {
      rows: [
        { feature: "First-sentence hook", values: [true, "manual", "varies"] },
        { feature: "Scannable bullet structure", values: [true, "manual", "mixed"] },
        { feature: "Etsy-buyer-tuned tone", values: [true, true, false] },
        { feature: "Under 15 seconds", values: [true, "—", "varies"] },
        { feature: "Tone control (friendly/pro/playful)", values: [true, true, "varies"] },
        { feature: "Plain-text or HTML output", values: [true, true, "varies"] },
        { feature: "Free plan available", values: ["15 credits/mo", "—", "varies"] },
      ],
    },
    faq: [
      {
        q: "How do I write a good Etsy description?",
        a: "A good Etsy description opens with a hook (Etsy may display the first ~120 chars in search-result previews), structures features as scannable bullets, addresses common buyer questions (sizing, shipping, returns) before they ask, and ends with a soft CTA. Avoid walls of text — buyers skim.",
      },
      {
        q: "What should an Etsy description include?",
        a: "Five things: (1) a first-line hook describing the product's appeal, (2) bulleted features (material, size, options), (3) shipping/processing timeline, (4) return/exchange policy hint, (5) personalization or care instructions if relevant. Keep it scannable.",
      },
      {
        q: "How long should an Etsy description be?",
        a: "180–280 words is the sweet spot. Shorter feels low-effort and hurts conversion; longer loses readers. Etsy doesn't penalize length but buyers skim — the structure matters more than the count.",
      },
      {
        q: "Does Etsy index descriptions for search?",
        a: "Lightly. Etsy primarily uses title, tags, and attributes for search ranking. Descriptions affect conversion (buyers reading the listing) and may contribute marginally to search via context-relevance signals, but tags and titles do the heavy lifting.",
      },
      {
        q: "What should the first sentence of an Etsy description be?",
        a: "A hook describing the product's appeal — the feeling, the use case, the gift moment. 'Lavender and warm vanilla, hand-poured in 8oz amber glass — your evenings just got cozier.' Not 'This candle is made of soy wax.'",
      },
      {
        q: "How do I write descriptions that convert?",
        a: "Lead with appeal, not features. Address common buyer questions before they ask. Use bullets for skimmability. End with a low-pressure CTA ('add to cart' or 'message me for custom orders'). Match your photo's tone.",
      },
      {
        q: "Should I include keywords in my Etsy description?",
        a: "Yes, naturally. Descriptions contribute a small amount to search ranking, and they're indexed for Google (which drives some Etsy traffic). But never keyword-stuff — buyer-friendly copy converts better than SEO-stuffed copy.",
      },
      {
        q: "Can I use ChatGPT for Etsy descriptions instead?",
        a: "You can, but generic ChatGPT defaults to vague e-commerce patterns and rarely uses Etsy-specific conventions (first-line hook, soft CTA, personalization mentions). Craftly's Description Generator is trained on patterns that convert on Etsy specifically.",
      },
    ],
  },

  "listing-analyzer": {
    tldr: "An Etsy listing analyzer audits one of your listings across title SEO, tag relevance, description quality, photo coverage, and attribute completeness — then returns a 0–100 score and prioritized fixes. Craftly's runs on Claude Haiku 4.5 (Sonnet 4.6 on Max) and explains every recommendation.",
    metaDescription:
      "Etsy listing analyzer that audits title, tags, description, photos, and attributes — with a score and prioritized fixes. AI-powered by Claude. Paste-based, no API.",
    definition: {
      heading: "What is an Etsy listing analyzer?",
      body: "An Etsy listing analyzer is an AI-powered audit tool that evaluates one of your listings across the factors Etsy weights for search ranking and conversion: title SEO, tag relevance, description quality, photo coverage, attribute completeness, pricing competitiveness, and policy signals. It returns a score and prioritized fixes, explaining what to change and why. Craftly's analyzer runs on Claude — a model strong enough to actually reason about nuance, not just check boxes.",
      stats: [
        { value: "5+", label: "Axes scored per listing" },
        { value: "0–100", label: "Visibility score range" },
        { value: "<30s", label: "Audit completion time" },
      ],
    },
    personas: [
      {
        title: "Sellers with listings that aren't selling",
        body: "Traffic is fine but conversion isn't — or vice versa. Find out which.",
      },
      {
        title: "Sellers preparing to relaunch old listings",
        body: "Your 2-year-old listing is buried in search. Audit before refreshing — know what to fix.",
      },
      {
        title: "Veterans wanting a second pair of eyes",
        body: "You're too close to your own listings. Get an outside read in 30 seconds.",
      },
    ],
    steps: [
      {
        title: "Paste your listing",
        body: "Title, tags (comma-separated), description, attributes, and price. Photo URLs optional but help.",
      },
      {
        title: "AI audits across 5+ axes",
        body: "Title SEO, tag relevance, description quality, photo coverage, attributes. Claude reasons about each.",
      },
      {
        title: "Get a score plus prioritized fixes",
        body: "Top 3 quick wins. Top 3 deeper fixes. Why each matters and the estimated lift if you apply them.",
      },
    ],
    example: {
      before: {
        label: "Sample audit input",
        lines: [
          "Title: Handmade Soy Candle",
          "Tags: candle, soy, gift, home, decor",
          "Description: A nice candle.",
          "Price: $25",
        ],
      },
      after: {
        label: "Audit output (excerpt)",
        lines: [
          "SCORE: 42 / 100",
          "Top Fix #1: Title is 24 chars; expand to 110–140 with keyword-front-loading.",
          "Top Fix #2: Only 5 tags; fill all 13 slots with multi-word phrases.",
          "Top Fix #3: Description is 4 words; expand to 180–280 with hook + bullets + CTA.",
          "Quick Win: Add 'gift' and 'housewarming' attributes — high-converting buyers filter on these.",
        ],
      },
    },
    features: [
      {
        icon: Stethoscope,
        title: "5+ axis audit",
        body: "Title, tags, description, photos, attributes, pricing — the factors Etsy weights.",
      },
      {
        icon: BarChart3,
        title: "Visibility score 0–100",
        body: "A single number to track listing health over time.",
      },
      {
        icon: AlertCircle,
        title: "Prioritized fixes",
        body: "Top 3 wins, top 3 fixes — not a 50-item list you'll never finish.",
      },
      {
        icon: Wand2,
        title: "Claude-powered reasoning",
        body: "Not regex. Claude actually understands nuance — title cadence, description voice.",
      },
      {
        icon: Sparkles,
        title: "Sonnet on Max tier",
        body: "Max-tier subscribers get Claude Sonnet 4.6 — even deeper, more nuanced analysis.",
      },
      {
        icon: ShieldCheck,
        title: "No Etsy API needed",
        body: "Paste your listing content directly. We never scrape your shop.",
      },
    ],
    comparison: {
      rows: [
        { feature: "AI-reasoned (not checklists)", values: [true, "manual", "mixed"] },
        { feature: "Score + prioritized fixes", values: [true, "manual", false] },
        { feature: "Etsy-specific factors", values: [true, true, false] },
        { feature: "Sonnet 4.6 on Max tier", values: [true, "—", false] },
        { feature: "Under 30 seconds", values: [true, "—", "varies"] },
        { feature: "No Etsy API or scraping", values: [true, true, "varies"] },
        { feature: "Free plan available", values: ["15 credits/mo (3 audits)", "—", "varies"] },
      ],
    },
    faq: [
      {
        q: "Why isn't my Etsy listing selling?",
        a: "Common reasons: weak title SEO (no front-loaded keywords), under-filled tags (<13), thin description, low-contrast photos, missing attributes, uncompetitive pricing, or weak shop signals (low review count, slow shipping). Craftly's Listing Analyzer scores each axis.",
      },
      {
        q: "How do I check my Etsy listing SEO?",
        a: "Paste your listing into Craftly's Listing Analyzer for a 5+ axis AI audit, or manually: check title length (110–140), front-loaded keyword in first 60 chars, 13 filled tags with multi-word phrases, complete attributes, and 180–280 word description with hook and bullets.",
      },
      {
        q: "What makes an Etsy listing rank?",
        a: "Etsy's search algorithm weights query/listing match (title + tags + attributes), listing quality (clicks, favorites, conversions over time), shop quality, and shipping price/speed. Strong fundamentals beat any single 'hack'.",
      },
      {
        q: "How do I improve an Etsy listing?",
        a: "Run a baseline audit (Craftly's Listing Analyzer scores you 0–100). Apply the top 3 prioritized fixes. Re-audit in 30 days to see lift. Most listings have one or two obvious gaps — fix those before chasing micro-optimizations.",
      },
      {
        q: "What is Etsy's listing quality score?",
        a: "Etsy doesn't expose a public 'quality score', but the algorithm internally tracks how listings perform: clicks per impression, favorites, conversions, and review signals. Craftly's analyzer reverse-engineers visibility from public ranking factors.",
      },
      {
        q: "Why is my listing not showing up in Etsy search?",
        a: "Usually one of: title doesn't match buyer search queries, tags are too generic, attributes are missing (Etsy filters by them), or the listing is new/old (Etsy weights freshness). The Listing Analyzer surfaces which.",
      },
      {
        q: "How often should I audit my listings?",
        a: "Audit a listing the day you publish it (catch obvious issues early), again at 30 days (see if it's gaining traction), and at 90 days (refresh if stale). Audit ALL listings before Q4 prep.",
      },
      {
        q: "Why does Craftly cost 5 credits for an analyzer run?",
        a: "Listing audits use Claude Haiku 4.5 (or Sonnet 4.6 on Max), which is more expensive per call than the Qwen models behind the generators. We pass the cost through transparently — 5 credits ≈ one deep audit.",
      },
    ],
  },

  "shop-analyzer": {
    tldr: "An Etsy shop analyzer audits your entire storefront — branding, About section, announcement, banner, listing diversity, conversion signals, and policies — and returns prioritized fixes. Craftly's runs 30+ checks via Claude (Sonnet 4.6 on Max), so the audit reasons about brand voice, not just checkboxes.",
    metaDescription:
      "Etsy shop analyzer that audits 30+ shop-level factors: branding, About, policies, listing diversity, conversion. AI-powered by Claude (Sonnet on Max tier).",
    definition: {
      heading: "What is an Etsy shop analyzer?",
      body: "An Etsy shop analyzer is an audit tool that evaluates your shop as a whole — not individual listings, but the brand, signals, and storefront experience that affect both Etsy ranking and buyer trust. It covers branding consistency, the About section, shop announcements, banners, policies, listing diversity, niche focus, conversion signals (favorites, reviews), and where your shop differentiates. Craftly's runs 30+ such checks with Claude.",
      stats: [
        { value: "30+", label: "Shop-level checks" },
        { value: "5", label: "Pillars (brand/SEO/CVR/policy/diversity)" },
        { value: "<60s", label: "Audit completion time" },
      ],
    },
    personas: [
      {
        title: "New shops with no idea what's missing",
        body: "You set up the shop. Now what? Baseline audit to see what's worth your time first.",
      },
      {
        title: "Shops with traffic but flat sales",
        body: "Your listings rank but buyers bounce. The problem is usually shop-level (about, reviews, policies).",
      },
      {
        title: "Multi-shop sellers consolidating",
        body: "Auditing 5 shops in parallel saves hours of manual review.",
      },
    ],
    steps: [
      {
        title: "Paste your shop URL or shop details",
        body: "About text, announcement, banner description, top listings, policies summary, review count.",
      },
      {
        title: "AI runs 30+ shop-level checks",
        body: "Branding cohesion, voice consistency, policy completeness, listing diversity, conversion signals.",
      },
      {
        title: "Get a multi-pillar score plus prioritized fixes",
        body: "Overall score broken down by pillar. Top 3 quick wins. Top 3 deeper fixes.",
      },
    ],
    example: {
      before: {
        label: "Audit input",
        lines: [
          "Shop: CozyCrafts",
          "About: 'I make candles.'",
          "Announcement: (empty)",
          "Banner: (default)",
          "23 listings · 8 reviews",
        ],
      },
      after: {
        label: "Audit output (excerpt)",
        lines: [
          "OVERALL: 51 / 100",
          "Branding: 38 — About is too thin; no founder story.",
          "Conversion: 44 — Low review count; no policies visible.",
          "SEO: 62 — Listings vary in keyword strategy.",
          "TOP WIN: Expand About to 200+ words with founder story + niche statement.",
          "TOP FIX: Add shop policies (shipping/returns) — buyers check before purchase.",
        ],
      },
    },
    features: [
      {
        icon: Store,
        title: "Whole-shop audit",
        body: "Not one listing — your entire storefront and brand experience.",
      },
      {
        icon: Compass,
        title: "5-pillar score",
        body: "Branding, SEO, conversion, policy, diversity — see where you're strong and weak.",
      },
      {
        icon: BarChart3,
        title: "30+ checks",
        body: "Comprehensive but prioritized. We tell you what matters most for your shop.",
      },
      {
        icon: Award,
        title: "Sonnet 4.6 on Max tier",
        body: "Max subscribers get Claude Sonnet 4.6 — deeper reasoning about brand voice.",
      },
      {
        icon: Wand2,
        title: "Brand-voice reasoning",
        body: "Claude reads your About and announcement together — does the voice match?",
      },
      {
        icon: ShieldCheck,
        title: "No Etsy API or scraping",
        body: "Paste your shop info directly. We never scrape etsy.com.",
      },
    ],
    comparison: {
      rows: [
        { feature: "Whole-shop view (not one listing)", values: [true, "manual", false] },
        { feature: "5-pillar scoring", values: [true, false, false] },
        { feature: "30+ checks", values: [true, "manual", "varies"] },
        { feature: "Brand-voice reasoning", values: [true, "manual", false] },
        { feature: "Sonnet 4.6 on Max tier", values: [true, "—", false] },
        { feature: "Under 60 seconds", values: [true, "—", "varies"] },
        { feature: "No Etsy API or scraping", values: [true, true, "varies"] },
      ],
    },
    faq: [
      {
        q: "How do I audit my Etsy shop?",
        a: "Paste your shop URL or key details (About, announcement, top listings, policies, review count) into Craftly's Shop Analyzer for an AI audit, or manually: review your About for founder story + niche statement, check policies are filled, ensure listings share brand voice, and confirm your banner matches your aesthetic.",
      },
      {
        q: "Why is my Etsy shop not getting views?",
        a: "Usually one of: weak listings (low search visibility — start with the Listing Analyzer), thin shop signals (about/policies/banner reduce trust), or a niche mismatch (listings are scattered, hard for Etsy to categorize). The Shop Analyzer surfaces which.",
      },
      {
        q: "How do I optimize an Etsy shop?",
        a: "Fundamentals first: complete About with founder story, fill all policies, add a banner consistent with listing photos, focus listings around a clear niche, and accumulate reviews early via excellent buyer experience. Then optimize individual listings.",
      },
      {
        q: "What should an Etsy shop announcement say?",
        a: "Lead with current shipping/processing timing (the #1 buyer concern), then add 1–2 lines on what makes the shop special. Update during sales, Q4 rush, or vacation closures. Keep it short — 2–3 sentences.",
      },
      {
        q: "How many listings should I have on Etsy?",
        a: "More isn't strictly better, but Etsy's algorithm rewards shops with healthy listing depth. 20–40 listings is a strong baseline; 100+ helps for niche dominance. Quality beats quantity — 30 well-optimized listings outrank 200 weak ones.",
      },
      {
        q: "How do I improve Etsy shop conversion?",
        a: "Three highest-leverage fixes: (1) complete About section with founder voice, (2) all policies filled and reasonable, (3) consistent photo aesthetic across listings. Then optimize individual listings via the Listing Analyzer.",
      },
      {
        q: "Does Etsy rank shops or just listings?",
        a: "Both. Etsy ranks individual listings, but shop signals (review count, favorites, response time, policy completeness) feed into the 'shop quality' factor in the listing-level ranking algorithm. A great shop lifts every listing.",
      },
      {
        q: "Why does Craftly cost 8 credits for a shop audit?",
        a: "Shop audits are deeper than listing audits — 30+ checks across 5 pillars, processed by Claude Haiku 4.5 (or Sonnet 4.6 on Max). We pass the cost through transparently. The free plan covers one shop audit per month plus seven generator runs.",
      },
    ],
  },

  "fee-calculator": {
    tldr: "Etsy charges sellers six different fees: listing, transaction, payment processing, Offsite Ads, regulatory operating fee, and (optional) Etsy Plus subscription. Craftly's Fee Calculator computes all of them in real time as you type — 100% free, no signup, updated for 2026 rates.",
    metaDescription:
      "Free Etsy fee calculator with every fee broken down: listing, transaction, payment processing, Offsite Ads, regulatory. No signup. Updated for 2026.",
    definition: {
      heading: "What is the Etsy fee calculator?",
      body: "The Etsy fee calculator is a free tool that computes every fee Etsy charges sellers on a given sale: $0.20 listing fee, 6.5% transaction fee, payment processing (3% + $0.25 in the U.S., varies by country), 15% Offsite Ads fee (only on Offsite Ads sales), regulatory operating fee (varies by country), and optional Etsy Plus subscription ($10/mo). Craftly's calculator runs in your browser, requires no signup, and is updated whenever Etsy changes its fee structure.",
      stats: [
        { value: "$0.20", label: "Etsy listing fee", citation: { source: "Etsy Seller Handbook" } },
        {
          value: "6.5%",
          label: "Transaction fee on order",
          citation: { source: "Etsy Seller Handbook" },
        },
        {
          value: "15%",
          label: "Offsite Ads fee (if used)",
          citation: { source: "Etsy Seller Handbook" },
        },
      ],
    },
    personas: [
      {
        title: "Sellers pricing new products",
        body: "Before you set a price, know what you actually net after every fee.",
      },
      {
        title: "Sellers comparing platforms",
        body: "Apples-to-apples cost comparison vs Shopify, Faire, or your own site.",
      },
      {
        title: "International sellers",
        body: "Cross-border payment processing + VAT + regulatory fees are confusing. We surface them all.",
      },
    ],
    steps: [
      {
        title: "Enter sale price, shipping, and country",
        body: "Sale price, shipping charge, your country (for payment processing rates).",
      },
      {
        title: "Toggle Offsite Ads + Etsy Plus if applicable",
        body: "If your sale came via Offsite Ads, toggle on. If you subscribe to Etsy Plus, toggle on.",
      },
      {
        title: "See every fee, line by line",
        body: "Listing + transaction + processing + Offsite Ads + regulatory + Plus. Plus your net payout.",
      },
    ],
    example: {
      before: {
        label: "Inputs",
        lines: [
          "Sale price: $50.00",
          "Shipping: $5.00",
          "Country: United States",
          "Offsite Ads: No",
        ],
      },
      after: {
        label: "Fee breakdown",
        lines: [
          "Listing fee: $0.20",
          "Transaction (6.5% of $55): $3.58",
          "Processing (3% + $0.25): $1.90",
          "Regulatory operating: $0.06",
          "TOTAL FEES: $5.74",
          "YOU NET: $49.26",
        ],
      },
    },
    features: [
      {
        icon: Calculator,
        title: "Real-time as you type",
        body: "Adjust any input and see all fees update instantly.",
      },
      {
        icon: Receipt,
        title: "Every fee, line by line",
        body: "Listing, transaction, processing, Offsite Ads, regulatory, Plus — no hidden math.",
      },
      {
        icon: Globe,
        title: "Country-aware",
        body: "Payment processing and regulatory fees vary by country. We adjust automatically.",
      },
      {
        icon: DollarSign,
        title: "Net payout shown",
        body: "What lands in your bank, not just what Etsy charges.",
      },
      {
        icon: PieChart,
        title: "Toggle Offsite Ads + Plus",
        body: "Compare scenarios: does Etsy Plus pay off? Worth the Offsite Ads cut?",
      },
      {
        icon: ShieldCheck,
        title: "100% free, no signup",
        body: "Works in your browser. No email, no account, no tracking pixel.",
      },
    ],
    comparison: {
      rows: [
        { feature: "Real-time as you type", values: [true, "manual", "varies"] },
        { feature: "Every fee surfaced", values: [true, false, "mixed"] },
        { feature: "Country-aware processing rates", values: [true, "manual", "varies"] },
        { feature: "Offsite Ads toggle", values: [true, false, "varies"] },
        { feature: "Updated for 2026 rates", values: [true, "varies", "varies"] },
        { feature: "Free, no signup", values: [true, true, "varies"] },
      ],
    },
    faq: [
      {
        q: "How much does Etsy charge per sale?",
        a: "Etsy charges six potential fees per sale: $0.20 listing fee, 6.5% transaction fee on item price + shipping, payment processing (3% + $0.25 in the U.S.), 15% Offsite Ads fee (only on Offsite Ads sales), regulatory operating fee (varies by country), and an optional $10/mo Etsy Plus subscription. Total averages 9–12% of revenue for U.S. sellers.",
      },
      {
        q: "What are all the Etsy seller fees?",
        a: "Six fees: (1) Listing fee — $0.20 per listing posted, (2) Transaction fee — 6.5% of total order including shipping, (3) Payment processing — 3% + $0.25 in U.S., varies abroad, (4) Offsite Ads fee — 15% (sellers under $10K) or 12% (over $10K), only on Offsite Ads conversions, (5) Regulatory operating fee — varies by country, (6) Etsy Plus — optional $10/mo subscription.",
      },
      {
        q: "How do I calculate Etsy profit?",
        a: "Profit = Sale price − Etsy fees − Materials − Labor − Packaging − Shipping (you actually paid). Craftly's Fee Calculator handles the Etsy fee math; subtract the rest. Most successful Etsy sellers target 50%+ gross margin after fees.",
      },
      {
        q: "Does Etsy take a percentage?",
        a: "Yes — 6.5% transaction fee on the total order (item + shipping + gift wrap), plus the payment processing percentage. Combined, Etsy and the payment processor take roughly 10% of the order value for U.S. sellers.",
      },
      {
        q: "Why are Etsy fees so high?",
        a: "They're not unusually high for a marketplace — eBay, Amazon Handmade, and Faire charge similar or more. The combined 10–12% covers payment processing, marketplace traffic, fraud protection, customer service, and platform development. Compare net payouts before judging.",
      },
      {
        q: "Do you pay Etsy fees on shipping?",
        a: "Yes — the 6.5% transaction fee applies to the total order including shipping. Even if shipping is 'free' (built into your price), the same percentage applies. Pricing strategy matters: free-shipping listings often outrank paid-shipping listings.",
      },
      {
        q: "Etsy fees for international sellers?",
        a: "Same base fees, but payment processing rates and regulatory operating fees vary by country. Some countries also have VAT, IOSS, or other tax obligations. Craftly's calculator adjusts payment processing by country; tax obligations are separate.",
      },
      {
        q: "What is the Etsy regulatory operating fee?",
        a: "A small percentage Etsy adds in countries with regulatory or VAT compliance costs. As of 2026, it ranges from ~0.25% to 1.1% depending on country (1.1% in UK, ~0.25% in U.S.). Craftly's calculator includes it automatically.",
      },
      {
        q: "What is Etsy's Offsite Ads fee?",
        a: "Etsy promotes listings on Google, Pinterest, Facebook, etc. (Offsite Ads). If a sale comes through one of these ads, Etsy takes an additional 15% (sellers under $10K/yr) or 12% (over $10K/yr). Sellers under $10K/yr can opt out; over $10K/yr cannot.",
      },
    ],
  },

  "events-calendar": {
    tldr: "Q4 isn't the only Etsy peak — Valentine's, Mother's Day, weddings, back-to-school, niche holidays all matter. Craftly's free Etsy Events Calendar maps every gift-giving occasion, shipping cutoff, and seasonal trend for the year so you list, refresh, and ship on time.",
    metaDescription:
      "Free Etsy holiday calendar with every gift-giving event, shipping cutoff, and seasonal trend. Plan Q4, Valentine's, Mother's Day. Updated weekly. No signup.",
    definition: {
      heading: "What is the Etsy holiday calendar?",
      body: "The Etsy Events Calendar is a free seasonal-planning tool that lists every gift-giving holiday, shipping deadline, and seasonal trend Etsy sellers should prepare for — Q4 (Black Friday, Cyber Monday, Christmas), Valentine's Day, Mother's Day, Father's Day, wedding season, back-to-school, plus niche holidays (Galentine's, Pride, Halloween, etc.). Each event includes a recommended listing-prep date, shipping cutoff, and product-category fit so you know when to act, not just what's coming.",
      stats: [
        { value: "40+", label: "Tracked events per year" },
        { value: "3", label: "Regions (U.S. / UK / EU)" },
        { value: "Weekly", label: "Update cadence" },
      ],
    },
    personas: [
      {
        title: "New sellers planning their first Q4",
        body: "You don't know when to prep. Start here, then plan backward from Christmas.",
      },
      {
        title: "Veterans optimizing seasonal mix",
        body: "Some events outperform others in your niche. Plan smarter, not harder.",
      },
      {
        title: "International sellers",
        body: "U.S., UK, EU holidays don't fully overlap. See all three side by side.",
      },
    ],
    steps: [
      {
        title: "Browse the calendar",
        body: "Scroll the year or filter by category (gift-giving, weddings, seasonal, niche).",
      },
      {
        title: "Plan listing-prep dates",
        body: "Each event shows when to list, when to refresh tags, when to ship by.",
      },
      {
        title: "Sync to your workflow",
        body: "Export key events to your calendar (Apple/Google/.ics support coming soon).",
      },
    ],
    example: {
      before: { label: "Filter", lines: ["Category: gift-giving", "Region: U.S."] },
      after: {
        label: "Sample events",
        lines: [
          "Mother's Day (May 11) — prep by Mar 15, ship by May 6",
          "Father's Day (Jun 15) — prep by Apr 15, ship by Jun 10",
          "Galentine's Day (Feb 13) — prep by Jan 1, ship by Feb 8",
          "Halloween (Oct 31) — prep by Aug 1, ship by Oct 25",
          "Christmas (Dec 25) — prep by Sep 15, ship by Dec 19",
        ],
      },
    },
    features: [
      {
        icon: CalendarDays,
        title: "40+ events per year",
        body: "Not just Q4. Every gift-giving moment, niche holiday, and seasonal trend.",
      },
      {
        icon: Gift,
        title: "Recommended listing-prep dates",
        body: "When to start listing, refresh tags, and bump titles for each event.",
      },
      {
        icon: Truck,
        title: "Shipping cutoff dates",
        body: "U.S., UK, and EU last-day-to-ship dates for each event.",
      },
      {
        icon: Globe,
        title: "Multi-region",
        body: "U.S., UK, and EU holidays. International gift trends. Filter by region.",
      },
      {
        icon: Sparkles,
        title: "Niche holidays included",
        body: "Pride, Galentine's, World Mental Health Day, Earth Day — niches that move on Etsy.",
      },
      {
        icon: ShieldCheck,
        title: "Free forever, no signup",
        body: "Browse in your browser. No email, no account, no tracking.",
      },
    ],
    comparison: {
      rows: [
        { feature: "40+ events per year", values: [true, "manual", "varies"] },
        { feature: "Listing-prep dates", values: [true, false, false] },
        { feature: "Shipping cutoffs", values: [true, "manual", false] },
        { feature: "Multi-region (U.S./UK/EU)", values: [true, false, "varies"] },
        { feature: "Niche holidays", values: [true, "manual", false] },
        { feature: "Free, no signup", values: [true, true, "varies"] },
      ],
    },
    faq: [
      {
        q: "When is the best time to sell on Etsy?",
        a: "Q4 (October–December) is the highest-revenue period for most Etsy sellers, driven by Black Friday, Cyber Monday, and Christmas. But Valentine's Day, Mother's Day, and wedding season (May–September) are major peaks too. Niche-dependent: home decor peaks Q4; jewelry peaks Mother's Day.",
      },
      {
        q: "When should I start prepping for Q4 on Etsy?",
        a: "By August at the latest. List new holiday products, refresh tags on existing seasonal listings, and update your shop announcement with shipping timing. Etsy's algorithm rewards 'freshness', so listing in September captures early-bird buyers.",
      },
      {
        q: "What holidays should Etsy sellers prepare for?",
        a: "The major U.S. gift-giving holidays: Christmas (Dec 25), Valentine's Day (Feb 14), Mother's Day (May 11 in 2026), Father's Day (Jun 15 in 2026), and wedding season (May–September). Plus niche moments depending on your category: Galentine's, Pride, back-to-school, Halloween, etc.",
      },
      {
        q: "When is Etsy busiest?",
        a: "Mid-November through mid-December is the absolute peak (Black Friday → Christmas shipping cutoff). Secondary peaks: late January (post-Christmas gift cards), early May (Mother's Day), and May–September (weddings).",
      },
      {
        q: "What's the Etsy Christmas shipping deadline?",
        a: "Etsy doesn't set a single deadline, but for U.S. domestic shipping the practical last-ship dates are: USPS Ground ~Dec 16, USPS Priority ~Dec 19, USPS Express ~Dec 21. International orders cut off 1–2 weeks earlier. Update your shop announcement when these pass.",
      },
      {
        q: "What sells on Etsy in November?",
        a: "November is Christmas-driven: ornaments, personalized gifts, stocking stuffers, home decor, advent calendars, and holiday cards lead. Cyber Monday (early December in 2026) is a major sales spike — consider a shop-wide promotion.",
      },
      {
        q: "How early should I list seasonal Etsy products?",
        a: "8–10 weeks before the event. Etsy's algorithm needs time to test new listings (clicks, favorites, conversions) before ranking them in seasonal searches. Listing 2 weeks before the event is too late — competitors already have ranked listings.",
      },
      {
        q: "Are seasonal listings worth the effort?",
        a: "Yes — if you sell gift-giving products. Seasonal listings often outperform evergreen listings during their window (sometimes 5–10× the daily revenue). Plan ahead, refresh annually, and archive (don't delete) seasonal listings so they keep historical signals when re-listed.",
      },
    ],
  },

  "niche-finder": {
    tldr: "An Etsy niche finder identifies underserved sub-categories within a broad seed. Craftly returns 5 niche clusters per search, each with demand vs competition scores, sample long-tail keywords, and one concrete first-product idea to validate the niche.",
    metaDescription:
      "Etsy niche finder that surfaces 5 underserved sub-categories per seed with demand/competition scores. AI-powered. 4 credits per search.",
    definition: {
      heading: "What is an Etsy niche finder?",
      body: "An Etsy niche finder is research software that identifies under-served sub-categories within a broad market. Instead of telling you 'sell candles', it tells you 'sell minimalist desk candles for remote workers — demand 74, competition 41, opportunity score 78'. The best niche finders score every cluster on demand vs competition so you don't waste months building inventory in a saturated lane.",
      stats: [
        { value: "5", label: "Niche clusters per seed" },
        { value: "0-100", label: "Opportunity score range" },
        { value: "<60s", label: "Average research time" },
      ],
    },
    personas: [
      {
        title: "New sellers picking a starting niche",
        body: "You know you want to sell on Etsy but every category looks crowded. The niche finder shows where the underserved corners are within categories you're considering.",
      },
      {
        title: "Veteran sellers diversifying",
        body: "Your current category is saturating. You want to launch a second line — but where? The finder surfaces adjacent niches that share buyer overlap with your current shop.",
      },
      {
        title: "Resellers and POD sellers testing themes",
        body: "Print-on-demand and dropshippers can iterate fast — but only if you know which themes have demand. Five clusters per search compresses days of competitor research into one call.",
      },
    ],
    steps: [
      {
        title: "Enter a seed category",
        body: "Anything from 'home decor' to 'cottagecore stationery' to 'wedding favors'. Optionally hint at audience or price point.",
      },
      {
        title: "AI surfaces 5 sub-niche clusters",
        body: "Each scored on demand (0-100), competition (0-100), and composite opportunity (0-100). Ordered best-first.",
      },
      {
        title: "Pick the cluster, copy the keywords",
        body: "Each cluster includes 3-8 long-tail keywords to validate and one first-product idea to test the niche. Build 3-5 listings before testing a second cluster.",
      },
    ],
    example: {
      before: {
        label: "Seed input",
        lines: ["home decor", "audience: remote workers", "mid-range price"],
      },
      after: {
        label: "Top cluster returned",
        lines: [
          "Minimalist desk decor for remote workers",
          "Demand: 74 · Competition: 41 · Opportunity: 78",
          'Sample keywords: "minimalist desk organizer", "wfh desk decor", "wood desk accessories"',
          "First product idea: Set of three white-oak desk risers in graduated heights, sold as a modular trio.",
        ],
      },
    },
    features: [
      {
        icon: Compass,
        title: "5 clusters per seed",
        body: "Not a flat keyword dump — 5 themed clusters, each with positioning, keywords, and a product idea.",
      },
      {
        icon: BarChart3,
        title: "Demand and competition scored separately",
        body: "Composite opportunity score (demand minus competition) so you can sort by what actually matters.",
      },
      {
        icon: Target,
        title: "Concrete first-product ideas",
        body: "Every cluster ends with one specific product idea you can build and ship within 7 days.",
      },
      {
        icon: Sparkles,
        title: "Long-tail keyword examples included",
        body: "3-8 phrases per cluster to validate buyer search and seed your tag generator.",
      },
      {
        icon: Award,
        title: "Max-tier model boost",
        body: "Max subscribers automatically get Claude Sonnet 4.6 on niche research for more nuanced positioning calls.",
      },
      {
        icon: ShieldCheck,
        title: "No Etsy API or scraping",
        body: "Trained on broad market patterns, no live Etsy crawl. You're never violating Etsy's terms.",
      },
    ],
    comparison: {
      rows: [
        { feature: "Returns scored opportunity, not raw keywords", values: [true, false, false] },
        { feature: "Includes product idea per niche", values: [true, false, "rarely"] },
        { feature: "Sub-60-second results", values: [true, "—", "varies"] },
        { feature: "Etsy-aware competition signals", values: [true, "partial", false] },
        { feature: "Long-tail keyword seeding included", values: [true, "—", "partial"] },
        { feature: "Free plan available", values: ["15 credits/mo", "—", "varies"] },
        { feature: "No marketplace API or scraping required", values: [true, true, "varies"] },
      ],
    },
    faq: [
      {
        q: "How is this different from the Keyword Generator?",
        a: "The Keyword Generator returns 30 long-tail phrases for a single seed — useful when you've already picked your niche and want tags. The Niche Finder returns 5 themed clusters with positioning and product ideas — useful when you're deciding what to build in the first place. They chain naturally: pick a cluster, then run its keywords through Tag Generator.",
      },
      {
        q: "How do you score demand and competition without Etsy API access?",
        a: "The model is trained on broad public market signals (search trends, marketplace category mix, social patterns) and produces relative scores within the seed category. Treat the absolute numbers as directional, not ground truth — the value is the ranking between the 5 clusters, not the precise 74-vs-41 split.",
      },
      {
        q: "What's a good opportunity score to act on?",
        a: "Anything ≥65 is worth testing. ≥75 is genuinely underserved and worth building 3-5 listings in. <50 means the cluster is saturated relative to its demand — workable, but expect to compete on price or photography.",
      },
      {
        q: "Should I build in the top cluster only, or spread across all 5?",
        a: "Start with the top cluster. Build 3-5 listings in it before testing a second cluster. Spreading across all 5 at once dilutes the freshness signal Etsy gives each new listing and slows down your conversion data.",
      },
      {
        q: "Can I re-run with a more specific seed?",
        a: "Yes — and you should. Run a broad seed first ('home decor') to get a lay of the land. Then re-run with your favorite cluster's name as the new seed to drill in. Each level surfaces narrower niches than the previous.",
      },
      {
        q: "How fresh is the data?",
        a: "The model knowledge cutoff is January 2026. Cluster positioning and audience patterns shift slowly — quarterly to yearly — so freshness is rarely the bottleneck. If a cluster is hot in a specific 30-day window, watch trade press; this tool isn't a real-time trends product.",
      },
      {
        q: "Does this work for non-Etsy marketplaces?",
        a: "The positioning advice and cluster framework transfer to Amazon Handmade, Shopify, and similar marketplaces. Demand/competition scores are Etsy-weighted, though, so apply judgment when porting to other platforms.",
      },
      {
        q: "Why 4 credits?",
        a: "Niche research uses Claude Haiku 4.5 (Sonnet 4.6 for Max subscribers) and produces a longer, more structured output than the keyword generator. The 4-credit cost reflects the model and token budget. Free plan members get ~3 searches/month included.",
      },
    ],
  },
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
