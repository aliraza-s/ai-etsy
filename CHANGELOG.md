# Changelog

All notable changes to Craftly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — Phase 9 (Post-launch: blog, niche finder, bulk runner)

Three independent features that round out the product surface. None require billing
to be live, so they could ship in any order. The blog is content-led growth; Niche
Finder is a new AI tool; Bulk Runner is workflow leverage for power users.

#### Blog — `/blog` + `/blog/[slug]` + RSS

- **`lib/content/blog.ts`** — typed `BlogPost` registry. Posts are TypeScript modules (one per file under `lib/content/blog-posts/`), giving us full JSX-in-content power without the MDX loader + frontmatter overhead. Swapping to actual `.mdx` later is a single-file change because the registry exports the same shape either way.
- **`components/blog/prose.tsx`** — shared `<Prose>` wrapper plus authoring helpers: `<H2>`, `<H3>`, `<P>`, `<Lead>`, `<UL>`, `<OL>`, `<LI>`, `<Quote>`, `<Code>`, `<Callout tone="info|warn|success">`, `<Stat>`, `<StatGrid>`, `<ToolMention slug="...">`. Authors write semantic JSX; the wrapper handles spacing, anchor offsets, and link styling.
- **3 starter posts** in `lib/content/blog-posts/`:
  - **`etsy-title-anatomy`** — "The anatomy of an Etsy title that actually ranks in 2026". Walks the 5-zone structure of high-ranking titles with before/after examples and the 6 common mistakes.
  - **`thirteen-tag-strategy`** — "How to actually use all 13 Etsy tags". The 4+4+5 framework, 20-char ceiling, seasonal rotation tactic.
  - **`why-etsy-listings-stall`** — "Why your Etsy listing stops getting views (and the 4-step fix)". The stall pattern by day, why Etsy does it, the audit/edit/wait fix loop.
- **`/blog`** index page — hero, featured post card, post grid with tag chips, RSS link.
- **`/blog/[slug]`** post page — meta + open-graph card, breadcrumb, header (date/reading-time/author), tag chips, full Prose body, related posts (3, newest), CTA panel.
- **`/blog/feed.xml`** — RSS 2.0 feed with `atom:link` self reference, channel metadata, per-post `<category>` tags. Cached `s-maxage=3600`. Discovery wired through `<link rel="alternate">` in the blog index `metadata.alternates.types`.
- **`Article` JSON-LD** emitted on each post page with `headline`, `description`, `image` (the per-post OG), `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`, `keywords` — full coverage for Google's Article rich results.
- **OG images** — `/blog/opengraph-image` (index) and `/blog/[slug]/opengraph-image` (per-post, accent toggles by `post.accent`).
- **Sitemap** now includes `/blog` and every post (priority 0.7, `lastModified` from the post date).
- **Footer** Company column has a Blog link.

#### Niche Finder — new AI tool

- **`prisma/schema.prisma`** — added `NICHE_FINDER` to the `Tool` enum. (Local devs: run `pnpm db:migrate` to apply.) Prisma client regenerated via `pnpm db:generate` so TS picks up the new enum value without needing a DB.
- **`lib/ai/schemas.ts`** — extends with:
  - `nicheFinderInput` — `seedCategory` (2-120 chars), optional `targetAudience` (≤200), optional `pricePointHint` (budget/mid/premium).
  - `nicheFinderOutput` — exactly 5 clusters, each with `name`, `positioning`, `demandScore` (0-100), `competitionScore` (0-100), `opportunityScore` (0-100), 3-8 `sampleKeywords`, one `firstProductIdea`; plus a 40-500 char `summary`.
  - Registered in `TOOL_INPUT_SCHEMA` + `TOOL_OUTPUT_SCHEMA` + `TOOL_TIMEOUT_MS` (60s) + `CREDIT_COST` (4) + `MAX_BOOST_TOOLS` (auto-Sonnet on Max).
  - `buildUserPrompt` case for `NICHE_FINDER` that formats the seed/audience/price hints into a clean prompt.
