import "dotenv/config";
import { PrismaClient, Tool, AIProvider, Plan, UserRole } from "@prisma/client";

const db = new PrismaClient();

const ADMIN_EMAIL = "aliraza4043627@gmail.com";

const SYSTEM_PROMPTS: Record<Tool, { provider: AIProvider; model: string; prompt: string }> = {
  TAG_GENERATOR: {
    provider: "OPENROUTER",
    model: "qwen/qwen-2.5-7b-instruct",
    prompt:
      "You are an Etsy SEO specialist. Generate exactly 13 high-search-volume, multi-word tags (2-3 words each, max 20 chars) for the product. Return JSON: { tags: string[] }. No explanation.",
  },
  TITLE_GENERATOR: {
    provider: "OPENROUTER",
    model: "qwen/qwen-2.5-7b-instruct",
    prompt:
      "You are an Etsy SEO specialist. Generate 5 listing-title variations, each <=140 chars, with the primary keyword in the first 60 chars. Return JSON: { titles: string[] }.",
  },
  KEYWORD_GENERATOR: {
    provider: "OPENROUTER",
    model: "qwen/qwen-2.5-32b-instruct",
    prompt:
      "You are an Etsy keyword researcher. From the seed input, generate 30 long-tail keywords with estimated buyer intent (high/medium/low). Return JSON: { keywords: { phrase: string, intent: 'high'|'medium'|'low' }[] }.",
  },
  DESCRIPTION_GENERATOR: {
    provider: "OPENROUTER",
    model: "qwen/qwen-2.5-32b-instruct",
    prompt:
      "You are an Etsy copywriter. Write a scannable product description (180-280 words): first-line hook, 3-5 feature bullets, shipping/returns note, soft CTA. Return JSON: { description: string }.",
  },
  LISTING_ANALYZER: {
    provider: "ANTHROPIC",
    model: "claude-haiku-4-5-20251001",
    prompt:
      "You are an Etsy listing auditor. Score the listing 0-100 across title SEO, tag relevance, description quality, photo coverage, and attributes. For each axis return { score, why, fixes[] }. Return JSON.",
  },
  SHOP_ANALYZER: {
    provider: "ANTHROPIC",
    model: "claude-haiku-4-5-20251001",
    prompt:
      "You are an Etsy shop auditor. Evaluate branding, about section, shop announcement, policies, listing diversity, conversion signals. Return JSON: { overallScore, axes: { branding, copy, seo, conversion }[], top3Wins[], top3Fixes[] }.",
  },
  NICHE_FINDER: {
    provider: "ANTHROPIC",
    model: "claude-haiku-4-5-20251001",
    prompt:
      "You are an Etsy market researcher. Given a seed category and optional audience/price hints, identify exactly 5 underserved sub-niche clusters on Etsy. For each, return { name, positioning, demandScore (0-100), competitionScore (0-100), opportunityScore (demand - competition, 0-100), sampleKeywords[3-8], firstProductIdea }. Order clusters by opportunityScore desc. Add a 2-3 sentence summary with which cluster to start with. Return JSON.",
  },
};

async function main() {
  console.log("→ Seeding database…");

  console.log("  · admin user", ADMIN_EMAIL);
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: UserRole.ADMIN },
    create: {
      email: ADMIN_EMAIL,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log("  · subscription + credits for admin");
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await db.subscription.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, plan: Plan.MAX, status: "ACTIVE" },
  });

  await db.creditBalance.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, credits: 600, resetsAt: nextMonth },
  });

  console.log("  · AIConfig rows for 6 tools");
  for (const [tool, cfg] of Object.entries(SYSTEM_PROMPTS) as [
    Tool,
    (typeof SYSTEM_PROMPTS)[Tool],
  ][]) {
    await db.aIConfig.upsert({
      where: { tool },
      update: {},
      create: {
        tool,
        provider: cfg.provider,
        model: cfg.model,
        temperature: 0.7,
        maxTokens:
          tool === "LISTING_ANALYZER" || tool === "SHOP_ANALYZER" || tool === "NICHE_FINDER"
            ? 4096
            : 1024,
        systemPrompt: cfg.prompt,
      },
    });
  }

  console.log("✓ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
