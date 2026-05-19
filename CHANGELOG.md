# Changelog

All notable changes to Craftly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — Phase 6 (Premium tools: Listing & Shop Analyzers)

Both deep-audit tools are now live, reusing the Phase 5 atomic credit + router infrastructure. No code duplication — the router already had `MAX_BOOST_TOOLS` wired for the Sonnet-4.6 boost.

#### Schemas (`lib/ai/schemas.ts`)

- **`listingAnalyzerInput`** — title, tags (≤13), description (≤5000 chars), optional attributes / price / photo count / category.
- **`listingAnalyzerOutput`** — overall 0-100 score, **five axes** (`titleSeo`, `tagRelevance`, `descriptionQuality`, `photoCoverage`, `attributes`), each with sub-score + explanation + 1-3 fixes. Plus `topWins[3]`, `topFixes[3]` (ROI-ordered), and `quickWin` (single sentence).
- **`shopAnalyzerInput`** — shop name, About, optional announcement, niche, listing count, optional review count + top listings text.
- **`shopAnalyzerOutput`** — overall 0-100 score, **five pillars** (`branding`, `seo`, `conversion`, `policy`, `diversity`), each with score + reasoning. Plus `topWins[3]`, `topFixes[3]`, and `brandVoiceNotes` (1-2 sentence assessment of voice consistency between About + announcement + listings).
- **`TOOL_TIMEOUT_MS`** — per-tool timeout map. Generators: 30s. Keyword: 45s. Analyzers: **90s**. Replaces the hard-coded 30s in the router.
- **`buildUserPrompt`** — added cases for both analyzers that format the input into a clean structured prompt the model receives.

#### Router (`lib/ai/router.ts`)

- Now reads `TOOL_TIMEOUT_MS[tool]` instead of the hard-coded 30s. Analyzers automatically get the longer window without any other change.
- `MAX_BOOST_TOOLS` already included both analyzers, so Max-tier subscribers transparently get Claude Sonnet 4.6 on these — primary attempt is the boost, fallback is Haiku.

#### API (`app/api/ai/[tool]/route.ts`)

- Added `listing-analyzer` and `shop-analyzer` to the allowed slug set. No other changes needed — the route is generic and dispatches by slug.

#### UI

- **`components/app/score-display.tsx`** — shared score visualization primitives:
  - `<ScoreRing>` — animated SVG ring with score in the center, color-toned by band (≥80 success, ≥50 warning, <50 destructive). Two sizes.
  - `<ScoreBar>` — horizontal bar with label + score, color-toned same as ring.
  - `<ScoredAxisCard>` — bar + reasoning + bulleted fixes per axis.
  - `<WinsAndFixes>` — two-column "Top wins" / "Top fixes (by ROI)" panel with optional quick-win callout.
- **`/app/listing-analyzer`** — paste-based form (title, tags CSV, description, optional attributes/price/photos/category) → big score ring + verdict + wins/fixes/quick-win + per-axis cards with reasoning and fixes.
- **`/app/shop-analyzer`** — paste-based form (shop name, About, announcement, listings count, reviews, top listings) → score ring + verdict + wins/fixes + pillar bars + brand-voice notes block.
- Both UIs reuse `<ToolShell>` with `transformBody` adapters (e.g., CSV-tags → string[] for listing input; listingCountText → number for shop input).

#### Polish

- App sub-nav now includes **Listing audit** and **Shop audit** tabs alongside the generators.
- `/app/history` summarizer extended: analyzer rows show `"Score 64/100 — fix: …"` previews instead of `"—"`.
- Mock provider extended with deterministic responses for both analyzers (`listing-analyzer` → 64/100 with the full 5-axis breakdown; `shop-analyzer` → 58/100 with 5-pillar breakdown + brand voice notes). MOCK_AI mode now exercises every tool end-to-end.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — 20 routes, including `/app/listing-analyzer` and `/app/shop-analyzer`
- `pnpm format` clean

### To use in dev

```powershell
pnpm dev
```

Sign in (mock mode is on by default). Try:
- http://localhost:3000/app/listing-analyzer — paste any listing; see the 5-axis score and prioritized fixes.
- http://localhost:3000/app/shop-analyzer — paste your About + announcement; see the 5-pillar score plus brand-voice notes.