- **`lib/ai/sample-inputs.ts`** — sample input for the admin Test button.
- **`lib/ai/providers/mock.ts`** — deterministic 5-cluster mock response (Minimalist desk decor, Cottagecore stationery, Line-art pet portraits, Modular travel jewelry, Eco party decor) with realistic positioning/scoring/keywords/product ideas.
- **`scripts/seed.ts`** — `SYSTEM_PROMPTS.NICHE_FINDER` added; `maxTokens` raised to 4096 for this tool alongside the two analyzers.
- **`app/api/ai/[tool]/route.ts`** — `niche-finder` added to `ALLOWED_SLUGS`. No other route changes needed.
- **`/app/niche-finder`** UI page + client component — seed input, optional audience textarea, price-point pill picker; result UI shows the summary panel, then 5 cluster cards with opportunity-score badge, positioning paragraph, demand + headroom score bars, sample keyword chips, and a first-product-idea callout. Reuses `<ToolShell>` + `<ScoreBar>`.
- **`lib/content/tools.ts`** — added `niche-finder` to `ToolSlug` + `TOOLS` (4 credits, MAX-boosted, Compass icon).
- **`lib/content/tool-pages.ts`** — full marketing-page content for `/tools/niche-finder`: TLDR, definition with 3 cited stats, 3 personas, 3 steps, before/after example, 6 features, 7-row comparison, 8-item FAQ targeting AEO questions ("how is this different from Keyword Generator", "how do you score without API", "what opportunity score to act on", etc.).
- Sub-nav, sitemap, and footer auto-pick up the new tool via the `TOOLS` registry.

#### Bulk Runner — `/app/bulk`

- **`/app/bulk`** — pick a tool (Tag / Title / Keyword / Description), paste N input rows (one per line for the first three, blank-separated blocks for description bullets), kick off all rows against the existing `/api/ai/<slug>` endpoint. **Reuses every Phase 5 invariant**: per-row credit reservation, per-row UsageLog, per-row Generation history. Failures only burn the row that failed.
- **Bounded concurrency** at 4 parallel requests (config constant) — protects the Serializable credit-deduction transaction from contention and avoids melting providers.
- **Progress UI** — per-row status icons (queued · running · success · error · cancelled), per-row duration, summary line per output, aggregate counts at the top.
- **Insufficient-credits handling** — when one row gets a 402, the remaining queued rows transition to `cancelled` (no credit deducted) instead of all failing in parallel. The user sees a clean stop, not a wave of red.
- **Stop button** — flips a `cancelRef` so already-running rows complete but no new ones are picked up.
- **CSV export** — appears after the run completes. Headers: `#, input, status, output, duration_ms, error`. Per-tool `csvValue()` adapter flattens structured outputs (tag arrays, keyword (phrase, intent) tuples, multi-line descriptions) into single-cell strings. CSV-safe escaping for embedded commas, quotes, newlines.
- App sub-nav gets a "Bulk" tab next to History.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — **57 routes** (up from 49): +6 blog routes (index, dynamic post, RSS, 2 OG image variants), +1 `/app/niche-finder`, +1 `/app/bulk`. Plus the auto-added `/tools/niche-finder` marketing surface from the `TOOLS` registry.
- `pnpm format` clean

### Decisions

- **TypeScript content registry over MDX file-glob.** Same JSX-in-content power, no loader plumbing, no frontmatter syntax, and authoring keeps full TS autocomplete on the helper components. A future swap to actual `.mdx` files is straightforward because the page templates render `post.body` — they don't care where the JSX came from.
- **Niche Finder is on the same enum migration path as the other 6 tools.** The Prisma `Tool` enum addition (`NICHE_FINDER`) is a forward-only enum value add — safe to deploy. No data migration. Existing AIConfig / UsageLog / Generation rows are unaffected.
- **Bulk runner is a thin client over the existing endpoint** — _not_ a new `/api/ai/bulk` route. The reasons: (1) every row gets atomic credit deduction + UsageLog already, (2) per-row failure isolation is automatic, (3) admin analytics work unchanged, (4) we don't have to maintain a parallel codepath for bulk. The tradeoff is N HTTP round-trips instead of one; with concurrency 4 that's fine in practice.
- **Concurrency 4 is conservative.** Could lift to 8 once we have real-world traffic data. Set lower (1–2) if the user is on free-tier Anthropic credits and worried about RPM caps.

