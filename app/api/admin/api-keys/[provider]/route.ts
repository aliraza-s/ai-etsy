import { NextResponse } from "next/server";
import { z } from "zod";
import { AIProvider } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { encrypt } from "@/lib/encryption";
import { rateLimit } from "@/lib/rate-limit";
import {
  EncryptionKeyMisconfiguredError,
  assertEncryptionKey,
  auditLog,
  noStoreHeaders,
} from "@/lib/security";

export const runtime = "nodejs";

const providers = Object.values(AIProvider);

function parseProvider(slug: string): AIProvider | null {
  const upper = slug.toUpperCase();
  return (providers as string[]).includes(upper) ? (upper as AIProvider) : null;
}

const putSchema = z.object({
  // Optional — when omitted, we keep the current ciphertext and only update flags.
  key: z.string().trim().min(8).max(500).optional(),
  monthlyBudgetUsd: z.number().nonnegative().max(1_000_000).nullable().optional(),
  isActive: z.boolean(),
});

export async function PUT(request: Request, ctx: { params: Promise<{ provider: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const rl = rateLimit(`admin-api-keys:${guard.session.userId}`, {
    capacity: 10,
    refillPerSecond: 10 / 60,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { ...noStoreHeaders, "Retry-After": String(rl.retryAfterSeconds) },
      },
    );
  }

  try {
    assertEncryptionKey();
  } catch (err) {
    if (err instanceof EncryptionKeyMisconfiguredError) {
      return NextResponse.json(
        { error: "server_misconfigured", message: "ENCRYPTION_KEY is missing on the server." },
        { status: 503, headers: noStoreHeaders },
      );
    }
    throw err;
  }

  const { provider: slug } = await ctx.params;
  const provider = parseProvider(slug);
  if (!provider)
    return NextResponse.json(
      { error: "unknown_provider" },
      { status: 404, headers: noStoreHeaders },
    );

  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_failed",
        // Slim issues to path+message; never echo the received value back.
        issues: parsed.error.issues.slice(0, 5).map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const { key, monthlyBudgetUsd, isActive } = parsed.data;
  const existing = await db.apiKey.findUnique({ where: { provider } });

  if (!key && !existing) {
    return NextResponse.json(
      { error: "validation_failed", message: "No existing key — paste one to save." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  if (key) {
    const encryptedKey = encrypt(key);
    const lastFour = key.length >= 4 ? key.slice(-4) : key;
    await db.apiKey.upsert({
      where: { provider },
      create: {
        provider,
        encryptedKey,
        lastFour,
        isActive,
        monthlyBudgetUsd: monthlyBudgetUsd ?? null,
        updatedBy: guard.session.email,
      },
      update: {
        encryptedKey,
        lastFour,
        isActive,
        monthlyBudgetUsd: monthlyBudgetUsd ?? null,
        updatedBy: guard.session.email,
      },
    });
    auditLog({
      actor: guard.session.email || guard.session.userId,
      action: "ai-key.rotate",
      target: provider,
      meta: { isActive, monthlyBudgetUsd, lastFour },
    });
  } else {
    await db.apiKey.update({
      where: { provider },
      data: {
        isActive,
        monthlyBudgetUsd: monthlyBudgetUsd ?? null,
        updatedBy: guard.session.email,
      },
    });
    auditLog({
      actor: guard.session.email || guard.session.userId,
      action: "ai-key.flags",
      target: provider,
      meta: { isActive, monthlyBudgetUsd },
    });
  }

  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ provider: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const rl = rateLimit(`admin-api-keys:${guard.session.userId}`, {
    capacity: 10,
    refillPerSecond: 10 / 60,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { ...noStoreHeaders, "Retry-After": String(rl.retryAfterSeconds) },
      },
    );
  }

  const { provider: slug } = await ctx.params;
  const provider = parseProvider(slug);
  if (!provider)
    return NextResponse.json(
      { error: "unknown_provider" },
      { status: 404, headers: noStoreHeaders },
    );

  await db.apiKey.delete({ where: { provider } }).catch(() => {
    // already gone — idempotent
  });

  auditLog({
    actor: guard.session.email || guard.session.userId,
    action: "ai-key.delete",
    target: provider,
  });

  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}
