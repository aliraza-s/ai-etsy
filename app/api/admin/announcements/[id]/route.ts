import { NextResponse } from "next/server";
import { z } from "zod";
import { AnnouncementAudience } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(1000),
  audience: z.enum(
    Object.values(AnnouncementAudience) as [AnnouncementAudience, ...AnnouncementAudience[]],
  ),
  isActive: z.boolean(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await db.announcement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      audience: parsed.data.audience,
      isActive: parsed.data.isActive,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  await db.announcement.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
