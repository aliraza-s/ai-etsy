import { NextResponse } from "next/server";
import { z } from "zod";
import { Plan, UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const patchSchema = z.object({
  role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
  plan: z.enum(Object.values(Plan) as [Plan, ...Plan[]]),
  credits: z.number().int().min(0).max(1_000_000),
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

  const user = await db.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Last-admin guard: prevent demoting the only remaining admin.
  if (user.role === "ADMIN" && parsed.data.role !== "ADMIN") {
    const adminCount = await db.user.count({ where: { role: "ADMIN", deletedAt: null } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "last_admin", message: "Cannot demote the only remaining admin." },
        { status: 400 },
      );
    }
  }

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await db.$transaction([
    db.user.update({ where: { id }, data: { role: parsed.data.role } }),
    db.subscription.upsert({
      where: { userId: id },
      create: { userId: id, plan: parsed.data.plan, status: "ACTIVE" },
      update: { plan: parsed.data.plan },
    }),
    db.creditBalance.upsert({
      where: { userId: id },
      create: { userId: id, credits: parsed.data.credits, resetsAt: nextMonth },
      update: { credits: parsed.data.credits },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  if (id === guard.session.userId) {
    return NextResponse.json(
      { error: "self_delete", message: "You can't delete yourself." },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (user.role === "ADMIN") {
    const adminCount = await db.user.count({ where: { role: "ADMIN", deletedAt: null } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "last_admin", message: "Cannot delete the only remaining admin." },
        { status: 400 },
      );
    }
  }

  await db.user.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
