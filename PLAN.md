# PLAN.md — {{BRAND_NAME}} Build Plan

> Living document. If reality diverges from this plan, **update this file** rather than letting it rot. Each phase must be approved by the user before code is written.

---

## Product summary

AI-powered SaaS for Etsy sellers. Paste-based (no Etsy API, no scraping). 6 paid AI tools (credit-gated) + 2 free SEO-magnet tools. Three tiers (Free / Pro / Max). Built greenfield on Next.js 15 + Prisma + Postgres + Vercel AI SDK, deployed to Hostinger VPS.

---

## Routes (canonical)

### Marketing (public, SSR)

- `/` — landing (Stripe-inspired, dark + light)
- `/pricing` — monthly/annual toggle
- `/tools` — hub
- `/tools/keyword-generator`
- `/tools/tag-generator`
- `/tools/title-generator`
- `/tools/description-generator`
- `/tools/listing-analyzer`
- `/tools/shop-analyzer`
- `/tools/fee-calculator` — **FREE live tool**
- `/tools/events-calendar` — **FREE live tool**
- `/about`, `/contact`, `/terms`, `/privacy`, `/refund-policy`
- `/blog`, `/blog/[slug]` — MDX, Phase 9

### Auth

- `/signin`, `/signup`, `/verify-email`

### App (authed)

- `/app` — dashboard
- `/app/keyword-generator`
- `/app/tag-generator`
- `/app/title-generator`
- `/app/description-generator`
- `/app/listing-analyzer`
- `/app/shop-analyzer`
- `/app/history`
- `/app/billing`
- `/app/settings`

### Admin (role-gated)

- `/admin` — dashboard
- `/admin/users`
- `/admin/subscriptions`
- `/admin/ai-config` — per-tool model swap, system prompt editor, encrypted key rotation, "Test" button
- `/admin/usage`
- `/admin/announcements`

### Marketing tool page anatomy

Each of the 6 paid tool marketing pages must include:

1. H1 + value prop + Lottie hero
2. What it does (with example)
3. Who it's for
4. How it works (3-step illustration)
5. Example output
6. FAQ (with `schema.org/FAQPage` JSON-LD)
7. Related tools (internal linking)
8. CTA

---

## Database schema (Prisma)

| Model           | Key fields / notes                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`          | id, email, emailVerified, passwordHash, name, image, role (USER\|ADMIN), deletedAt, timestamps                                                                               |
| `Subscription`  | userId (unique), plan (FREE\|PRO\|MAX), paddleSubId, status, renewsAt, cancelledAt                                                                                           |
| `CreditBalance` | userId (PK), credits, resetsAt, updatedAt                                                                                                                                    |
| `UsageLog`      | id, userId, tool, creditsUsed, modelUsed, provider, inputTokens, outputTokens, costUsd, durationMs, status, createdAt — indexed on (userId, createdAt) and (tool, createdAt) |
| `Generation`    | id, userId, tool, input (Json), output (Json), isPinned, deletedAt, createdAt — indexed on (userId, tool, createdAt)                                                         |
| `AIConfig`      | id, tool (unique), provider, model, fallbackProvider, fallbackModel, temperature, maxTokens, systemPrompt, updatedAt, updatedBy                                              |
| `ApiKey`        | id, provider (unique), encryptedKey (AES-256-GCM), isActive, monthlyBudgetUsd, updatedAt                                                                                     |
| `Announcement`  | id, title, body, audience, isActive, createdAt, expiresAt                                                                                                                    |

---

## AI router contract (`lib/ai/router.ts`)

```
callTool({ tool, userPlan, userId, input }) =>
  1. Load AIConfig for tool from DB (60s cache).
  2. If userPlan === "MAX" AND tool in [listing_analyzer, shop_analyzer]:
       use premium model (Claude Sonnet 4.6)
     else: use configured provider/model.
  3. Decrypt API key from ApiKey table (AES-256-GCM, ENCRYPTION_KEY env).
  4. Stream via Vercel AI SDK.
  5. On success: log UsageLog + deduct credits ATOMICALLY (one Postgres tx).
  6. On failure: try fallbackProvider/fallbackModel.
  7. On both failing: refund credits, log failure, surface error.
  8. Retry transient failures (5xx, 429) with exponential backoff, max 2 retries.
  9. Timeouts: 30s for generators, 90s for analyzers.