### To use in dev

```powershell
# Apply the new enum value (one-time)
pnpm db:migrate

# Re-seed so the new AIConfig row appears
pnpm db:seed

pnpm dev
```

Then:

- http://localhost:3000/blog — index with 3 starter posts and RSS link
- http://localhost:3000/blog/etsy-title-anatomy — full article
- http://localhost:3000/blog/feed.xml — RSS feed
- http://localhost:3000/tools/niche-finder — marketing page with the new tool's content
- http://localhost:3000/app/niche-finder — sign in → paste a seed → 5 clusters in seconds (mock mode shows the deterministic response)
- http://localhost:3000/app/bulk — pick "Tag Generator", paste 5–10 product titles, click Run; watch them stream in, export CSV

### Added — Phase 8 (Launch polish)

Production-ready surface: programmatic OG images on every public page, app
icons + web manifest, env-gated observability (Sentry + Plausible), a
Lottie-or-SVG illustration shim, and dev-ops scripts (Postgres backups, a
Lighthouse audit runner). Nothing breaks if you don't configure any of it —
each layer is opt-in and falls back gracefully.

#### Programmatic OG images

- **`lib/og.tsx`** — shared `ogImage(input)` helper using `next/og` ImageResponse. 1200×630, gradient background, dot-pattern texture, accent rail on the right edge (teal default, amber for free/secondary), 72×72 glyph badge, eyebrow + title + subtitle + brand footer. Renders with system fonts only — no jsdelivr emoji-font fetches at build time. Satori's no-`z-index` constraint handled via source-order layering. ASCII-safe glyphs only.
- **6 per-page OG routes** via `opengraph-image.tsx` in each route group:
  - `/` — "Sell more. Type less." (teal, glyph `C`)
  - `/pricing` — "Honest pricing. Cancel any time." (amber, `$`)
  - `/tools` — "Eight tools, one toolkit." (teal, `+`)
  - `/tools/[slug]` — dynamic per-tool name + tagline (teal for paid, amber for free)
  - `/about` — "Built by sellers, for sellers." (teal, `@`)
  - `/contact` — "We read every message." (amber, `@`)
- **Favicon + Apple touch icon** as runtime-generated `ImageResponse` files (`app/icon.tsx` 32×32 and `app/apple-icon.tsx` 180×180). Brand-teal solid + monogram. No PNG asset to maintain or to fall out of sync with the brand.

#### Web manifest + theme-color + a11y

- **`app/manifest.ts`** — emits a real `/manifest.webmanifest` with name, short name, theme-color (`#0D9488`), display mode (`standalone`), and entries for the runtime-generated icons.
- **Theme-color meta** via the new `export const viewport` block in `app/layout.tsx` — light `#ffffff`, dark `#0a0a0a`. Mobile Chrome/Safari address bars match the page.
- **Skip-to-content link** in the root layout: visually hidden until focused, jumps to `#main-content`. Keyboard-only users no longer have to tab through the entire nav.
- `<main>` got an `id="main-content"` to anchor the skip-link.
- `applicationName` + `appleWebApp` set on root metadata for proper PWA-style add-to-home-screen behavior.

#### Lottie-or-SVG illustration shim

- **`components/illustrations/lottie-or-fallback.tsx`** — client component that fetches `/lottie/<name>.json` on mount; renders Lottie if the file exists, the SVG fallback otherwise. Per-path response cached in a module-level map so each illustration only fetches once per session. Default `loop: true`, `autoplay: true`.
- **`HeroIllustration` + `StepPaste/Generate/Rank`** now wrap themselves in the shim. The inline SVG remains the default — drop a Lottie file at `public/lottie/{hero,step-paste,step-generate,step-rank}.json` to upgrade with no code changes.
- **`public/lottie/README.md`** — drop-in convention reference: file paths, expected fallback components, sourcing notes (LottieFiles, Icons8), brand-color guidance.

