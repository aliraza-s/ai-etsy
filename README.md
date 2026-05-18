# Craftly

> Placeholder brand name. Search-and-replace `Craftly` once the real name is chosen.

AI-powered SaaS for Etsy sellers. Paste-based (no Etsy API, no scraping). Six credit-gated AI tools (tag / title / keyword / description generators + listing & shop analyzers) and two free SEO-magnet tools (fee calculator + events calendar).

---

## Stack

| Layer     | Choice                                                              |
| --------- | ------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, RSC, Turbopack)                             |
| Language  | TypeScript strict                                                   |
| Styling   | Tailwind CSS v4 + shadcn/ui (zinc base, teal primary, amber accent) |
| Motion    | Framer Motion + Lottie                                              |
| Theme     | next-themes (system / light / dark)                                 |
| DB        | Prisma + PostgreSQL 16 _(Phase 1)_                                  |
| Cache     | Redis 7 _(Phase 1+)_                                                |
| Auth      | Auth.js v5 — magic link + Google _(Phase 1)_                        |
| AI        | Vercel AI SDK — OpenRouter / Anthropic / Together _(Phase 5)_       |
| Payments  | Paddle _(Phase 4)_                                                  |

See **[AGENTS.md](AGENTS.md)** for the full operating manual and **[PLAN.md](PLAN.md)** for the phase-by-phase build plan + SEO matrix.

---

## Local development

### Prerequisites

- **Node.js 22+** (currently using 24.9)
- **pnpm 10+** (`npm install -g pnpm` if missing)
- **Docker Desktop** _(required from Phase 1 onward, for Postgres + Redis)_

### First-time setup

```powershell
# 1. Install dependencies
pnpm install

# 2. Copy env template
Copy-Item .env.example .env.local

# 3. (Phase 1+) Start Postgres + Redis
pnpm db:up

# 4. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — Phase 0 ships a placeholder landing page that confirms fonts, theme tokens, dark/light mode, and the nav/footer shell are wired correctly.

---

## Scripts

| Command                             | Purpose                                   |
| ----------------------------------- | ----------------------------------------- |
| `pnpm dev`                          | Dev server with Turbopack                 |
| `pnpm build`                        | Production build                          |
| `pnpm start`                        | Run the production build                  |
| `pnpm typecheck`                    | TypeScript check (no emit)                |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                    |
| `pnpm format` / `pnpm format:check` | Prettier                                  |
| `pnpm check`                        | Typecheck + lint + format-check (CI gate) |
| `pnpm db:up` / `pnpm db:down`       | Start / stop Postgres + Redis             |
| `pnpm db:logs`                      | Tail Docker logs                          |
| `pnpm db:reset`                     | Wipe DB volumes and restart fresh         |

---

## Project layout

```
/app                  Next.js App Router (marketing, auth, app, admin route groups added per phase)
/components/shared    nav, footer, theme toggle, theme provider
/components/ui        shadcn primitives (added as needed)
/lib                  utils, db, redis, ai, auth, etc.
/public               static assets, illustrations, lottie files
/prisma               schema + migrations (Phase 1)
/docker-compose.yml   Postgres 16 + Redis 7 (local dev)
```

---

## Brand

- **Primary:** Teal `#0D9488` (oklch 0.585 0.12 191)
- **Accent:** Amber `#F59E0B` (oklch 0.77 0.16 70)
- **Neutrals:** Zinc scale
- **Fonts:** Inter (sans + display) and JetBrains Mono _(Cal Sans swaps in for display during Phase 2)_

---

## Legal note

Not affiliated with, endorsed by, or sponsored by Etsy, Inc. "Etsy" is a trademark of Etsy, Inc. This project never uses the Etsy API and never scrapes etsy.com — all listing/shop data is user-pasted.
