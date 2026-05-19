import type { LucideIcon } from "lucide-react";
import {
  Tag,
  Heading1,
  Search,
  FileText,
  Stethoscope,
  Store,
  Calculator,
  CalendarDays,
  Compass,
} from "lucide-react";

export type ToolSlug =
  | "tag-generator"
  | "title-generator"
  | "keyword-generator"
  | "description-generator"
  | "listing-analyzer"
  | "shop-analyzer"
  | "niche-finder"
  | "fee-calculator"
  | "events-calendar";

export interface ToolMeta {
  slug: ToolSlug;
  /** Display name in nav / cards. */
  name: string;
  /** Hero H1 — primary keyword. */
  heroTitle: string;
  /** Short pitch (~14 words) for cards / footer. */
  tagline: string;
  /** Lucide icon for cards. */
  icon: LucideIcon;
  /** Credit cost. 0 = free tool. */
  credits: number;
  /** "paid" gates behind credits; "free" is open access. */
  category: "paid" | "free";
  /** Default AI model description for marketing copy. */
  model?: string;
  /** Whether MAX plan upgrades the model. */
  maxBoost?: boolean;
}

export const TOOLS: ToolMeta[] = [
  {
    slug: "tag-generator",
    name: "Tag Generator",
    heroTitle: "Etsy tag generator that fills all 13 tags in seconds",
    tagline: "Fill all 13 Etsy tag slots with high-search, low-competition phrases.",
    icon: Tag,
    credits: 1,
    category: "paid",
    model: "Qwen 7B via OpenRouter",
  },
  {
    slug: "title-generator",
    name: "Title Generator",
    heroTitle: "Etsy title generator that front-loads the keywords that rank",
    tagline: "Five SEO-optimized title variations, each under the 140-char limit.",
    icon: Heading1,
    credits: 1,
    category: "paid",
    model: "Qwen 7B via OpenRouter",
  },
  {
    slug: "keyword-generator",
    name: "Keyword Generator",
    heroTitle: "Etsy keyword generator with buyer-intent scoring",
    tagline: "30 long-tail Etsy keywords ranked by buyer intent. Real demand, no guesses.",
    icon: Search,
    credits: 2,
    category: "paid",
    model: "Qwen 32B via OpenRouter",
  },
  {
    slug: "description-generator",
    name: "Description Generator",
    heroTitle: "Etsy description generator trained on what converts",
    tagline: "Scannable, hooked, and conversion-tuned product copy in one click.",
    icon: FileText,
    credits: 3,
    category: "paid",
    model: "Qwen 32B via OpenRouter",
  },
  {
    slug: "listing-analyzer",
    name: "Listing Analyzer",
    heroTitle: "Etsy listing analyzer that finds what's costing you sales",
    tagline: "Deep AI audit of one listing — title, tags, description, photos, attributes.",
    icon: Stethoscope,
    credits: 5,
    category: "paid",
    model: "Claude Haiku 4.5",
    maxBoost: true,
  },
  {
    slug: "shop-analyzer",
    name: "Shop Analyzer",
    heroTitle: "Etsy shop analyzer that audits your entire storefront",
    tagline: "30+ checks across branding, SEO, conversion, and policies.",
    icon: Store,
    credits: 8,
    category: "paid",
    model: "Claude Haiku 4.5",
    maxBoost: true,
  },
  {
    slug: "niche-finder",
    name: "Niche Finder",
    heroTitle: "Etsy niche finder that surfaces underserved sub-categories",
    tagline: "5 ranked niche clusters per seed — demand vs competition, scored for opportunity.",
    icon: Compass,
    credits: 4,
    category: "paid",
    model: "Claude Haiku 4.5",
    maxBoost: true,
  },
  {
    slug: "fee-calculator",
    name: "Fee Calculator",
    heroTitle: "Etsy fee calculator with every fee, line by line",
    tagline: "Free. Listing, transaction, processing, Offsite Ads — every fee in real-time.",
    icon: Calculator,
    credits: 0,
    category: "free",
  },
  {
    slug: "events-calendar",
    name: "Events Calendar",
    heroTitle: "Etsy holiday calendar so you never miss Q4 again",
    tagline: "Free. Every gift-giving holiday, shipping cutoff, and seasonal trend.",
    icon: CalendarDays,
    credits: 0,
    category: "free",
  },
];

export const TOOL_BY_SLUG = Object.fromEntries(TOOLS.map((t) => [t.slug, t])) as Record<
  ToolSlug,
  ToolMeta
>;

/** Pick N tools other than `current` for cross-linking. */
export function relatedTools(current: ToolSlug, count = 3): ToolMeta[] {
  return TOOLS.filter((t) => t.slug !== current).slice(0, count);
}