### Added — Phase 5 (AI Router + 4 generators)

The product is now real. Sign in, pick a tool, paste your listing, and AI writes tags/titles/keywords/descriptions for you. Every call is credit-gated, atomically deducted, and logged for usage analytics.

#### Core infrastructure

- **`lib/encryption.ts`** — AES-256-GCM symmetric encryption for at-rest API key storage. Format: `base64(iv ‖ ciphertext ‖ authTag)`, 12-byte IV, 16-byte auth tag, key from `ENCRYPTION_KEY` env (32 bytes hex). `encrypt()`, `decrypt()`, `maskKey()` for display-only display.
- **`lib/credits.ts`** — atomic credit lifecycle:
  - `reserveCredits(userId, tool, cost)` — Prisma `Serializable` transaction wrapping `SELECT FOR UPDATE` semantics on `CreditBalance`. Throws `InsufficientCreditsError` (custom error class) when balance < cost; never partially deducts.
  - `refundCredits(userId, cost)` — increment for failure recovery.
  - `recordUsage(userId, tool, creditsUsed, metrics)` — inserts `UsageLog` row with full token/cost/duration metrics.
- **`lib/ai/schemas.ts`** — typed input + output schemas (zod) for all 4 generators, plus prompt builders, tool ↔ slug enum maps, `CREDIT_COST` table, `MAX_BOOST_TOOLS` (analyzers) and `MAX_BOOST_MODEL` (Claude Sonnet 4.6).
- **`lib/ai/providers/`**:
  - `index.ts` — `getModel({ provider, model, apiKey })` returning a Vercel AI SDK `LanguageModel` from one of: Anthropic, OpenRouter, Together. `MOCK_AI=true` short-circuits to the mock for local dev. Includes `estimateCost(model, in, out)` per-1K-token cost table.
  - `mock.ts` — `LanguageModelV2` implementation that bypasses the network and returns deterministic JSON per tool. Drop-in for any provider so the UI works without burning real API calls.
- **`lib/ai/router.ts`** — orchestrator:
  1. Load `AIConfig` (cached 60s in-memory).
  2. Reserve credits atomically.
  3. Build attempts list: Max-tier boost (if applicable) → primary → fallback.
  4. For each attempt: decrypt API key from DB (falls back to env var), `generateObject()` with 30s timeout, on success record `SUCCESS` usage and return.
  5. On any attempt failure: record `FAILED` usage with classified error code (`RATE_LIMITED` / `AI_ERROR` / `VALIDATION` / `TIMEOUT`) and continue.
  6. If all attempts fail: `refundCredits()` and throw `AIRouterError`.

#### API + UI

- **`app/api/ai/[tool]/route.ts`** — POST handler: session-gates, validates body against per-tool zod schema, calls router, persists `Generation`, returns `{ output, modelUsed, provider, creditsUsed, creditsRemaining }`. Returns 402 on `InsufficientCreditsError`, 429/504/502 with code on `AIRouterError`.
- **`components/app/tool-shell.tsx`** — generic `<ToolShell>` shared by all 4 generators. Handles state, submit, loading, error display, result rendering, credit-remaining indicator, link to history. Includes `TextInput`, `Textarea`, `CopyButton` primitives. Supports `transformBody` for form-state → API-body adapters.
- **4 generator UI pages** in `app/(app)/app/{tag,title,keyword,description}-generator/`:
  - **Tag Generator** — title + details inputs → 13 tag grid with per-tag and copy-all copy buttons.
  - **Title Generator** — description + attributes (CSV → array transform) → 5 numbered titles with "pick" indicator, per-title char count, copy-all.
  - **Keyword Generator** — seed + niche → 30 keywords with intent badges (high/med/low), filter chips, copy-high-intent / copy-all buttons.
  - **Description Generator** — bullets (newline → array transform) + tone selector → rendered description card with word count and copy.
- **`/app/history`** — last 50 generations with tool badge, summarized output preview, timestamp, deep-link to the tool. Empty state with CTA.
- **App sub-nav** — added tabs for Tags / Titles / Keywords / Descriptions alongside Dashboard / History / Admin. Horizontally scrolls on small viewports.