#### Observability — env-gated, install-optional

- **`lib/log.ts`** — `logError(err, context)` + `logWarn(message, context)`. Always logs to console. Lazy-imports `@sentry/nextjs` only when both `SENTRY_DSN` is set **and** the package is installed. Indirect dynamic import via `Function()` constructor so the file compiles when the SDK isn't installed (no `Cannot find module` error at `tsc` time).
- **Wired into**: `lib/ai/router.ts` (decrypt failure + per-attempt failure), `app/api/ai/[tool]/route.ts` (unhandled error), `app/api/contact/route.ts` (Resend send failure). Replaces 3 bare `console.error`/`console.warn` calls with structured `logError`/`logWarn`.
- **`components/shared/analytics.tsx`** — `<Analytics>` server component that mounts Plausible's `<script>` only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. Supports both Plausible Cloud (default `script.js`) and self-hosted via `NEXT_PUBLIC_PLAUSIBLE_SRC` override. Mounted in the root layout after the theme provider. Zero impact on local dev (returns `null` when domain unset).

#### Dev-ops scripts

- **`scripts/db-backup.ts`** + `pnpm db:backup` — Postgres snapshot via `docker exec pg_dump -F c`. Writes timestamped `craftly-YYYYMMDD-HHMMSS.sql` files to `./backups/`. Container, DB, and user can be overridden via env (`DB_BACKUP_CONTAINER`, `POSTGRES_DB`, `POSTGRES_USER`). Restore command is printed after each successful backup. Intended for local dev — production should use the managed backup of whoever's running Postgres.
- **`scripts/lighthouse.ts`** + `pnpm lh` — runs `npx -y lighthouse` against 8 representative routes (landing, pricing, tools hub, a paid tool, the free fee calc, about, contact, privacy), prints a colored Perf/A11y/BP/SEO summary table, and writes the full JSON to `./.lighthouse/<iso-timestamp>.json` for diffing across runs. Uses `npx` so we don't carry the heavy `lighthouse` package as a project dep. Configurable via `LH_BASE_URL` and `LH_PRESET` (desktop or perf).

#### `.env.example`

- Documented every new env var with inline comments: `CONTACT_INBOX`, `SENTRY_DSN`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_PLAUSIBLE_SRC`, `DB_BACKUP_CONTAINER`, `POSTGRES_USER`, `POSTGRES_DB`, `LH_BASE_URL`, `LH_PRESET`. Each section explains how the system behaves when the var is unset (sensible defaults, no broken builds).

### Decisions

- **No new heavyweight dependencies.** `lottie-react` was already installed in Phase 2 wave 1, so the shim ships free. Sentry stays out of `package.json` until someone explicitly installs it — `pnpm add @sentry/nextjs` and the dynamic import in `lib/log.ts` picks it up automatically. Lighthouse runs via `npx` for the same reason.
- **OG images are programmatic.** Static PNGs in `/public/og-*.png` would also work, but they would drift from the brand the first time we changed a color or copy. ImageResponse re-renders from the SITE constants every build.
- **No emoji in OG glyphs.** Satori (the renderer behind `next/og`) tries to fetch an emoji font from jsdelivr the first time it sees one. Offline/sandboxed builds fail. ASCII characters (`C`, `$`, `+`, `/`, `@`) are sufficient and never trigger a network fetch.
- **Skip-link before anything else.** Putting it as the first interactive element in `<body>` (before JsonLd, before ThemeProvider) means screen-reader users hear it immediately on page load.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — **49 routes**, including 6 OG images, icon, apple-icon, and manifest.webmanifest. (Up from 41 in Phase 2 wave 3.)
- `pnpm format` clean
- New scripts (`pnpm db:backup`, `pnpm lh`) registered in `package.json` and run via `tsx` (no extra runtime deps needed)

### To use in dev

```powershell
# Per-page OG previews
http://localhost:3000/opengraph-image
http://localhost:3000/pricing/opengraph-image
http://localhost:3000/tools/tag-generator/opengraph-image
http://localhost:3000/about/opengraph-image
http://localhost:3000/contact/opengraph-image

