import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CircleDollarSign,
  Megaphone,
  Sparkles,
  Users,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  Badge,
  Card,
  DataTable,
  PageHeader,
  StatCard,
  formatRelative,
  formatUsd,
} from "@/components/admin/admin-primitives";
import { ONE_DAY_MS, sinceMsAgo } from "@/lib/admin/time";

export const metadata = { title: "Overview" };
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

export default async function AdminOverviewPage() {
  const since = sinceMsAgo(30 * ONE_DAY_MS);
  const yesterday = sinceMsAgo(ONE_DAY_MS);

  const [
    totalUsers,
    activeSubs,
    last30Calls,
    last24Calls,
    failed24,
    successAgg,
    perTool,
    recentFails,
    activeAnnouncements,
  ] = await Promise.all([
    db.user.count({ where: { deletedAt: null } }),
    db.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    db.usageLog.count({ where: { createdAt: { gte: since } } }),
    db.usageLog.count({ where: { createdAt: { gte: yesterday } } }),
    db.usageLog.count({ where: { createdAt: { gte: yesterday }, status: "FAILED" } }),
    // Single aggregate covers cost, token I/O, and credits — was 2 round-trips before.
    db.usageLog.aggregate({
      where: { createdAt: { gte: since }, status: "SUCCESS" },
      _sum: { costUsd: true, inputTokens: true, outputTokens: true, creditsUsed: true },
    }),
    db.usageLog.groupBy({
      by: ["tool"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      _sum: { costUsd: true },
      orderBy: { _count: { tool: "desc" } },
    }),
    db.usageLog.findMany({
      where: { status: "FAILED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        tool: true,
        errorCode: true,
        modelUsed: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
    db.announcement.count({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    }),
  ]);

  const totalCost = decimalToNumber(successAgg._sum.costUsd);
  const tokensIn = successAgg._sum.inputTokens ?? 0;
  const tokensOut = successAgg._sum.outputTokens ?? 0;
  const creditsBurnedTotal = successAgg._sum.creditsUsed ?? 0;
  const failureRate = last24Calls > 0 ? Math.round((failed24 / last24Calls) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Overview"
        description="Operational snapshot — last 30 days of AI usage, costs, and user activity."
        actions={
          <Link
            href="/admin/usage"
            className="border-border bg-card hover:bg-secondary inline-flex h-9 items-center rounded-md border px-3 text-sm transition-colors"
          >
            Detailed analytics →
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="size-4" aria-hidden />}
          label="Users"
          value={totalUsers}
          hint={`${activeSubs} active paid subs`}
        />
        <StatCard
          icon={<Sparkles className="size-4" aria-hidden />}
          label="Calls (30d)"
          value={last30Calls.toLocaleString()}
          hint={`${last24Calls.toLocaleString()} in last 24h`}
        />
        <StatCard
          icon={<CircleDollarSign className="size-4" aria-hidden />}
          label="AI cost (30d)"
          value={formatUsd(totalCost)}
          hint={`${tokensIn.toLocaleString()} in · ${tokensOut.toLocaleString()} out`}
          tone="warn"
        />
        <StatCard
          icon={<AlertTriangle className="size-4" aria-hidden />}
          label="Failure rate (24h)"
          value={`${failureRate}%`}
          hint={`${failed24} failed · ${last24Calls} total`}
          tone={failureRate > 5 ? "danger" : failureRate > 1 ? "warn" : "success"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            Per-tool usage (30d)
          </h2>
          <DataTable
            headers={["Tool", "Calls", "Cost", ""]}
            rows={perTool.map((row) => [
              <span key="t" className="font-medium">
                {TOOL_LABEL[row.tool] ?? row.tool}
              </span>,
              <span key="c" className="tabular-nums">
                {row._count._all.toLocaleString()}
              </span>,
              <span key="m" className="font-mono text-xs tabular-nums">
                {formatUsd(decimalToNumber(row._sum.costUsd), 4)}
              </span>,
              <Link
                key="l"
                href={`/admin/usage?tool=${row.tool}`}
                className="text-primary text-xs hover:underline"
              >
                inspect →
              </Link>,
            ])}
            empty="No usage in the last 30 days."
          />
        </div>
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            Recent failures
          </h2>
          {recentFails.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-sm">
                No failures recorded — everything green.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentFails.map((f) => (
                <Card key={f.id} className="!p-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge tone="danger">{f.errorCode ?? "AI_ERROR"}</Badge>
                    <span className="text-muted-foreground font-mono">
                      {TOOL_LABEL[f.tool] ?? f.tool}
                    </span>
                    <span className="text-muted-foreground ml-auto">
                      {formatRelative(f.createdAt)}
                    </span>
                  </div>
                  <p className="text-foreground mt-1.5 truncate text-sm">
                    {f.user?.email ?? "unknown user"} · {f.modelUsed}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card>
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
            <Activity className="size-4" aria-hidden /> Credits spent (30d)
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {creditsBurnedTotal.toLocaleString()}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">across all users + tools</p>
        </Card>
        <Card>
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
            <Megaphone className="size-4" aria-hidden /> Active announcements
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{activeAnnouncements}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            <Link href="/admin/announcements" className="hover:text-foreground transition-colors">
              manage →
            </Link>
          </p>
        </Card>
        <Card>
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
            <Sparkles className="size-4" aria-hidden /> Avg call cost
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {last30Calls > 0 ? formatUsd(totalCost / last30Calls, 4) : "—"}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">last 30 days, successful only</p>
        </Card>
      </div>
    </div>
  );
}

function decimalToNumber(v: Prisma.Decimal | null | undefined): number {
  if (!v) return 0;
  return Number(v.toString());
}