```

---

## Environment variables (will live in `.env.example`)

```
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_NAME
NODE_ENV

DATABASE_URL
REDIS_URL

AUTH_SECRET                # openssl rand -base64 32
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET

RESEND_API_KEY
EMAIL_FROM

ENCRYPTION_KEY             # openssl rand -hex 32 (32 bytes for AES-256-GCM)

PADDLE_API_KEY
PADDLE_WEBHOOK_SECRET
PADDLE_PRO_PRICE_ID
PADDLE_MAX_PRICE_ID
PADDLE_PRO_ANNUAL_PRICE_ID
PADDLE_MAX_ANNUAL_PRICE_ID

OPENROUTER_API_KEY
ANTHROPIC_API_KEY
TOGETHER_API_KEY

SENTRY_DSN
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

---

## Build phases

> One phase at a time. **Propose 3–5 step plan → wait for approval → implement → update CHANGELOG → request review.**

### Phase 0 — Setup

- Next.js 15 + TypeScript strict + Tailwind v4 + shadcn/ui scaffold
- Docker Compose for Postgres 16 + Redis 7
- `.env.example` with every var from §Environment variables
- `.gitignore`, `prettier`, `eslint` config
- README with local dev instructions

### Phase 1 — Foundation

- Prisma schema + first migration (all models from §Database schema)
- Auth.js v5 (magic link via Resend + Google OAuth + credentials/bcrypt)
- Dark/light toggle via next-themes
- App shell: navbar, footer, mobile menu
- Base typography & design tokens

### Phase 2 — Marketing pages

- Landing (Stripe-inspired hero, Framer Motion, Lottie)
- `/pricing` with monthly/annual toggle
- `/tools` hub
- 6 paid tool marketing pages (full anatomy)
- 2 free tool marketing pages
- Legal pages (`/terms`, `/privacy`, `/refund-policy`)
- `/about`, `/contact`

### Phase 3 — Free tools live

- `/tools/fee-calculator` — client-side React
- `/tools/events-calendar` — static JSON, filterable

### Phase 4 — Billing

- Paddle Checkout integration
- Webhook handler: sub created / updated / cancelled / past_due
- `/app/billing` page
- Monthly credit reset cron

### Phase 5 — AI Router + 4 generators

- `/lib/ai/router.ts` + provider files
- AES-GCM encrypted key storage
- Atomic credit deduction (Postgres tx)
- Tag / Title / Keyword / Description generators with streaming + history

### Phase 6 — Premium tools

- Listing Analyzer (Claude Haiku, Sonnet on Max)
- Shop Analyzer (Claude Haiku, Sonnet on Max)

### Phase 7 — Admin

- `/admin` dashboard
- User management
- AI-config live editor with **Test** button (runs sample input, shows output + token usage + estimated cost before saving)
- Encrypted key rotation (only "last 4 chars" displayed back)
- Usage / cost analytics
- Announcements

### Phase 8 — Polish & launch

- Lottie + Framer Motion polish
- OG images, sitemap.xml, robots.txt
- Sentry + Plausible self-hosted
- Daily Postgres backups to Backblaze B2
- Lighthouse ≥ 90 audit
- Full end-to-end test

### Phase 9 — Post-launch

- MDX blog at `/blog`
- Niche Finder (TBD)
- Bulk operations (TBD)

---

## Appendix A — SEO / Topical Authority Matrix

> Locked spec. Every marketing page in Phase 2 must hit these clusters. Each page uses one primary keyword, weaves in 8–12 semantic/LSI variants, dedicates an H2 or FAQ entry to each AEO question intent, and sprinkles trust signals in hero/CTA/FAQ.

### A.1 Universal SXO / AIO / GEO / AEO anatomy (every marketing page)

