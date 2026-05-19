/**
 * Etsy seller events calendar — 2026 dates where the event has a fixed date,
 * otherwise the actual 2026 occurrence. Refresh annually.
 *
 * `prep` = recommended date to publish/refresh listings.
 * `ship` = practical last-day-to-ship for buyer to receive in time (US).
 */

export type EventCategory =
  | "major-holiday"
  | "gift-giving"
  | "weddings"
  | "seasonal"
  | "niche"
  | "back-to-school";

export type Region = "US" | "UK" | "EU" | "GLOBAL";

export interface SellerEvent {
  slug: string;
  name: string;
  /** ISO date of the event in 2026. */
  date: string;
  /** ISO date to publish / refresh listings by. */
  prep: string;
  /** Practical US last-day-to-ship date. */
  ship: string;
  category: EventCategory;
  regions: Region[];
  /** Short blurb for the card. */
  description: string;
  /** Product categories likely to spike. */
  niches: string[];
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  "major-holiday": "Major holidays",
  "gift-giving": "Gift-giving",
  weddings: "Weddings",
  seasonal: "Seasonal trends",
  niche: "Niche / cultural",
  "back-to-school": "Back to school",
};

export const REGION_LABELS: Record<Region, string> = {
  US: "United States",
  UK: "United Kingdom",
  EU: "Europe",
  GLOBAL: "Global",
};

