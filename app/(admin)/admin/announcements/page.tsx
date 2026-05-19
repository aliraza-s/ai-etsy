import { db } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/admin-primitives";
import { AnnouncementsManager } from "./manager";

export const metadata = { title: "Announcements" };
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const items = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Announcements"
        description="Site-wide banners shown to signed-in users on /app. Target by audience (All, Free, Pro, Max, Admin) and optional expiry."
      />
      <AnnouncementsManager
        initial={items.map((a) => ({
          id: a.id,
          title: a.title,
          body: a.body,
          audience: a.audience,
          isActive: a.isActive,
          expiresAt: a.expiresAt?.toISOString() ?? null,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
      {items.length === 0 && (
        <Card className="mt-6">
          <p className="text-muted-foreground text-sm">
            No announcements yet. Use the form above to create one.
          </p>
        </Card>
      )}
    </div>
  );
}
