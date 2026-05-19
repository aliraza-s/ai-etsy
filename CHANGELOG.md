# Changelog

All notable changes to Craftly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
