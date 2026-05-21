import "dotenv/config";
import { PrismaClient, Tool, AIProvider, Plan, UserRole, type User } from "@prisma/client";
import { hashPassword } from "../lib/password";

const db = new PrismaClient();

const ADMIN_EMAIL = "aliraza4043627@gmail.com";
/** Shared password for all seeded accounts — dev only, never use this in prod. */
const SEED_PASSWORD = "craftly-dev-2025";

interface SeedUser {
  email: string;
  username: string;
  name: string;
  role: UserRole;
  plan: Plan;
  credits: number;
}

const SEED_USERS: SeedUser[] = [
  {
    email: ADMIN_EMAIL,
    username: "admin",
    name: "Ali (Admin)",
    role: UserRole.ADMIN,
    plan: Plan.MAX,
    credits: 600,
  },
  {
    email: "test-free@craftly.local",
    username: "free",
    name: "Free Tester",
    role: UserRole.USER,
    plan: Plan.FREE,
    credits: 15,
  },
  {
    email: "test-pro@craftly.local",
    username: "pro",
    name: "Pro Tester",
    role: UserRole.USER,
    plan: Plan.PRO,
    credits: 200,
  },
];

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

async function seedUser(u: SeedUser, passwordHash: string): Promise<User> {
  const user = await db.user.upsert({
    where: { email: u.email },
    update: {
      role: u.role,
      name: u.name,
      username: u.username,
      passwordHash,
      emailVerified: new Date(),
    },
    create: {
      email: u.email,
      username: u.username,
      name: u.name,
      role: u.role,
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await db.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, plan: u.plan, status: "ACTIVE" },
    update: { plan: u.plan, status: "ACTIVE" },
  });

  await db.creditBalance.upsert({
    where: { userId: user.id },
    create: { userId: user.id, credits: u.credits, resetsAt: nextMonth },
    update: { credits: u.credits, resetsAt: nextMonth },
  });

  return user;
}

async function main() {
  console.log("→ Seeding database…\n");

  const passwordHash = await hashPassword(SEED_PASSWORD);
  for (const u of SEED_USERS) {
    console.log(
      `  · ${u.role.padEnd(5)} · ${u.plan.padEnd(5)} · ${u.credits.toString().padStart(3)} cr · ${u.email}`,
    );
    await seedUser(u, passwordHash);
  }

  console.log("\n  · AIConfig rows for 7 tools");
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

  console.log("\n✓ Seed complete.\n");
  console.log("How to log in:");
  console.log("  1. pnpm dev");
  console.log("  2. Open http://localhost:3000/signin");
  console.log("  3. Pick \"Email / username\" mode and use any account below.");
  console.log("");
  console.log(`Shared dev password: \x1b[33m${SEED_PASSWORD}\x1b[0m`);
  console.log("");
  console.log("Test accounts:");
  for (const u of SEED_USERS) {
    const tag = u.role === "ADMIN" ? " [admin panel]" : "";
    console.log(
      `  · ${u.username.padEnd(8)} / ${u.email.padEnd(32)} → ${u.plan} plan, ${u.credits} cr${tag}`,
    );
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