# Favicon + Apple icon
http://localhost:3000/icon
http://localhost:3000/apple-icon

# Web manifest
http://localhost:3000/manifest.webmanifest

# Lottie swap-in: drop a JSON file at public/lottie/hero.json and reload — no rebuild needed

# Backup the dev database
pnpm db:backup
# → backups/craftly-20260519-143012.sql

# Run a Lighthouse audit against the running dev server
pnpm dev   # (in one terminal)
pnpm lh    # (in another)

# Enable Plausible
# .env.local:
#   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=craftly.app

# Enable Sentry
pnpm add @sentry/nextjs
# .env.local:
#   SENTRY_DSN=https://...@sentry.io/...
```

### Added — Phase 2 wave 3 (Legal, About, Contact)

The remaining five marketing pages. With these, every footer link resolves and the SEO surface is complete: every public route has a canonical URL, an OpenGraph card, breadcrumb JSON-LD, and (where applicable) FAQ JSON-LD.

#### Shared

- **`components/marketing/legal-page.tsx`** — shared layout for policy pages: centered hero with eyebrow + title + last-updated date, a sticky table-of-contents (lg+ viewports) bound to section anchors, semantic `<section>` per item with `scroll-mt-24` for clean anchor navigation, and a "questions?" footer link to `/contact`. Reused by all three legal pages, so they stay visually consistent and edit-once.

#### `/terms` — Terms of Service

- 15 sections covering: acceptance, what the Service does, accounts, plans/credits/billing (no roll-over, prices subject to 30-day notice), acceptable use (no scraping/no re-selling/no model-training/no IP infringement), AI output disclaimers, IP rights (user owns inputs and outputs subject to provider limits), third-party services + the Etsy trademark disclaimer, warranty disclaimer, liability cap (greater of 12 months paid or USD $100), indemnity, termination, governing law, change policy, contact.
- Cross-links to Privacy and Refund Policy where relevant.

#### `/privacy` — Privacy Policy

- 11 sections opening with a 4-bullet TL;DR ("we collect the minimum… don't sell… don't train… delete anytime"), then full detail: data we collect (account / billing / tool inputs / usage / cookies), how we use it, AI providers + outbound data flow (single API call, provider retention policy), who we share with (categorized: AI inference / auth / payments / infra / error monitoring), retention windows (account: 30d post-delete, history: while-active, usage logs: 24mo, billing: 6–10y tax law), security (TLS, AES-256-GCM, breach-notice 72h), user rights (GDPR-style: access / correct / delete / export / object / withdraw / lodge complaint), international transfers, children policy, change policy, contact emails.
- Lists exact service providers by name (Anthropic, OpenRouter, Together AI, Resend, Google, Paddle, Vercel, Sentry) so users know the data flow explicitly.

#### `/refund-policy` — Refund Policy

- 8 sections including: short summary, **14-day money-back guarantee** on first Pro/Max charge (once per customer), cancellation mechanics (access through paid period, drops to Free, history preserved), when refunds don't apply (after day 14, unused credits, annual outside window, disappointment with AI quality, provider failures already credit-refunded, chargebacks-without-contact), the in-app **automatic credit refund** path for provider failures (separate from cash refunds), how-to-request flow (email, two-business-day response, 10-business-day payment provider timing), and an EU/UK statutory withdrawal-right section noting our guarantee meets/exceeds the minimum.

#### `/about` — About page

- SXO-anatomy: hero ("we make the boring parts of selling fast"), story block (two-column with sticky heading: blank-title problem → existing tools fall short → ${SITE.name} as response), 4 values cards (privacy by design / transparent pricing / no training on your data / built to be repaired), 3-step timeline (Q4 2025 prototype → Q1 2026 launch → current roadmap), "how we operate" sidebar with 4 bullets (one product focused, public changelog, reachable founders, honest defaults), 6-item FAQ targeting AEO questions ("who built it", "are you affiliated with Etsy", "why not just use ChatGPT", "which AI models", "what happens to my text", "affiliate program"), CTA panel with 4 trust signals.
- Emits `BreadcrumbList` + `FAQPage` JSON-LD.

#### `/contact` — Contact page

- Two-column layout: contact form on the left (name, email, topic dropdown, message with live char count, honeypot field for spam), info column on the right (three direct email addresses — `hello@`, `billing@`, `privacy@` — each with a one-line use case, plus a response-time card stating "under 24 hours, Mon-Fri, refunds in 2 business days, security ack same-day").
- 5-item FAQ ("how fast do you reply", "should I include screenshots", "custom plans for larger sellers", "feature requests", "security issues").
- Honeypot anti-spam: hidden "website" field that real users never fill but bots do — submissions where it's non-empty return success without sending, so bots can't tell they've been filtered.
- Inline success state: after a successful submit, the form is replaced by a green confirmation card so the user immediately knows it went through.
- Emits `BreadcrumbList` + `FAQPage` JSON-LD.

#### `app/api/contact/route.ts`

- POST endpoint: zod-validated (name 1-120, email ≤200, topic ∈ 6 values, message 10-3000, honeypot must be empty).
- Sends via Resend to `CONTACT_INBOX` (env, default `hello@craftly.app`), with `replyTo: form.email` so an admin reply lands in the sender's inbox directly.
- **Dev fallback**: when `RESEND_API_KEY` is unset, the submission is logged to the terminal in cyan instead — same pattern as the Auth.js magic-link flow, so you can develop the form without provisioning email.
- Honeypot hits silently return `{ ok: true }` (don't leak the filter to bots).

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — **41 routes** (up from 35): +5 pages (`/terms`, `/privacy`, `/refund-policy`, `/about`, `/contact`) + 1 API route (`/api/contact`). Footer links + sitemap entries already existed from Phase 2 wave 1; this wave fills them in.
- `pnpm format` clean

### To use in dev

```powershell
pnpm dev
```

- http://localhost:3000/about — the team page with story, values, timeline, FAQ, CTA
- http://localhost:3000/contact — fill the form, hit send. With no `RESEND_API_KEY` set, the message is logged to the dev terminal. Set `RESEND_API_KEY` and (optionally) `CONTACT_INBOX` to forward to email.
- http://localhost:3000/terms · /privacy · /refund-policy — TOC-driven legal docs, deep-linkable anchors (`/privacy#retention`, etc.)