#### Decisions

- **Non-streaming** for Phase 5 generators. The four tools complete in 5–15 seconds and structured-JSON output is the priority. Streaming reserved for Phase 6 analyzers, where the longer wait benefits from progressive rendering.
- **Mock mode toggle** (`MOCK_AI=true`) so the entire flow can be developed and demoed end-to-end without provider keys. Real keys take over automatically when set.
- **Two-key resolution**: prefer DB-stored encrypted key per provider (set via Phase 7 admin UI), fall back to env var for dev.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — now 18 routes including `/api/ai/[tool]` and 4 new generator UIs.
- `pnpm format` clean

### To use in dev

```powershell
pnpm db:up                      # if not already
pnpm db:migrate                 # apply schema (creates AIConfig + CreditBalance tables)
pnpm db:seed                    # seeds admin + AIConfig rows for all 6 tools

# Either set real provider keys in .env.local:
#   OPENROUTER_API_KEY=...
#   ANTHROPIC_API_KEY=...
# Or enable mock mode:
#   MOCK_AI=true

pnpm dev
```

Then sign in, hit `/app/tag-generator`, paste a product title, click Generate.

### Added — Phase 3 (Live free tools)

The two free tools are now interactive — live above the fold, with the same rich SEO content stacked below. Both work entirely client-side, no API, no signup, no data leaves the browser.

