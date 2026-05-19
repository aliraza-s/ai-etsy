import { NextResponse } from "next/server";
import { z } from "zod";
import { AnnouncementAudience } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const upsertSchema = z.object({
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(1000),
  audience: z.enum(
    Object.values(AnnouncementAudience) as [AnnouncementAudience, ...AnnouncementAudience[]],
  ),
  isActive: z.boolean(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const created = await db.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      audience: parsed.data.audience,
      isActive: parsed.data.isActive,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