### Decisions

- **Legal copy is generic-but-honest, not template-generated.** Each policy is written to actually describe what this product does, not to wave a hand at compliance. Sections like "AI providers and outbound data" don't appear in stock SaaS templates.
- **Last-updated stamps are explicit dates**, not relative ("3 months ago"). Search engines and skeptical users both prefer this.
- **Email-as-API for contact** rather than a database table. We don't need to log contact-form submissions — Resend's inbox is the canonical store. If we ever want a Linear or Notion integration, swap the `resend.emails.send` call for a webhook.
- **No real privacy-policy template references** were copied. Anything that looks legalistic is original to this project. Have a lawyer review before shipping commercially in the EU/UK.

### Added — Phase 7 (Admin)

The operational layer. Six admin pages + six admin API routes that let you run the
product without ever touching code or the DB shell. Every page is role-gated by the
proxy + an extra check in the layout; every API route uses `requireAdmin()`.

#### Shared admin infrastructure

- **`app/(admin)/admin/layout.tsx`** — admin shell with a horizontally-scrollable sub-nav (Overview · Users · Usage · AI config · API keys · Announcements), "← Back to app" link, sign-out form. Double-gates (`session.user.role === "ADMIN"` redirects to `/app`) so the layout fails closed even if the proxy is bypassed in dev.
- **`components/admin/admin-primitives.tsx`** — `<PageHeader>`, `<Card>`, `<StatCard>`, `<Badge>` (5 tones), `<DataTable>`, `formatUsd()`, `formatRelative()`. Reused across every admin page so the UI stays consistent.
- **`lib/admin.ts`** — `requireAdmin()` helper for API routes that returns `{ ok, session }` or `{ ok, response }` for early-return. Replaces ad-hoc `session.user.role !== "ADMIN"` checks.
- **`lib/admin/time.ts`** — `sinceMsAgo()` / `ONE_DAY_MS` helpers. Extracted so the React 19 `react-hooks/purity` lint rule doesn't trip on `Date.now()` inside async server components.

