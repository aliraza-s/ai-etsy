import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  PageHeader,
  Card,
  Badge,
  StatCard,
  formatRelative,
  formatUsd,
} from "@/components/admin/admin-primitives";
import { Prisma } from "@prisma/client";
import { UserEditor } from "./editor";
import { Activity, History, CircleDollarSign, Sparkles } from "lucide-react";
import { ONE_DAY_MS, sinceMsAgo } from "@/lib/admin/time";

export const dynamic = "force-dynamic";

const TOOL_LABEL: Record<string, string> = {
  TAG_GENERATOR: "Tags",
  TITLE_GENERATOR: "Titles",
  KEYWORD_GENERATOR: "Keywords",
  DESCRIPTION_GENERATOR: "Descriptions",
  LISTING_ANALYZER: "Listing audit",
  SHOP_ANALYZER: "Shop audit",
  NICHE_FINDER: "Niche finder",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await db.user.findUnique({ where: { id } });
  return { title: u?.email ?? "User" };
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      creditBalance: true,
    },
  });
  if (!user) notFound();

  const since = sinceMsAgo(30 * ONE_DAY_MS);
  const [recentUsage, costAgg, perTool] = await Promise.all([
    db.usageLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
    db.usageLog.aggregate({
      where: { userId: id, status: "SUCCESS", createdAt: { gte: since } },
      _sum: { costUsd: true, creditsUsed: true },
    }),
    db.usageLog.groupBy({
      by: ["tool"],
      where: { userId: id, createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { tool: "desc" } },
    }),
  ]);

  const total30Cost = costAgg._sum.costUsd
    ? Number((costAgg._sum.costUsd as Prisma.Decimal).toString())
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/admin/users"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-xs transition-colors"
      >
        ← All users
      </Link>

      <PageHeader
        title={user.email}
        description={`User since ${user.createdAt.toLocaleDateString()} · ${user.name ?? "no name set"}`}
        actions={
          <div className="flex items-center gap-2">
            {user.role === "ADMIN" ? <Badge tone="info">Admin</Badge> : <Badge>User</Badge>}
            <PlanBadge plan={user.subscription?.plan ?? "FREE"} />
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Sparkles className="size-4" aria-hidden />}
          label="Credits"
          value={user.creditBalance?.credits ?? 0}
          hint={
            user.creditBalance
              ? `resets ${user.creditBalance.resetsAt.toLocaleDateString()}`
              : "not provisioned"
          }
        />
        <StatCard
          icon={<Activity className="size-4" aria-hidden />}
          label="Calls (30d)"
          value={perTool.reduce((a, b) => a + b._count._all, 0).toLocaleString()}
        />
        <StatCard
          icon={<CircleDollarSign className="size-4" aria-hidden />}
          label="Cost (30d)"
          value={formatUsd(total30Cost, 4)}
          tone="warn"
        />
        <StatCard
          icon={<History className="size-4" aria-hidden />}
          label="Plan status"
          value={user.subscription?.status ?? "—"}
          hint={
            user.subscription?.renewsAt
              ? `renews ${user.subscription.renewsAt.toLocaleDateString()}`
              : undefined
          }
        />
      </div>

      <div className="mt-8">
        <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
          Edit
        </h2>
        <UserEditor
          userId={user.id}
          email={user.email}
          initial={{
            role: user.role,
            plan: user.subscription?.plan ?? "FREE",
            credits: user.creditBalance?.credits ?? 0,
          }}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            Tool mix (30d)
          </h2>
          {perTool.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-sm">No usage in the last 30 days.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {perTool.map((row) => (
                <Card key={row.tool} className="!p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{TOOL_LABEL[row.tool] ?? row.tool}</span>
                    <span className="font-mono tabular-nums">{row._count._all}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
            Recent activity
          </h2>
          {recentUsage.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-sm">No recent calls.</p>
            </Card>
          ) : (
            <div className="space-y-1.5">
              {recentUsage.map((u) => (
                <div
                  key={u.id}
                  className="border-border bg-card flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {u.status === "SUCCESS" ? (
                      <Badge tone="success">ok</Badge>
                    ) : u.status === "FAILED" ? (
                      <Badge tone="danger">{u.errorCode ?? "fail"}</Badge>
                    ) : (
                      <Badge tone="warn">refund</Badge>
                    )}
                    <span className="text-foreground">{TOOL_LABEL[u.tool] ?? u.tool}</span>
                    <span className="text-muted-foreground font-mono">{u.modelUsed}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">
                    {formatRelative(u.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "MAX") return <Badge tone="warn">Max</Badge>;
  if (plan === "PRO") return <Badge tone="info">Pro</Badge>;
  return <Badge>Free</Badge>;
}
