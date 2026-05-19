import Link from "next/link";
import { Prisma, Tool, UsageStatus } from "@prisma/client";
import { db } from "@/lib/db";
import {
  Badge,
  DataTable,
  PageHeader,
  StatCard,
  formatRelative,
  formatUsd,
} from "@/components/admin/admin-primitives";
import { Activity, AlertTriangle, CircleDollarSign, Sparkles } from "lucide-react";
import { sinceMsAgo } from "@/lib/admin/time";

export const metadata = { title: "Usage" };
export const dynamic = "force-dynamic";

const RANGES = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
} as const;

const TOOL_LABEL: Record<string, string> = {
  TAG_GENERATOR: "Tag Generator",
  TITLE_GENERATOR: "Title Generator",
  KEYWORD_GENERATOR: "Keyword Generator",
  DESCRIPTION_GENERATOR: "Description Generator",
  LISTING_ANALYZER: "Listing Analyzer",
  SHOP_ANALYZER: "Shop Analyzer",
};

const TOOLS = Object.values(Tool);
const STATUSES = Object.values(UsageStatus);

interface SP {
  range?: string;
  tool?: string;
  status?: string;
}

export default async function UsagePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const rangeKey = (sp.range as keyof typeof RANGES) ?? "30d";
  const range = RANGES[rangeKey] ?? RANGES["30d"];
  const since = sinceMsAgo(range);

  const toolFilter = TOOLS.includes(sp.tool as Tool) ? (sp.tool as Tool) : undefined;
  const statusFilter = STATUSES.includes(sp.status as UsageStatus)
    ? (sp.status as UsageStatus)
    : undefined;

  const where: Prisma.UsageLogWhereInput = {
    createdAt: { gte: since },
    ...(toolFilter ? { tool: toolFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const [calls, success, failed, agg, perTool, perModel, topUsers, recent] = await Promise.all([
    db.usageLog.count({ where }),
    db.usageLog.count({ where: { ...where, status: "SUCCESS" } }),
    db.usageLog.count({ where: { ...where, status: "FAILED" } }),
    db.usageLog.aggregate({
      where: { ...where, status: "SUCCESS" },
      _sum: { costUsd: true, inputTokens: true, outputTokens: true, creditsUsed: true },
      _avg: { durationMs: true },
    }),
    db.usageLog.groupBy({
      by: ["tool"],
      where,
      _count: { _all: true },
      _sum: { costUsd: true },
      orderBy: { _count: { tool: "desc" } },
    }),
    db.usageLog.groupBy({
      by: ["modelUsed", "provider"],
      where,
      _count: { _all: true },
      _sum: { costUsd: true },
      orderBy: { _count: { modelUsed: "desc" } },
      take: 8,
    }),
    db.usageLog.groupBy({
      by: ["userId"],
      where,
      _count: { _all: true },
      _sum: { costUsd: true },
      orderBy: { _count: { userId: "desc" } },
      take: 10,
    }),
    db.usageLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { user: { select: { email: true, id: true } } },
    }),
  ]);

  const userMap = new Map<string, string>();
  if (topUsers.length > 0) {
    const users = await db.user.findMany({
      where: { id: { in: topUsers.map((u) => u.userId) } },
      select: { id: true, email: true },
    });
    for (const u of users) userMap.set(u.id, u.email);
  }

  const totalCost = decToNum(agg._sum.costUsd);
  const failureRate = calls > 0 ? Math.round((failed / calls) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Usage analytics"
        description="Per-tool, per-model, per-user breakdowns. Use the filters to narrow the window."
      />

      <form className="border-border bg-card mb-6 flex flex-wrap items-end gap-3 rounded-xl border p-4">
        <Field label="Range">
          <select
            name="range"
            defaultValue={rangeKey}
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </Field>
        <Field label="Tool">
          <select
            name="tool"
            defaultValue={toolFilter ?? ""}
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            <option value="">All tools</option>
            {TOOLS.map((t) => (
              <option key={t} value={t}>
                {TOOL_LABEL[t] ?? t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={statusFilter ?? ""}
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors"
        >
          Apply
        </button>
        <Link
          href="/admin/usage"
          className="text-muted-foreground hover:text-foreground inline-flex h-9 items-center px-2 text-xs transition-colors"
        >
          Reset
        </Link>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Sparkles className="size-4" aria-hidden />}
          label="Calls"
          value={calls.toLocaleString()}
          hint={`${success.toLocaleString()} succeeded`}
        />
        <StatCard
          icon={<CircleDollarSign className="size-4" aria-hidden />}
          label="AI cost"
          value={formatUsd(totalCost, 4)}
          hint={`${(agg._sum.inputTokens ?? 0).toLocaleString()} in · ${(agg._sum.outputTokens ?? 0).toLocaleString()} out`}
          tone="warn"
        />
        <StatCard
          icon={<Activity className="size-4" aria-hidden />}
          label="Avg latency"
          value={`${Math.round(agg._avg.durationMs ?? 0)}ms`}
          hint={`${(agg._sum.creditsUsed ?? 0).toLocaleString()} credits spent`}
        />
        <StatCard
          icon={<AlertTriangle className="size-4" aria-hidden />}
          label="Failure rate"
          value={`${failureRate}%`}
          hint={`${failed} failed`}
          tone={failureRate > 5 ? "danger" : failureRate > 1 ? "warn" : "success"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            By tool
          </h2>
          <DataTable
            headers={["Tool", "Calls", "Cost"]}
            rows={perTool.map((row) => [
              <span key="t" className="font-medium">
                {TOOL_LABEL[row.tool] ?? row.tool}
              </span>,
              <span key="c" className="tabular-nums">
                {row._count._all.toLocaleString()}
              </span>,
              <span key="m" className="font-mono tabular-nums">
                {formatUsd(decToNum(row._sum.costUsd), 4)}
              </span>,
            ])}
            empty="No data."
          />
        </div>
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            By model
          </h2>
          <DataTable
            headers={["Model", "Provider", "Calls", "Cost"]}
            rows={perModel.map((row) => [
              <code key="m" className="font-mono text-xs">
                {row.modelUsed}
              </code>,
              <span key="p" className="text-muted-foreground text-xs">
                {row.provider.toLowerCase()}
              </span>,
              <span key="c" className="tabular-nums">
                {row._count._all.toLocaleString()}
              </span>,
              <span key="$" className="font-mono tabular-nums">
                {formatUsd(decToNum(row._sum.costUsd), 4)}
              </span>,
            ])}
            empty="No data."
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            Top users
          </h2>
          <DataTable
            headers={["User", "Calls", "Cost"]}
            rows={topUsers.map((row) => [
              <Link
                key="u"
                href={`/admin/users/${row.userId}`}
                className="text-primary hover:underline"
              >
                {userMap.get(row.userId) ?? row.userId.slice(0, 8) + "…"}
              </Link>,
              <span key="c" className="tabular-nums">
                {row._count._all.toLocaleString()}
              </span>,
              <span key="$" className="font-mono tabular-nums">
                {formatUsd(decToNum(row._sum.costUsd), 4)}
              </span>,
            ])}
            empty="No data."
          />
        </div>
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            Recent calls
          </h2>
          <div className="border-border bg-card max-h-[420px] overflow-y-auto rounded-xl border">
            {recent.length === 0 ? (
              <p className="text-muted-foreground p-6 text-center text-sm">No calls in range.</p>
            ) : (
              <ul className="divide-border/60 divide-y text-xs">
                {recent.map((u) => (
                  <li key={u.id} className="flex items-center gap-2 px-4 py-2.5">
                    {u.status === "SUCCESS" ? (
                      <Badge tone="success">ok</Badge>
                    ) : u.status === "FAILED" ? (
                      <Badge tone="danger">{u.errorCode ?? "fail"}</Badge>
                    ) : (
                      <Badge tone="warn">refund</Badge>
                    )}
                    <span className="text-foreground min-w-0 truncate font-medium">
                      {TOOL_LABEL[u.tool] ?? u.tool}
                    </span>
                    <span className="text-muted-foreground hidden truncate sm:inline">
                      {u.user?.email}
                    </span>
                    <span className="text-muted-foreground font-mono">{u.durationMs}ms</span>
                    <span className="text-muted-foreground ml-auto font-mono">
                      {formatRelative(u.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-muted-foreground mb-1 block font-mono text-[10px] tracking-wider uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function decToNum(v: Prisma.Decimal | null | undefined): number {
  if (!v) return 0;
  return Number(v.toString());
}
