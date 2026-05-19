import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreditCard, Sparkles, History } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [credits, recentGenerations] = await Promise.all([
    db.creditBalance.findUnique({ where: { userId } }),
    db.generation.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Phase 1 dashboard placeholder. Phase 5 wires the real tools.
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
          value="FREE"
          hint="upgrade in Phase 4"
        />
        <StatCard
          icon={<History className="size-4" aria-hidden />}
          label="Generations"
          value={recentGenerations.length}
          hint="last 5"
        />
      </div>

      <div className="border-border bg-card text-card-foreground mt-8 rounded-xl border p-6">
        <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
          phase 1 status
        </p>
        <h2 className="mt-1 text-lg font-semibold">Auth + DB wired</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          You signed in via{" "}
          {session?.user?.email ? <strong>{session.user.email}</strong> : "magic link or Google"}.
          Sessions are JWT; user/account/verification tokens persist in Postgres via the Prisma
          adapter. Phase 2 builds the public marketing pages, Phase 4 adds billing, Phase 5 brings
          the AI tools online.
        </p>
      </div>
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
