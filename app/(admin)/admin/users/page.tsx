import Link from "next/link";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Badge, DataTable, PageHeader, formatRelative } from "@/components/admin/admin-primitives";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, users] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: {
        subscription: true,
        creditBalance: true,
        _count: { select: { usageLogs: true, generations: true } },
      },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Users"
        description={`${total.toLocaleString()} active user${total === 1 ? "" : "s"}.`}
        actions={
          <form className="flex items-center gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="search email or name…"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-64 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <button
              type="submit"
              className="border-border bg-card hover:bg-secondary inline-flex h-9 items-center rounded-md border px-3 text-sm transition-colors"
            >
              Search
            </button>
          </form>
        }
      />

      <DataTable
        headers={["User", "Role", "Plan", "Credits", "Activity", "Joined", ""]}
        rows={users.map((u) => [
          <div key="u">
            <p className="text-foreground font-medium">{u.email}</p>
            {u.name && <p className="text-muted-foreground text-xs">{u.name}</p>}
          </div>,
          u.role === "ADMIN" ? <Badge tone="info">Admin</Badge> : <Badge>User</Badge>,
          <PlanBadge key="p" plan={u.subscription?.plan ?? "FREE"} />,
          <span key="c" className="tabular-nums">
            {u.creditBalance?.credits ?? 0}
          </span>,
          <span key="a" className="text-muted-foreground font-mono text-xs">
            {u._count.usageLogs} calls · {u._count.generations} gen
          </span>,
          <span key="j" className="text-muted-foreground text-xs">
            {formatRelative(u.createdAt)}
          </span>,
          <Link
            key="l"
            href={`/admin/users/${u.id}`}
            className="text-primary text-xs hover:underline"
          >
            edit →
          </Link>,
        ])}
        empty={q ? `No users match "${q}".` : "No users yet."}
      />

      {pageCount > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3 text-sm">
          {page > 1 && (
            <Link
              href={`/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page - 1) })}`}
              className="border-border bg-card hover:bg-secondary inline-flex h-9 items-center rounded-md border px-3 transition-colors"
            >
              ← Prev
            </Link>
          )}
          <span className="text-muted-foreground font-mono text-xs">
            Page {page} / {pageCount}
          </span>
          {page < pageCount && (
            <Link
              href={`/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) })}`}
              className="border-border bg-card hover:bg-secondary inline-flex h-9 items-center rounded-md border px-3 transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "MAX") return <Badge tone="warn">Max</Badge>;
  if (plan === "PRO") return <Badge tone="info">Pro</Badge>;
  return <Badge>Free</Badge>;
}