```
<Hero>
  H1                    ← primary keyword, natural phrasing
  TL;DR card (30–50w)   ← AIO/GEO direct-answer capture
  CTA + Lottie animation
<DefinitionBlock>       ← "What is [tool]?" — AEO direct answer
  First sentence: definition + named entities (Etsy, [Brand], tool category)
  2nd paragraph: 2–3 citable stats with source links + year
<TrustStrip>            ← logos / stat row ("trusted by N sellers", "AI-powered", etc.)
<WhoItsFor>             ← 3 persona cards (SXO persona match)
<HowItWorks>            ← 3 steps, Lottie sequence; each step has its own H3 (PAA-targetable question)
<ExampleOutput>         ← Before/After comparison (AIO loves comparison tables)
<Features>              ← 4–6 benefit cards (unDraw)
<ComparisonTable>       ← "How [tool] compares" — high AIO citation rate
<DeepFAQ>               ← 8–12 Q&As with FAQPage JSON-LD
<RelatedTools>          ← 3 internal links — topical authority graph
<SocialProof>           ← testimonials (Person schema) + trust signals
<FinalCTA>
```

**Sitewide AIO / GEO / AEO rules**

| Rule                                                                                                  | Why                                              |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| First 100 words: definition + primary keyword + 1 citable stat with source                            | Boosts AI Overviews + Perplexity citation rate   |
| Every H2 phrased as a question OR a "X: definition" pattern                                           | AEO / PAA harvesting                             |
| Lists use explicit numbers ("1.", "2.") inside text — AI parsers index these better than CSS counters | GEO formatting preference                        |
| Stats paired with source + year ("Etsy reported 96.3M active buyers, Q3 2024 10-Q")                   | E-E-A-T + GEO citability                         |
| Author byline + `dateModified` on every page                                                          | E-E-A-T                                          |
| `llms.txt` + `/llms-full.txt` at root                                                                 | Clean AI ingestion (ChatGPT, Claude, Perplexity) |
| Self-canonical, OG image per page, meta description ≤ 155 chars with primary keyword in first 60      | Classic SEO floor                                |
| Schema markup: `SoftwareApplication` + `FAQPage` + `HowTo` + `BreadcrumbList` per tool page           | Rich results + AIO eligibility                   |

### A.2 Trust-signal vocabulary (use across hero, CTA, badges, FAQ answers)

**Universal (every page):**

- "made by an Etsy seller, for Etsy sellers"
- "AI-powered" / "powered by Claude" / "powered by GPT-class models"
- "real-time" · "instant" · "results in seconds" · "in under 10 seconds"
- "data-driven" · "research-backed" · "based on real Etsy listings"
- "secure & private" · "encrypted with AES-256" · "GDPR compliant"
- "as featured in [pub]" — only when true; never fabricate
- "rated 4.9/5 by sellers" — only when true
- "trusted by N+ Etsy sellers" — only when true
- "since 2026" / "last updated [date]"

**Free-tool-specific (Fee Calculator, Events Calendar):**

- "100% free" · "free forever"
- "no signup required" · "no credit card needed" · "no email required"
- "instant results" · "use it in your browser"
- "open source–friendly" / "no tracking"

**Paid-tool-specific (Tag/Title/Keyword/Description/Listing/Shop):**

- "save 2+ hours per listing"
- "1-click optimization"
- "results in under 10 seconds"
- "cancel anytime" · "30-day money-back guarantee"
- "no contracts" · "no commitment"
- "credits roll over within billing cycle" _(if true — confirm with user)_
- "upgrade or downgrade anytime"

**E-E-A-T credibility (about / footer / author bylines):**

- "Built by sellers, refined by AI engineers"
- "Verified" · "Official" _(use carefully; only where truthful)_
- "Privacy-first" · "Your data is yours" · "We never sell your data"
- "100% AI-generated, human-curated"

### A.3 Per-page keyword clusters

#### Free SEO magnets (highest priority — traffic anchors)

**`/tools/fee-calculator`**