#### `/admin` — Operational dashboard

- 4 KPI cards: users (total + active paid subs), 30d calls + 24h calls, 30d AI cost (with token volume), 24h failure rate (auto-toned green/warn/red).
- Per-tool usage table (last 30d) with inspect links into filtered usage page.
- Recent-failures panel surfaces the last 5 `UsageLog` rows where `status = FAILED`, with tool, error code, user email, and timestamp.
- Bottom row: credits-spent gauge, active-announcements count, average cost per successful call.

#### `/admin/ai-config` — Live model + prompt editor with Test button

- **List page** (`/admin/ai-config`) — six tool cards showing current provider · model, fallback, temp, max-tokens, last-updated. Max-boost tools labeled "Max → Sonnet 4.6".
- **Editor** (`/admin/ai-config/[slug]`) — per-tool form: primary provider/model, fallback provider/model, temperature (0–2), maxOutputTokens (64–16384), system prompt (multiline mono textarea with live char count). Dirty-state detection; reset button when dirty.
- **Test button** — runs the _unsaved_ config against a canned sample input for that tool, no credits charged, no `UsageLog` row written. Shows duration + raw JSON output (schema-validated by the same `TOOL_OUTPUT_SCHEMA` the production router uses). Errors render as a red card with the provider's actual message.
- **PATCH `/api/admin/ai-config/[slug]`** — zod-validated input, stamps `updatedBy = session.email`, invalidates the in-memory router config cache via the new `invalidateConfigCache()` export from `lib/ai/router.ts` so changes go live immediately (not in 60s).
- **POST `/api/admin/ai-config/test`** — runs `generateObject({ model, schema: TOOL_OUTPUT_SCHEMA[tool], system, prompt: buildUserPrompt(tool, SAMPLE_INPUTS[tool]), temperature, maxOutputTokens })` with `AbortSignal.timeout(TOOL_TIMEOUT_MS[tool])`. Catches all errors and returns them as `{ ok: false, error }` so failures render inline.
- **`lib/ai/sample-inputs.ts`** — canned input per tool that satisfies the corresponding `TOOL_INPUT_SCHEMA`. Used only by the Test button.

#### `/admin/api-keys` — Encrypted key rotation

- One section per provider (Anthropic, OpenRouter, Together). Shows status (Active / Disabled / Not set), last-4 only, last-updated, who-by. Links to each provider's key console.
- Password-style input (with show/hide eye toggle) for new key entry. Leaving the field empty + saving means flags-only update.
- Per-provider monthly budget cap field (Decimal in DB, optional). Active toggle. Remove button (with `confirm()`) deletes the row — router falls back to env var.
- **PUT `/api/admin/api-keys/[provider]`** — encrypts the plaintext via `encrypt()` before storage (AES-256-GCM, see `lib/encryption.ts`). Only ever stores `encryptedKey` + `lastFour`. Plaintext is never logged, never echoed, never persisted.
- **DELETE `/api/admin/api-keys/[provider]`** — idempotent (no error if already missing).
- Banner warning shown when `MOCK_AI=true` is set in env, so admins aren't confused that stored keys "don't seem to be doing anything."

#### `/admin/users` — User management

- **List** (`/admin/users`) — paginated 25 per page, search by email or name, ordered by createdAt desc. Each row: email/name, role, plan, credit balance, call/generation counts (last 30d), join age, edit link.
- **Detail** (`/admin/users/[id]`) — 4 KPI cards (credits, 30d calls, 30d cost, plan status), inline editor for role / plan / credits, tool-mix breakdown (30d), last 15 calls.
- **PATCH `/api/admin/users/[id]`** — atomic 3-write transaction: update role, upsert subscription, upsert credit balance. **Last-admin guard:** prevents demoting the only remaining admin.
- **DELETE `/api/admin/users/[id]`** — soft-delete (sets `deletedAt`), keeps usage history intact. Refuses to delete the calling admin (self-delete guard) or the last remaining admin.

