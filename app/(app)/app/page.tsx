import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  History,
  Sparkles,
  Tag,
  Heading1,
  Stethoscope,
  Layers,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TOOL_ENUM_TO_SLUG } from "@/lib/ai/schemas";
import { ActivityIllustration } from "@/components/illustrations/page-illustrations";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const TOOL_LABEL: Record<string, string> = {
  TAG_GENERATOR: "Tag Generator",
  TITLE_GENERATOR: "Title Generator",
  KEYWORD_GENERATOR: "Keyword Generator",
  DESCRIPTION_GENERATOR: "Description Generator",
  LISTING_ANALYZER: "Listing Analyzer",
  SHOP_ANALYZER: "Shop Analyzer",
  NICHE_FINDER: "Niche Finder",
};

const QUICK_LAUNCH = [
  {
    slug: "tag-generator",
    icon: Tag,
    label: "Tag Generator",
    blurb: "13 multi-word tags from a title",
    accent: "teal" as const,
  },
  {
    slug: "title-generator",
    icon: Heading1,
    label: "Title Generator",
    blurb: "5 SEO titles from a description",
    accent: "teal" as const,
  },
  {
    slug: "listing-analyzer",
    icon: Stethoscope,
    label: "Listing Analyzer",
    blurb: "Score one listing across 5 axes",
    accent: "amber" as const,
  },
  {
    slug: "bulk",
    icon: Layers,
    label: "Bulk Runner",
    blurb: "Run any generator across N rows",
    accent: "amber" as const,
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [credits, subscription, generationCount, lastGen] = await Promise.all([
    db.creditBalance.findUnique({
      where: { userId },
      select: { credits: true, resetsAt: true },
    }),
    db.subscription.findUnique({
      where: { userId },
      select: { plan: true, status: true, renewsAt: true },
    }),
    db.generation.count({ where: { userId, deletedAt: null } }),
    db.generation.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { tool: true, createdAt: true },
    }),
  ]);

  const plan = subscription?.plan ?? "FREE";
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Welcome row — text + small activity illustration */}
      <section className="border-border bg-card relative isolate mb-8 grid items-center gap-6 overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div aria-hidden className="mesh-bg pointer-events-none absolute inset-0 -z-10" />
        <div>
          <span className="border-border/70 bg-background/70 text-muted-foreground mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
            <span className="live-dot" aria-hidden />
            Dashboard
          </span>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="text-gradient">Welcome back</span>
            {firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            Pick a tool below and paste a listing. Everything you generate lives in History.
          </p>
        </div>
        <div className="mx-auto hidden w-full max-w-xs lg:block lg:max-w-sm lg:justify-self-end">
          <ActivityIllustration />
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<CreditCard className="size-4" aria-hidden />}
          label="Credits"
          value={credits?.credits ?? 0}
          hint={credits ? `resets ${credits.resetsAt.toLocaleDateString()}` : "not provisioned"}
          accent="teal"
        />
        <StatCard
          icon={<Sparkles className="size-4" aria-hidden />}
          label="Plan"
          value={plan}
          hint={
            subscription?.renewsAt
              ? `renews ${subscription.renewsAt.toLocaleDateString()}`
              : "free tier"
          }
          accent={plan === "MAX" ? "amber" : plan === "PRO" ? "teal" : "neutral"}
        />
        <StatCard
          icon={<History className="size-4" aria-hidden />}
          label="Generations"
          value={generationCount}
          hint={
            lastGen
              ? `last: ${TOOL_LABEL[lastGen.tool] ?? lastGen.tool} · ${lastGen.createdAt.toLocaleDateString()}`
              : "none yet"
          }
          accent="neutral"
        />
      </section>

      {/* Quick launch */}
      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase">
            Quick launch
          </h2>
          <Link
            href="/app/history"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
          >
            History <ArrowRight className="size-3" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {QUICK_LAUNCH.map((q) => (
            <li key={q.slug}>
              <Link
                href={`/app/${q.slug}`}
                className={cn(
                  "card-hover group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-5",
                  q.accent === "teal" ? "border-border bg-card" : "border-border bg-card",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-12 flex-none items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105",
                    q.accent === "teal"
                      ? "bg-primary/10 text-primary ring-primary/20"
                      : "bg-accent/10 text-accent-foreground ring-accent/30",
                  )}
                >
                  <q.icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground font-semibold">{q.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{q.blurb}</p>
                </div>
                <ArrowRight
                  className="text-muted-foreground group-hover:text-foreground size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {lastGen && (
        <p className="text-muted-foreground mt-8 text-xs">
          Last run:{" "}
          <Link
            href={`/app/${TOOL_ENUM_TO_SLUG[lastGen.tool] ?? "history"}`}
            className="hover:text-foreground transition-colors"
          >
            {TOOL_LABEL[lastGen.tool] ?? lastGen.tool}
          </Link>{" "}
          ·{" "}
          <Link href="/app/history" className="hover:text-foreground transition-colors">
            see all →
          </Link>
        </p>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "teal" | "amber" | "neutral";
}) {
  const iconCls =
    accent === "teal"
      ? "bg-primary/10 text-primary"
      : accent === "amber"
        ? "bg-accent/10 text-accent-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <div className="border-border bg-card text-card-foreground card-hover rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex size-10 items-center justify-center rounded-xl", iconCls)}>
          {icon}
        </span>
        <span className="text-muted-foreground font-mono text-[10px] font-medium tracking-wider uppercase">
          {label}
        </span>
      </div>
      <p className="text-foreground mt-3 text-2xl font-semibold tabular-nums sm:text-3xl">
        {value}
      </p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}