export const EVENTS: SellerEvent[] = [
  // ── Q1 ─────────────────────────────────────────────────────────────────
  {
    slug: "new-years-day-2026",
    name: "New Year's Day",
    date: "2026-01-01",
    prep: "2025-11-15",
    ship: "2025-12-26",
    category: "major-holiday",
    regions: ["GLOBAL"],
    description: "Resolution-themed planners, fitness, organization, journals.",
    niches: ["planners", "journals", "fitness gear", "organization"],
  },
  {
    slug: "galentines-day-2026",
    name: "Galentine's Day",
    date: "2026-02-13",
    prep: "2026-01-05",
    ship: "2026-02-09",
    category: "gift-giving",
    regions: ["US"],
    description: "Best-friend gifts — friendship bracelets, mugs, candles, snarky cards.",
    niches: ["jewelry", "candles", "stationery", "mugs"],
  },
  {
    slug: "valentines-day-2026",
    name: "Valentine's Day",
    date: "2026-02-14",
    prep: "2025-12-15",
    ship: "2026-02-10",
    category: "major-holiday",
    regions: ["GLOBAL"],
    description: "Couples gifts, personalized jewelry, romance-themed home decor. Peak: Feb 1–13.",
    niches: ["jewelry", "personalized", "home decor", "cards"],
  },
  {
    slug: "presidents-day-2026",
    name: "Presidents' Day",
    date: "2026-02-16",
    prep: "2026-01-10",
    ship: "2026-02-12",
    category: "seasonal",
    regions: ["US"],
    description: "Sale weekend. Run shop-wide promotions to clear winter inventory.",
    niches: ["all categories"],
  },
  {
    slug: "international-womens-day-2026",
    name: "International Women's Day",
    date: "2026-03-08",
    prep: "2026-01-25",
    ship: "2026-03-04",
    category: "niche",
    regions: ["GLOBAL"],
    description: "Empowerment-themed gifts: women-supporting-women jewelry, prints, mugs.",
    niches: ["jewelry", "prints", "stationery"],
  },
  {
    slug: "mothering-sunday-uk-2026",
    name: "Mothering Sunday (UK)",
    date: "2026-03-15",
    prep: "2026-02-01",
    ship: "2026-03-11",
    category: "major-holiday",
    regions: ["UK"],
    description: "UK's Mother's Day — different date from US. Personalized gifts, cards, jewelry.",
    niches: ["jewelry", "personalized", "cards", "candles"],
  },
  {
    slug: "st-patricks-day-2026",
    name: "St. Patrick's Day",
    date: "2026-03-17",
    prep: "2026-02-01",
    ship: "2026-03-13",
    category: "seasonal",
    regions: ["US", "UK", "EU"],
    description: "Irish-themed apparel, accessories, kids' costumes, pub decor.",
    niches: ["apparel", "accessories", "kids", "home decor"],
  },

  // ── Q2 ─────────────────────────────────────────────────────────────────
  {
    slug: "easter-2026",
    name: "Easter Sunday",
    date: "2026-04-05",
    prep: "2026-02-20",
    ship: "2026-03-31",
    category: "major-holiday",
    regions: ["GLOBAL"],
    description: "Children's gifts, baskets, pastel home decor, religious-themed items.",
    niches: ["kids", "home decor", "candles", "religious"],
  },
  {
    slug: "earth-day-2026",
    name: "Earth Day",
    date: "2026-04-22",
    prep: "2026-03-10",
    ship: "2026-04-18",
    category: "niche",
    regions: ["GLOBAL"],
    description: "Sustainable-themed products. Reusables, plant-based, zero-waste.",
    niches: ["eco", "reusables", "plants", "candles"],
  },
  {
    slug: "mothers-day-us-2026",
    name: "Mother's Day (US)",
    date: "2026-05-10",
    prep: "2026-03-15",
    ship: "2026-05-06",
    category: "major-holiday",
    regions: ["US"],
    description: "Second-biggest gift holiday after Christmas. Jewelry, personalized, spa, cards.",
    niches: ["jewelry", "personalized", "candles", "spa", "cards"],
  },
  {
    slug: "memorial-day-2026",
    name: "Memorial Day Weekend",
    date: "2026-05-25",
    prep: "2026-04-15",
    ship: "2026-05-20",
    category: "seasonal",
    regions: ["US"],
    description: "Unofficial start of summer. BBQ, patriotic decor, outdoor entertaining.",
    niches: ["outdoor", "home decor", "kitchen"],
  },
  {
    slug: "pride-month-2026",
    name: "Pride Month",
    date: "2026-06-01",
    prep: "2026-04-10",
    ship: "2026-05-28",
    category: "niche",
    regions: ["GLOBAL"],
    description: "LGBTQ+ pride apparel, accessories, stickers, art. Peak: early June.",
    niches: ["apparel", "stickers", "art", "jewelry"],
  },
  {
    slug: "fathers-day-2026",
    name: "Father's Day (US/UK)",
    date: "2026-06-21",
    prep: "2026-04-30",
    ship: "2026-06-17",
    category: "major-holiday",
    regions: ["US", "UK"],
    description: "Personalized leather, BBQ accessories, beer/whiskey gifts, dad-joke prints.",
    niches: ["personalized", "leather", "kitchen", "prints"],
  },
  {
    slug: "wedding-season-2026",
    name: "Wedding season peak",
    date: "2026-06-01",
    prep: "2026-02-01",
    ship: "2026-05-15",
    category: "weddings",
    regions: ["GLOBAL"],
    description: "May–September peak. Invitations, bridesmaid gifts, decor, favors, signs.",
    niches: ["weddings", "personalized", "signs", "favors", "jewelry"],
  },

  // ── Q3 ─────────────────────────────────────────────────────────────────
  {
    slug: "independence-day-2026",
    name: "Independence Day",
    date: "2026-07-04",
    prep: "2026-05-25",
    ship: "2026-06-30",
    category: "major-holiday",
    regions: ["US"],
    description: "Patriotic apparel, decor, kids' items, BBQ entertaining.",
    niches: ["apparel", "home decor", "kids", "kitchen"],
  },
  {
    slug: "back-to-school-2026",
    name: "Back to school",
    date: "2026-08-20",
    prep: "2026-06-15",
    ship: "2026-08-15",
    category: "back-to-school",
    regions: ["US", "UK", "EU"],
    description: "Stickers, backpacks, planners, dorm decor, teacher-appreciation gifts.",
    niches: ["stationery", "stickers", "bags", "decor", "teacher gifts"],
  },
  {
    slug: "labor-day-2026",
    name: "Labor Day Weekend",
    date: "2026-09-07",
    prep: "2026-07-20",
    ship: "2026-09-02",
    category: "seasonal",
    regions: ["US"],
    description: "End-of-summer sales. Clear seasonal inventory before Q4 prep.",
    niches: ["all categories"],
  },

  // ── Q4 ─────────────────────────────────────────────────────────────────
  {
    slug: "halloween-2026",
    name: "Halloween",
    date: "2026-10-31",
    prep: "2026-08-01",
    ship: "2026-10-25",
    category: "seasonal",
    regions: ["US", "UK"],
    description: "Costumes, decor, party supplies, spooky prints. Listings live by August.",
    niches: ["costumes", "home decor", "prints", "kids", "candles"],
  },
  {
    slug: "dia-de-los-muertos-2026",
    name: "Día de los Muertos",
    date: "2026-11-02",
    prep: "2026-09-15",
    ship: "2026-10-28",
    category: "niche",
    regions: ["US"],
    description: "Sugar-skull art, altars, marigold-themed decor, jewelry.",
    niches: ["art", "home decor", "jewelry"],
  },
  {
    slug: "thanksgiving-2026",
    name: "Thanksgiving (US)",
    date: "2026-11-26",
    prep: "2026-10-01",
    ship: "2026-11-21",
    category: "major-holiday",
    regions: ["US"],
    description: "Hostess gifts, fall home decor, kids' crafts, dinnerware, place cards.",
    niches: ["home decor", "kitchen", "kids", "candles"],
  },
  {
    slug: "black-friday-2026",
    name: "Black Friday",
    date: "2026-11-27",
    prep: "2026-10-15",
    ship: "2026-12-15",
    category: "major-holiday",
    regions: ["US", "UK", "EU"],
    description: "Biggest sales day of the year. Run shop-wide promos; update announcement.",
    niches: ["all categories"],
  },
  {
    slug: "cyber-monday-2026",
    name: "Cyber Monday",
    date: "2026-11-30",
    prep: "2026-10-15",
    ship: "2026-12-15",
    category: "major-holiday",
    regions: ["GLOBAL"],
    description: "Online-shopping peak. Extend Black Friday promos through the weekend.",
    niches: ["all categories"],
  },
  {
    slug: "hanukkah-2026",
    name: "Hanukkah",
    date: "2026-12-04",
    prep: "2026-10-15",
    ship: "2026-12-01",
    category: "major-holiday",
    regions: ["GLOBAL"],
    description: "Jewish gifts, menorahs, dreidels, Star of David jewelry.",
    niches: ["jewelry", "home decor", "kids"],
  },
  {
    slug: "christmas-2026",
    name: "Christmas",
    date: "2026-12-25",
    prep: "2026-09-15",
    ship: "2026-12-19",
    category: "major-holiday",
    regions: ["GLOBAL"],
    description: "The peak. Ornaments, stocking stuffers, personalized gifts, advent, decor.",
    niches: ["ornaments", "personalized", "home decor", "cards", "kids"],
  },
  {
    slug: "kwanzaa-2026",
    name: "Kwanzaa",
    date: "2026-12-26",
    prep: "2026-10-15",
    ship: "2026-12-20",
    category: "major-holiday",
    regions: ["US"],
    description: "African heritage gifts, kinaras, mkeka mats, themed jewelry.",
    niches: ["jewelry", "home decor", "art"],
  },
  {
    slug: "new-years-eve-2026",
    name: "New Year's Eve",
    date: "2026-12-31",
    prep: "2026-11-10",
    ship: "2026-12-22",
    category: "seasonal",
    regions: ["GLOBAL"],
    description: "Party supplies, sparkly accessories, 'new year new me' planners.",
    niches: ["party", "accessories", "planners"],
  },

  // ── Niche / year-round ──────────────────────────────────────────────────
  {
    slug: "black-history-month-2026",
    name: "Black History Month",
    date: "2026-02-01",
    prep: "2025-12-15",
    ship: "2026-02-26",
    category: "niche",
    regions: ["US", "UK"],
    description: "Black-owned business spotlight, themed apparel, art, books.",
    niches: ["apparel", "art", "books"],
  },
  {
    slug: "aapi-heritage-month-2026",
    name: "AAPI Heritage Month",
    date: "2026-05-01",
    prep: "2026-03-15",
    ship: "2026-05-25",
    category: "niche",
    regions: ["US"],
    description: "Asian-American & Pacific Islander culture-themed art, apparel, gifts.",
    niches: ["art", "apparel", "stationery"],
  },
  {
    slug: "world-mental-health-day-2026",
    name: "World Mental Health Day",
    date: "2026-10-10",
    prep: "2026-08-25",
    ship: "2026-10-06",
    category: "niche",
    regions: ["GLOBAL"],
    description: "Affirmation prints, self-care candles, journals, supportive apparel.",
    niches: ["prints", "candles", "stationery", "apparel"],
  },
];

EVENTS.sort((a, b) => a.date.localeCompare(b.date));

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];
export const ALL_REGIONS: Region[] = ["US", "UK", "EU", "GLOBAL"];
