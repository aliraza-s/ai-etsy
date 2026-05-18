# AGENTS.md — Operating Manual for AI Coding Agents

> This file is the source of truth for any AI agent (Claude Code, Cursor, etc.) working in this repo. Read it before doing anything.

---

## 1. What this project is

`{{BRAND_NAME}}` is an AI-powered SaaS for Etsy sellers. **No Etsy API. No scraping.** Every piece of listing/shop data is pasted by the user. The product wraps that input around LLM-powered tools (tag/title/keyword/description generators, listing & shop analyzers) and ships free SEO-magnet tools (fee calculator, events calendar).

It is **not** an Etsy-affiliated product, will never use the word "Etsy" in branding, and will never scrape etsy.com.

---

## 2. The 8 Hard Rules (NEVER violate)

1. **No "Etsy" in brand identity.** Never in brand name, domain, package name, logo, or marketing copy as the product's identity. Etsy enforces trademark — EtsyRank was forced to rename to eRank. Use `{{BRAND_NAME}}` placeholder; the user will replace globally.
2. **Never scrape etsy.com.** All listing/shop data is user-pasted.
3. **Never commit secrets.** Use `.env.local` + `.env.example`; `.env*` is gitignored.
4. **Never expose API keys client-side.** All AI calls go through `/api/*` routes.
5. **Never skip atomic credit deduction.** Credit check + AI call + deduction is one Postgres transaction. Refund on failure.
6. **Never ship without dark mode** working on every page.
7. **Never add a dependency without justifying it** in the PR/commit message.
8. **Never fabricate Etsy "best sellers" data.** That tool is skipped, not faked.

---

## 3. How we work

1. **Plan before coding.** Before starting any phase, propose a 3–5 step plan and **wait for the user's approval**.
2. **One feature per branch.** Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`.
3. **Update CHANGELOG.md** (Keep a Changelog format) after every meaningful change.
4. **If PLAN.md diverges from reality, update it** — never silently drift.
5. **When in doubt, ASK.** Never invent product decisions, pricing, or features.
6. **No code until the user approves the phase plan.**

---

## 4. Code rules

- TypeScript strict; no `any` without an inline comment justifying it.
- Functions < 50 lines; extract helpers.
- Named exports (Next.js `page.tsx` / `layout.tsx` default exports excepted).
- All forms use `react-hook-form` + `zod`. No `<form action>`.
- All AI calls go through `lib/ai/router.ts`. No direct provider SDKs in route handlers.
- Streaming for analyzer tools (Listing Analyzer, Shop Analyzer).
- `Sentry.captureException` in every catch block; never leak stack traces to users.
- Index DB hot paths. Use transactions for multi-table writes.
- Soft delete for `User` and `Generation` (`deletedAt`). Hard delete elsewhere.
- No comments that just describe what code does. Comments explain _why_ / non-obvious constraints only.

---

## 5. Performance budget

- Lighthouse ≥ 90 on all marketing pages.
- First Load JS < 200 kB.
- LCP < 2 s on 4G.
- Dark mode + light mode tested on every page.
- WCAG AA contrast, keyboard-navigable, mobile-first.

---

## 6. Tech stack (no substitutions without asking)

- **Framework:** Next.js 15 (App Router, RSC), TypeScript strict
- **Styling:** Tailwind CSS v4 + shadcn/ui + lucide-react
- **Motion:** Framer Motion (respect `prefers-reduced-motion`)
- **Theme:** next-themes
- **Forms:** react-hook-form + zod
- **DB:** Prisma + PostgreSQL 16
- **Cache/RL:** Redis 7
- **Auth:** Auth.js v5 (magic link via Resend + Google OAuth + credentials/bcrypt)
- **AI:** Vercel AI SDK as unified interface; OpenRouter (primary), Anthropic, Together AI
- **Payments:** Paddle (Merchant of Record)
- **Email:** Resend
- **Monitoring:** Sentry + self-hosted Plausible
- **Visuals:** Lottie, unDraw SVGs, Unsplash (with attribution)
- **Hosting:** Hostinger VPS (Ubuntu 22.04, Docker Compose, Nginx, Certbot, UFW, fail2ban)

---

## 7. Project structure

```
/app/(marketing)/...         public SSR pages
/app/(auth)/...              signin, signup, verify
/app/(app)/app/...           authed dashboard + tools
/app/(admin)/admin/...       role-gated admin
/app/api/auth/[...nextauth]/
/app/api/ai/[tool]/route.ts  AI tool endpoints (streaming)
/app/api/paddle/webhook/route.ts
/app/api/admin/...

/components/ui/              shadcn primitives
/components/marketing/
/components/tools/
/components/admin/
/components/shared/

/lib/ai/router.ts
/lib/ai/providers/
/lib/ai/prompts/
/lib/db.ts /lib/redis.ts /lib/credits.ts /lib/paddle.ts
/lib/resend.ts /lib/encryption.ts /lib/auth.ts /lib/logger.ts

/prisma/schema.prisma + /prisma/migrations
/public/illustrations /public/lottie
/scripts/seed.ts /scripts/cron/...
/content/blog               (MDX, later)
```

---

## 8. Pricing & credits (canonical)

| Plan | Price                  | Credits/mo | Analyzer model    |
| ---- | ---------------------- | ---------: | ----------------- |
| Free | $0                     |         15 | Claude Haiku 4.5  |
| Pro  | $5.99 / mo · $49 / yr  |        200 | Claude Haiku 4.5  |
| Max  | $11.99 / mo · $99 / yr |        600 | Claude Sonnet 4.6 |

Tool costs (in credits):

| Tool                  | Credits | Default model                        |
| --------------------- | ------: | ------------------------------------ |
| Tag Generator         |       1 | Qwen 7B                              |
| Title Generator       |       1 | Qwen 7B                              |
| Keyword Generator     |       2 | Qwen 32B                             |
| Description Generator |       3 | Qwen 32B                             |
| Listing Analyzer      |       5 | Claude Haiku 4.5 (Sonnet 4.6 on Max) |
| Shop Analyzer         |       8 | Claude Haiku 4.5 (Sonnet 4.6 on Max) |

Free tools (no auth, no credits): Fee Calculator, Events Calendar.

---

## 9. Design language

- **Inspiration:** stripe.com — clean, gradient hero accent, generous whitespace, monochrome + 1 accent (default teal `#14b8a6`, user may swap).
- **Fonts:** Inter (sans), Cal Sans (display), JetBrains Mono (mono).
- **Animations:** 300 ms fade + 8 px slide on page enter; 80 ms stagger on scroll reveals; hover `scale(1.02)` over 150 ms.
- **Loading:** skeleton shimmer, never spinners.
- **Illustrations:** Lottie for hero + "how it works"; unDraw SVG (recolored) for feature sections; Unsplash for blog/testimonials (with attribution).

---

## 10. Useful pointers

- Phase-by-phase build plan: [PLAN.md](PLAN.md)
- Historical changes: [CHANGELOG.md](CHANGELOG.md)
- Env var reference: `.env.example` (created in Phase 0)