- **Primary:** etsy fee calculator
- **Semantic / LSI:** etsy seller fees, etsy listing fee, etsy transaction fee, etsy payment processing fee, etsy offsite ads fee, etsy regulatory operating fee, etsy plus subscription cost, etsy profit calculator, etsy pricing calculator, etsy fees 2026, etsy cost breakdown, cost of selling on etsy, etsy fee percentage, etsy VAT, etsy international fees, profit margin calculator etsy
- **AEO questions:** how much does etsy charge per sale · what are all the etsy seller fees · how do I calculate etsy profit · does etsy take a percentage · why are etsy fees so high · do you pay etsy fees on shipping · etsy fees for international sellers · what is the etsy regulatory operating fee · what is etsy's offsite ads fee
- **Trust signals:** "100% free" · "no signup" · "updated for 2026 fees" · "used by 10k+ sellers" _(when true)_

**`/tools/events-calendar`**

- **Primary:** etsy holiday calendar
- **Semantic / LSI:** etsy seasonal selling, etsy events calendar, ecommerce holiday calendar, gift-giving holidays, q4 etsy prep, valentine's day etsy, mother's day etsy, christmas etsy deadlines, halloween etsy trends, back-to-school etsy, niche holidays for sellers, etsy shipping cutoff dates, etsy seasonal trends, peak selling season, year-round etsy planning, etsy seller calendar 2026
- **AEO questions:** when is the best time to sell on etsy · when should I start prepping for q4 on etsy · what holidays should etsy sellers prepare for · when is etsy busiest · what's the etsy christmas shipping deadline · what sells on etsy in [month] · how early should I list seasonal products
- **Trust signals:** "free forever" · "updated weekly" · "covers US + UK + EU holidays" · "no email required"

#### Paid AI tools

**`/tools/tag-generator`**

- **Primary:** etsy tag generator
- **Semantic / LSI:** etsy tags, etsy tag ideas, 13 tag limit, multi-word tags, long-tail tags, etsy seo tags, tag relevance, etsy attributes vs tags, tag suggestions, related tags, etsy tag optimization, etsy tag tool, free tag generator, ai etsy tags, listing tags, etsy keyword tags
- **AEO questions:** how many tags can you use on etsy · do etsy tags still matter · what are the best tags for etsy · should etsy tags match the title · how often should I change etsy tags · what's the difference between tags and attributes on etsy
- **Trust signals:** "AI-powered" · "1-click 13 tags" · "results in 5 seconds" · "based on real Etsy search data"

**`/tools/title-generator`**

- **Primary:** etsy title generator
- **Semantic / LSI:** etsy listing title, etsy title optimizer, 140 character limit, front-loaded keywords, etsy title formula, etsy title structure, title best practices, listing title generator, etsy title length, ai title writer, seo title for etsy, etsy title examples, title rewrite
- **AEO questions:** how long should etsy titles be · what makes a good etsy title · how do I write etsy titles that rank · should etsy titles match tags · does the first word in etsy title matter · how often should I update etsy titles
- **Trust signals:** "save 2+ hours per listing" · "AI-trained on Etsy best practices" · "instant 5-variation output"

**`/tools/keyword-generator`**

- **Primary:** etsy keyword generator
- **Semantic / LSI:** etsy keyword research, etsy keyword tool, find etsy keywords, etsy seo keywords, long-tail keywords etsy, etsy search volume, keyword difficulty, etsy buyer intent, niche keywords, related searches etsy, etsy autocomplete, etsy search bar suggestions, keyword discovery, ai keyword research, etsy niche research
- **AEO questions:** how to find etsy keywords · what's the best free etsy keyword tool · how does etsy search work · what keywords sell best on etsy · how do I do etsy seo · do hashtags work on etsy
- **Trust signals:** "AI-powered keyword discovery" · "data-driven" · "research-backed" · "results in under 10 seconds"

**`/tools/description-generator`**