- **`/tools/fee-calculator`** — interactive Etsy fee calculator at `components/tools/fee-calculator.tsx`. Two-column layout (inputs left, live results right): item price, shipping, country (US / UK / CA / AU / EU / Other), toggles for Offsite Ads + over-$10K (12% vs 15%) + Etsy Plus. Live breakdown of listing fee, transaction fee (6.5%), payment processing (country-specific), Offsite Ads fee (if applicable), regulatory operating fee (country-specific), Etsy Plus monthly. Shows total fees, effective fee rate, and net payout. Net-payout card turns red if negative (under-pricing alert).
- **`/tools/events-calendar`** — interactive seasonal-planning calendar at `components/tools/events-calendar.tsx`. Filterable by category (major holidays / gift-giving / weddings / seasonal / niche / back-to-school) and region (US / UK / EU / Global). Each event card shows date, "days to go" badge if within 60 days, recommended list-by date, US ship-by date, and category niches. 28 events seeded for 2026 covering Q1–Q4 plus year-round niche moments.
- **`lib/content/fee-calculator.ts`** — typed rate tables for 6 countries (processing %, processing flat, regulatory %) plus pure `calculateFees()` function. All rates sourced from Etsy Seller Handbook. Updated for 2026.
- **`lib/content/events.ts`** — typed `SellerEvent` records with prep/ship dates, categories, regions, niches. 28 events covering the full 2026 calendar — major holidays (Christmas, Valentine's, Mother's Day, etc.), niche (Pride, Galentine's, Earth Day, AAPI Heritage, World Mental Health Day), seasonal (Memorial Day, Labor Day, back-to-school), and weddings.
- **`ToolMarketingSections`** (`components/marketing/tool-marketing-sections.tsx`) — extracted shared "below the hero" content: definition block, personas, how-it-works, before/after, features, comparison, FAQ, related tools, CTA. Now reused by the dynamic `/tools/[slug]` route AND the two static free-tool pages, so the live tools share the same SEO surface area as the marketing-only pages.
- **`/tools/[slug]` refactor** — now only generates static params for the 6 paid tools. The two free tools have their own static routes which take priority in Next.js routing.

### Page anatomy for free tools

```
┌─ Interactive hero ──────────────────┐
│ H1 + TL;DR + trust strip            │
│ ┌─────────────────────────────┐     │
│ │ <LIVE TOOL>                 │     │
│ │ (Calculator or Calendar)    │     │
│ └─────────────────────────────┘     │
├─ Anchor strip ──────────────────────┤
│ → What it does · How · FAQ          │
├─ Definition block (with cited stats)┤
├─ Personas                           │
├─ How it works (3 animated steps)    │
├─ Features                           │
├─ Comparison table                   │
├─ FAQ (FAQPage schema)               │
├─ Related tools                      │
└─ CTA                                ┘
```

This is the structure Google's AIO and Perplexity reward: live functionality above, rich educational context below.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — 15 routes: `/tools/fee-calculator` and `/tools/events-calendar` now appear as their own static routes alongside the dynamic `/tools/[slug]`.
- `pnpm format` clean.

### Added — Phase 2 wave 2 (Remaining 7 tool marketing pages)

Filled `lib/content/tool-pages.ts` with full SEO content for the 7 tools that previously rendered fallback copy. Each entry follows the same typed schema established in Wave 1 and the SEO matrix in `PLAN.md` Appendix A:

- **Title Generator** — primary keyword `etsy title generator`. AEO targets: "how long should etsy titles be", "what makes a good etsy title", "should etsy titles match the tags", "does the first word of an etsy title matter". 6 features, 7-row comparison, 8-item FAQ. Cited stats: 140-char limit, 60-char weighted-first prefix, 5 variations per run.
- **Keyword Generator** — primary keyword `etsy keyword generator`. AEO targets: "how do I find the best keywords for etsy", "how does etsy search work", "do hashtags work on etsy". 6 features, 6-row comparison, 8-item FAQ. Cited stats: 30 keywords per seed, 3 intent tiers, <10s generation.
- **Description Generator** — primary keyword `etsy description generator`. AEO targets: "how do I write a good etsy description", "what should an etsy description include", "what should the first sentence of an etsy description be". 6 features, 7-row comparison, 8-item FAQ. Cited stats: 180–280 words, 3 tone options, <15s generation.
- **Listing Analyzer** — primary keyword `etsy listing analyzer`. AEO targets: "why isn't my etsy listing selling", "how do I check my etsy listing seo", "what makes an etsy listing rank", "what is etsy's listing quality score". 6 features, 7-row comparison, 8-item FAQ. Cited stats: 5+ axes, 0–100 score, <30s audit, Sonnet 4.6 on Max tier.
- **Shop Analyzer** — primary keyword `etsy shop analyzer`. AEO targets: "how do I audit my etsy shop", "why is my etsy shop not getting views", "what should an etsy shop announcement say", "does etsy rank shops or just listings". 6 features, 7-row comparison, 8-item FAQ. Cited stats: 30+ checks, 5 pillars (brand/SEO/CVR/policy/diversity), <60s.
- **Fee Calculator** (free) — primary keyword `etsy fee calculator`. AEO targets: "how much does etsy charge per sale", "what are all the etsy seller fees", "what is the etsy regulatory operating fee", "what is etsy's offsite ads fee". 6 features, 6-row comparison, 9-item FAQ. Cited stats: $0.20 listing fee, 6.5% transaction, 15% Offsite Ads — all attributed to Etsy Seller Handbook.
- **Events Calendar** (free) — primary keyword `etsy holiday calendar`. AEO targets: "when is the best time to sell on etsy", "when should I start prepping for q4", "what's the etsy christmas shipping deadline", "how early should I list seasonal etsy products". 6 features, 6-row comparison, 8-item FAQ. Cited stats: 40+ events/year, 3 regions, weekly updates.

**Result:** all 8 `/tools/[slug]` pages now render with full anatomy — hero with TL;DR, definition block with cited stats, 3-persona "who it's for", 3-step how-it-works with animated SVGs, before/after example, 6 features, comparison table, 8-item FAQ, related-tools cross-links, final CTA. Each page emits `SoftwareApplication` + `FAQPage` + `HowTo` + `BreadcrumbList` JSON-LD.

**Icons:** expanded `lib/content/tool-pages.ts` lucide imports to 24 icons (added `AlertCircle`, `Award`, `BarChart3`, `Calculator`, `CalendarDays`, `Compass`, `DollarSign`, `FileText`, `Gift`, `Globe`, `Heading1`, `ListChecks`, `PieChart`, `Receipt`, `Search`, `Stethoscope`, `Store`, `Target`, `Truck`, `Wand2`).

**Verification:** `pnpm typecheck` clean, `pnpm lint` clean, `pnpm build` green — same 13 routes, but `/tools/[slug]` now serves full content for all 8 slugs instead of falling back for 7 of them.

### Added — Phase 2 wave 1 (Marketing scaffold + landing + tool template)

- **Animated SVG illustrations** — `HeroIllustration` (orbit, floating card, AI prompt bubble, animated dash) and `StepPaste` / `StepGenerate` / `StepRank` for the "how it works" sequence. All CSS-keyframe animated, brand-colored via OKLCH CSS variables, and `prefers-reduced-motion`-aware. Architected so a `<Lottie>` swap-in is a single-component change later.
- **Marketing primitives** in `components/marketing/`:
  - `Hero` (gradient bg, eyebrow, balanced H1, TL;DR, dual CTA, trust strip, illustration slot)
  - `TrustStrip` (4-item benefit row with icons)
  - `Section` + `SectionHeader` (consistent spacing + eyebrow/title/description pattern)
  - `DefinitionBlock` ("What is X?" heading + prose + 3 citable stats with source attribution — AIO/GEO direct-answer capture)
  - `HowItWorks` (3 steps with stagger-able illustration slots)
  - `FeatureGrid` (4–6 icon+title+body cards)
  - `Faq` (accessible accordion with `aria-expanded`/`aria-controls` and `FAQPage` JSON-LD pairing)
  - `Cta` (gradient panel with primary/secondary buttons + trust line)
  - `RelatedTools` (3-link cross-link grid for topical authority graph)
  - `ComparisonTable` (semantic table with highlight column — AIO/Perplexity cite tables ~3× more than prose)
  - `JsonLd` (helper for inline schema.org JSON-LD)
- **SEO infrastructure** in `lib/seo/`:
  - `site.ts` — canonical site metadata (name, URL, tagline, description, brand info)
  - `schemas.ts` — `organizationSchema`, `websiteSchema`, `softwareApplicationSchema`, `faqSchema`, `howToSchema`, `breadcrumbSchema`
  - Root layout now emits `Organization` + `WebSite` JSON-LD sitewide.
- **Content registry** in `lib/content/`:
  - `tools.ts` — single source of truth for all 8 tools (slug, name, hero title, tagline, icon, credit cost, category, model). Used by sitemap, landing tool grid, hub page, and footer.
  - `tool-pages.ts` — typed per-tool marketing content registry (`tldr`, `definition` with stats + citations, `personas`, `steps`, `example` before/after, `features`, `comparison`, `faq`). Fully populated for **Tag Generator**; other 7 tools fall through to a `fallbackToolContent` placeholder until Wave 2.
- **Landing page** (`app/(marketing)/page.tsx`) — full SXO/AIO/GEO/AEO anatomy: hero, trust strip, definition block (96.3M Etsy buyers, 9M+ sellers, 13 tag slots — all cited), 3-step how-it-works with animated SVGs, 8-tool grid (paid + free), 6-feature benefit grid, 8-item FAQ with `FAQPage` schema, and a CTA panel. Emits `SoftwareApplication` + `FAQPage` JSON-LD.
- **Tools hub** (`app/(marketing)/tools/page.tsx`) — split into "AI-powered tools" and "Free tools — no signup" sections; cards show credit cost + AI model + Max-tier upgrade indicator.
- **Pricing page** (`app/(marketing)/pricing/page.tsx`) — 3-plan grid (Free / Pro / Max) with monthly/annual toggle (client component), per-plan feature lists, savings badge on annual, FAQ + CTA. Emits `BreadcrumbList` + `FAQPage` JSON-LD.
- **Tool marketing page template** (`app/(marketing)/tools/[slug]/page.tsx`) — dynamic route with `generateStaticParams` for all 8 slugs and per-tool `generateMetadata`. Renders the full template:
  1. Hero with per-tool trust signals (free vs paid)
  2. DefinitionBlock with citable stats
  3. 3-persona "Who it's for"
  4. HowItWorks (3 numbered steps)
  5. Before/After example cards
  6. FeatureGrid
  7. ComparisonTable (Craftly vs Manual vs Generic ChatGPT)
  8. FAQ with `FAQPage` JSON-LD
  9. RelatedTools cross-links
  10. Final CTA
      Emits `SoftwareApplication` + `FAQPage` + `HowTo` + `BreadcrumbList` JSON-LD.
- **Tag Generator content** — fully written: TL;DR, definition with 3 cited stats, 3 personas, 3 steps, before/after with 13 sample tags, 6 features, 7-row comparison, 9-item FAQ targeting AEO questions ("how many tags can you use on etsy", "do etsy tags still matter", etc.).
- **Sitewide SEO infra:**
  - `app/sitemap.ts` — dynamic sitemap covering all marketing + tool routes with per-route priority and changeFrequency.
  - `app/robots.ts` — disallows `/app`, `/admin`, `/api`; points at the sitemap.
  - `public/llms.txt` — AI-engine-friendly site summary with descriptions of all 8 tools.
- **Session-aware nav** continues to work for the new pages; mobile drawer routes through the marketing pages too.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean (after removing one unused `Heading1` import)
- `pnpm build` green — 13 routes built including `/sitemap.xml`, `/robots.txt`, and 8 static `/tools/[slug]` instances
- `pnpm format` auto-formatted

### Notes / deferred to Wave 2

- 7 of 8 tool pages currently render `fallbackToolContent` placeholders. Wave 2 fills `tool-pages.ts` with full content for Title / Keyword / Description / Listing Analyzer / Shop Analyzer / Fee Calculator / Events Calendar.
- Legal pages (`/terms`, `/privacy`, `/refund-policy`), `/about`, and `/contact` come in Wave 3.
- Real Lottie JSON files can be dropped into `/public/lottie/` and swapped in for the animated SVGs by replacing one component import.

### Added — Phase 1 (Foundation)

- **Route groups:** moved landing into `app/(marketing)/`, added `(auth)`, `(app)`, `(admin)` groups. Each group will own its own layout chrome.
- **Prisma schema** (`prisma/schema.prisma`) with all 12 models:
  - Auth.js v5 tables: `Account`, `Session`, `VerificationToken`.
  - Product models: `User` (soft-delete), `Subscription`, `CreditBalance`, `UsageLog` (indexed on `(userId, createdAt)` + `(tool, createdAt)`), `Generation` (indexed on `(userId, tool, createdAt)`, soft-delete), `AIConfig`, `ApiKey` (encrypted, `lastFour` for display), `Announcement`.
  - Enums: `UserRole`, `Plan`, `SubscriptionStatus`, `Tool`, `AIProvider`, `UsageStatus`, `AnnouncementAudience`.
- **`lib/db.ts`** — Prisma singleton with HMR guard, dev-mode query logging.
- **Auth.js v5** (`lib/auth.ts`) — Resend magic link (dev: link logged to terminal when no `RESEND_API_KEY`; prod: sent via Resend SDK) + Google OAuth + Prisma adapter + JWT session strategy. `user.id` and `user.role` exposed on session/JWT via callbacks (typed in `types/next-auth.d.ts`).
- **`app/api/auth/[...nextauth]/route.ts`** wires Auth.js handlers.
- **`proxy.ts`** (Next 16 renamed `middleware.ts` → `proxy.ts`) gates `/app/*` (auth required) and `/admin/*` (role=ADMIN); preserves `callbackUrl` on redirect to signin.
- **Auth UI:**
  - `/signin` — react-hook-form + zod (via Standard Schema resolver) with email magic-link input and Google OAuth button.
  - `/verify-email` — "Check your inbox" success page.
  - `/auth/error` — friendly error mapping for `Configuration` / `AccessDenied` / `Verification` codes.
  - Shared `(auth)/layout.tsx` with gradient background.
- **`/app` dashboard** — server-side `auth()` gate, credit/plan/generations stat cards, sign-out via server action.
- **`/admin` placeholder** — role-gated landing page (Phase 7 builds the editor).
- **Session-aware `SiteNav`** — shows "Dashboard" for authed users, "Sign in / Get started" otherwise.
- **`MobileNav`** — hamburger + dropdown drawer for <640 px viewports, ESC-to-close, body-scroll lock.
- **`scripts/seed.ts`** — upserts admin user (`aliraza4043627@gmail.com`), MAX subscription, 600-credit balance, and AIConfig rows for all 6 tools (Qwen 7B/32B via OpenRouter for generators; Claude Haiku 4.5 for analyzers).
- **`package.json` scripts:** `db:migrate`, `db:generate`, `db:studio`, `db:seed`.
- **AGENTS.md** updated: tech stack now reflects Next.js 16 and the credentials/bcrypt-dropped auth setup.

### Changed — Phase 1

- **Prisma 7 → Prisma 6.** Prisma 7's default `engineType = "client"` requires a driver adapter or Accelerate URL at PrismaClient construction (`@prisma/adapter-pg` or similar). Setting `engineType = "library"` in the generator did not bypass the runtime check. Pinned to `prisma@^6` for stability; will revisit driver adapters in a later phase.
- **`zodResolver` → `standardSchemaResolver`.** Zod 4.4.x exposes `_zod.version.minor = 4`, but `@hookform/resolvers@5.2.2`'s `zodResolver` types are pinned to zod 4.0.x. Zod 4 implements the Standard Schema spec, so we use `standardSchemaResolver` from `@hookform/resolvers/standard-schema` instead — works with any Standard-Schema-compatible validator.
- **`middleware.ts` → `proxy.ts`.** Next.js 16 deprecated the `middleware` file convention in favor of `proxy`.

### Added — Phase 0 (Local scaffold)

- Next.js 16.2.6 scaffold with TypeScript strict, Tailwind CSS v4, App Router, ESLint, Turbopack dev.
- shadcn/ui (v4.7) initialized with zinc base color; `lib/utils.ts` `cn()` helper; `components.json` configured.
- Design token system in `app/globals.css`:
  - Primary **teal `#0D9488`** / Accent **amber `#F59E0B`** / Zinc neutrals (all OKLCH).
  - Dark-mode variables, `tw-animate-css` plugin, `prefers-reduced-motion` honored.
- Fonts: Inter + JetBrains Mono via `next/font/google` (Cal Sans deferred to Phase 2).
- App shell:
  - Root layout with `ThemeProvider` (next-themes, class strategy, system default).
  - Sticky `SiteNav` with theme toggle, brand mark, sign-in / get-started CTAs.
  - `SiteFooter` with tool / legal / company link map + Etsy trademark disclaimer.
  - Placeholder landing page with gradient hero, trust-signal strip, and scaffold-status card.
- `docker-compose.yml` for Postgres 16 (named `craftly-postgres`, healthcheck) and Redis 7 (AOF on, healthcheck).
- `.env.example` with every variable from `PLAN.md §Environment variables`, grouped by phase.
- `.env.local` for local dev with generated `AUTH_SECRET` (base64-32) and `ENCRYPTION_KEY` (hex-32).
- `.gitignore` extended to cover `.env*` (except `.env.example`), IDE dirs, OS junk, Prisma generated client.
- Prettier config + `prettier-plugin-tailwindcss` for class sorting.
- `package.json` scripts: `dev`, `build`, `start`, `typecheck`, `lint(:fix)`, `format(:check)`, `check`, `db:up/down/logs/reset`. `engines` pinned to Node 22+. Project renamed to `craftly`.
- `README.md` with stack overview, local-dev quickstart, script reference, project layout, brand spec.

### Added — Planning (pre-Phase 0)

- `AGENTS.md` — operating manual: hard rules, code rules, design language, project structure.
- `PLAN.md` — phase-by-phase build plan, DB schema, AI router contract, env reference, **SEO topical-authority matrix** (Appendix A): per-page keyword clusters (primary + LSI/semantic + AEO questions), universal SXO / AIO / GEO / AEO page anatomy, trust-signal vocabulary, schema markup matrix.
- `CHANGELOG.md` — this file.

### Decisions

- **Next.js 16** chosen over 15: `create-next-app@latest` shipped 16, and rolling back would self-impose ~12 months of technical debt on a greenfield 2026 project. All planned patterns (App Router, RSC, server actions, streaming) are unchanged.
- **Brand:** `Craftly` placeholder; single global rename when the real name is chosen.
- **Auth.js** scoped to magic link + Google (credentials/bcrypt dropped) to reduce attack surface.
- **pnpm** (11.1.3) installed via `npm install -g pnpm` (corepack blocked by `C:\Program Files\nodejs` permissions on this Windows install).
