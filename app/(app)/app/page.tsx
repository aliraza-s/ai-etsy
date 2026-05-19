import Link from "next/link";
import { ArrowRight, CreditCard, Sparkles, History } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TOOL_ENUM_TO_SLUG } from "@/lib/ai/schemas";

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

const QUICK_LAUNCH: { slug: string; label: string; blurb: string }[] = [
  { slug: "tag-generator", label: "Tag Generator", blurb: "13 multi-word tags from a title" },
  { slug: "title-generator", label: "Title Generator", blurb: "5 SEO titles from a description" },
  { slug: "listing-analyzer", label: "Listing Analyzer", blurb: "Score one listing across 5 axes" },
  { slug: "bulk", label: "Bulk Runner", blurb: "Run any generator across N rows" },
];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  // Fetch only the fields we actually render — keeps the response small and
  // lets Prisma skip joins on Generation we don't need on the dashboard.
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Pick a tool and paste your listing. Everything you generate lives in History.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<CreditCard className="size-4" aria-hidden />}
          label="Credits"
          value={credits?.credits ?? 0}
          hint={credits ? `resets ${credits.resetsAt.toLocaleDateString()}` : "not provisioned"}
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
        />
      </div>

      <h2 className="text-muted-foreground mt-10 mb-3 font-mono text-xs font-medium tracking-wider uppercase">
        Quick launch
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {QUICK_LAUNCH.map((q) => (
          <li key={q.slug}>
            <Link
              href={`/app/${q.slug}`}
              className="border-border bg-card hover:border-primary/40 group flex items-center justify-between rounded-xl border p-5 transition-colors"
            >
              <div>
                <p className="text-foreground font-semibold">{q.label}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">{q.blurb}</p>
              </div>
              <ArrowRight
                className="text-muted-foreground group-hover:text-primary size-4 transition-colors"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>

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
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="border-border bg-card text-card-foreground rounded-xl border p-5">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
        {icon} {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}
