# Changelog

All notable changes to Craftly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
