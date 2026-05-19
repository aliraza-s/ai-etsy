import { Megaphone } from "lucide-react";
import type { AnnouncementAudience, Plan, UserRole } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Server component. Surfaces the most-recent active announcement targeted at the
 * current viewer (audience matches role/plan). Returns `null` when there's nothing
 * to show.
 */
export async function AnnouncementBanner({ role, plan }: { role: UserRole; plan: Plan }) {
  const audiences: AnnouncementAudience[] = ["ALL"];
  if (role === "ADMIN") audiences.push("ADMIN");
  if (plan === "FREE") audiences.push("FREE");
  if (plan === "PRO") audiences.push("PRO");
  if (plan === "MAX") audiences.push("MAX");

  const item = await db.announcement.findFirst({
    where: {
      isActive: true,
      audience: { in: audiences },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (!item) return null;

  return (
    <div className="border-primary/30 bg-primary/5 border-b">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Megaphone className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="text-foreground text-sm font-semibold">{item.title}</p>
          <p className="text-muted-foreground mt-0.5 text-sm">{item.body}</p>
        </div>
      </div>
    </div>
  );
}