- **Primary:** etsy description generator
- **Semantic / LSI:** etsy listing description, product description writer, etsy description template, description seo, features and benefits, first sentence hook, scannable copy, listing storytelling, etsy description length, call to action, customer questions, shipping info, ai product description, copywriter for etsy
- **AEO questions:** how do I write a good etsy description · what should an etsy description include · how long should etsy descriptions be · does etsy index descriptions · what's the first line of an etsy description for · how to write a description that converts
- **Trust signals:** "AI copywriter trained on top-converting listings" · "1-click rewrite" · "tone control: friendly / professional / playful"

**`/tools/listing-analyzer`**

- **Primary:** etsy listing analyzer
- **Semantic / LSI:** etsy listing audit, listing checker, etsy listing score, listing optimization, visibility score, ranking factors, listing quality, title score, tag analysis, photo recommendations, attribute completeness, etsy listing health, etsy seo audit, ai listing review, listing diagnostic
- **AEO questions:** why isn't my etsy listing selling · how do I check my etsy listing seo · what makes an etsy listing rank · how to improve an etsy listing · what is etsy listing quality score · why is my listing not showing up
- **Trust signals:** "deep AI audit" · "powered by Claude" · "actionable in seconds" · "no Etsy API needed — just paste your listing"

**`/tools/shop-analyzer`**

- **Primary:** etsy shop analyzer
- **Semantic / LSI:** etsy shop audit, etsy store checker, shop optimization, branding consistency, shop announcement, etsy banner, shop policies, niche focus, conversion rate, etsy traffic sources, shop seo, about section, listing diversity, ai shop audit, etsy storefront review
- **AEO questions:** how do I audit my etsy shop · why is my etsy shop not getting views · how to optimize an etsy shop · what should an etsy shop announcement say · how many listings should I have on etsy · how to improve etsy shop conversion
- **Trust signals:** "premium AI audit" · "Claude Sonnet on Max plan" · "covers branding + SEO + conversion" · "30+ checks per shop"

#### Hub & landing

**`/` (landing)**

- **Primary:** ai tools for etsy sellers
- **Semantic / LSI:** etsy seller software, etsy seo tools, etsy listing optimization, etsy seller helper, ai for etsy, etsy growth tools, etsy assistant, etsy automation, etsy listing ai, etsy productivity, etsy seller dashboard, all-in-one etsy tool, etsy seo suite, etsy seller toolkit 2026
- **Trust signals (sitewide hero):** "AI-powered" · "no Etsy API required — paste and go" · "trusted by [N] sellers" _(when true)_ · "free tools included" · "30-day money-back" · "made by sellers, refined by AI engineers"

**`/tools` (hub)**

- **Primary:** etsy seller tools
- **Semantic / LSI:** free etsy tools, etsy seo software, etsy listing tools, etsy keyword tools, etsy analytics tools, etsy productivity suite, etsy ai suite, etsy shop tools, tools for etsy sellers 2026, best etsy tools

**`/pricing`**

- **Primary:** [brand] pricing
- **Semantic / LSI:** etsy seo tool pricing, etsy ai tool cost, monthly vs annual etsy tool, free etsy tools, credit-based pricing
- **Trust signals:** "cancel anytime" · "no contracts" · "30-day money-back guarantee" · "upgrade/downgrade anytime" · "secure checkout via Paddle (MoR)"

### A.4 Schema markup matrix

| Page type           | Required schemas                                                            |
| ------------------- | --------------------------------------------------------------------------- |
| Landing             | `Organization`, `WebSite` (with `SearchAction`), `SoftwareApplication`      |
| Tool marketing page | `SoftwareApplication` (with `offers`), `HowTo`, `FAQPage`, `BreadcrumbList` |
| Free tool live page | `SoftwareApplication` + `FAQPage` + `HowTo`                                 |
| Pricing             | `Product` × 3 (Free/Pro/Max) with `Offer`                                   |
| About               | `AboutPage`, `Organization` with founder/team                               |
| Blog (Phase 9)      | `Article`, `Person` (author), `BreadcrumbList`                              |
| Sitewide            | `Organization` in root layout, `BreadcrumbList` everywhere                  |

Plus `llms.txt` + `llms-full.txt` at root for AI engine ingestion.

---

## Open questions (to resolve before Phase 0)

See the conversation; this section will be updated after the user answers.