#### `/admin/usage` — Cost + traffic analytics

- Filters: range (24h / 7d / 30d / 90d), tool, status — all wired through search params so URLs are shareable / linkable from the overview.
- 4 KPI cards: total calls (with success count), AI cost (with input/output token totals), avg latency (with credits spent), failure rate (auto-toned).
- 4 grouping tables: by tool, by model (top 8), by user (top 10, linked to detail page), recent 30 calls feed with status badge + duration + relative time.
- All queries are `groupBy` with proper `orderBy` (Prisma's nested `_count` ordering syntax).

#### `/admin/announcements` — Site-wide banners

- Single-page CRUD: create form doubles as edit form (state-toggled). Fields: title, body, audience (`ALL` / `FREE` / `PRO` / `MAX` / `ADMIN`), isActive, expiresAt (datetime-local, optional).
- List below the form shows every announcement with status badges (Active / Inactive / Expired), audience tag, body preview, edit + delete buttons.
- **POST `/api/admin/announcements`** + **PATCH `/api/admin/announcements/[id]`** + **DELETE `/api/admin/announcements/[id]`** — all zod-validated, all admin-gated.
- **`components/app/announcement-banner.tsx`** — server component used by `/app` layout. Queries the latest active announcement whose audience matches the viewer's role/plan, with `expiresAt > now()` filter. Renders a colored banner above the dashboard nav. Returns `null` when nothing applies (zero layout shift).

### Changed

- **`lib/ai/router.ts`** — `invalidateConfigCache(tool?)` exported so the AI-config PATCH route can flush the in-memory 60s cache the moment a save commits. Previously you had to wait up to 60 seconds for changes to take effect.
- **`app/(app)/app/layout.tsx`** — now fetches the user's plan and renders `<AnnouncementBanner>` below the sub-nav.

### Decisions

- **No per-key cost tracker yet.** The `ApiKey.monthlyBudgetUsd` field is captured but the spend-vs-cap check isn't wired into the router. That's a Phase 8 polish item once we see real traffic patterns; for now it documents intent.
- **Admin auth is double-gated** (proxy + layout) for defense-in-depth. The proxy redirects un-authed routes, but the layout's explicit `session.user.role !== "ADMIN"` check survives any future proxy bug.
- **Test button bypasses credit + UsageLog** intentionally. Admins iterate on prompts dozens of times; we don't want that to skew analytics or burn the shared admin credit balance.
- **AI-config changes flush the cache immediately** rather than waiting 60s — admins expect "save" to mean "now."
- **User soft-delete vs hard-delete:** soft (`deletedAt`) keeps usage history queryable for analytics. A hard-delete tool is reserved for a future GDPR-erasure flow.

### Verification

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` green — **35 routes** (up from 20): 7 new admin pages + 6 new admin API routes + the existing 22.
- `pnpm format` clean (one CHANGELOG.md warning expected — auto-formatted on next pre-commit)

### To use in dev

```powershell
pnpm dev
```

Sign in as `aliraza4043627@gmail.com` (the seeded admin). Then:

- http://localhost:3000/admin — operational overview
- http://localhost:3000/admin/ai-config — pick any tool → edit the system prompt → click "Test with sample input" — schema-validated JSON output comes back in seconds (or, in `MOCK_AI=true` mode, the deterministic mock output)
- http://localhost:3000/admin/api-keys — rotate a key without losing the previous (encrypt → upsert → only last-4 ever visible)
- http://localhost:3000/admin/users — paginated list with search; click a row → set role, plan, credit balance
- http://localhost:3000/admin/usage?range=7d — filter by tool / status / range
- http://localhost:3000/admin/announcements — publish a banner targeted at `ALL` — it appears immediately above the `/app` sub-nav for every signed-in user matching the audience

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
