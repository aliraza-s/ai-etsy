import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { encrypt } from "@/lib/encryption";
import {
  PROVIDER_META,
  extractLastFour,
  parseProviderSlug,
} from "@/lib/payments/providers";
import { rateLimit } from "@/lib/rate-limit";
import {
  EncryptionKeyMisconfiguredError,
  assertEncryptionKey,
  auditLog,
  noStoreHeaders,
} from "@/lib/security";

export const runtime = "nodejs";

const putSchema = z.object({
  isEnabled: z.boolean(),
  mode: z.enum(["test", "live"]),
  /**
   * Provider-specific config — validated against `PROVIDER_META[id].schema`.
   * Omitting `config` keeps the existing ciphertext and only updates flags
   * (mode/enabled). Required when no row exists yet.
   */
  config: z.record(z.string(), z.unknown()).optional(),
});

export async function PUT(request: Request, ctx: { params: Promise<{ provider: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  // Per-admin rate limit — even valid admins shouldn't be smashing this.
  const rl = rateLimit(`admin-payments:${guard.session.userId}`, {
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

  // Fail fast if the at-rest encryption key isn't usable. Throwing inside
  // `encrypt()` later would surface as 500; this returns a clean 503.
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
  const id = parseProviderSlug(slug);
  if (!id)
    return NextResponse.json(
      { error: "unknown_provider" },
      { status: 404, headers: noStoreHeaders },
    );
  const meta = PROVIDER_META[id];

  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_failed",
        issues: parsed.error.issues.slice(0, 5).map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400, headers: noStoreHeaders },
    );
  }
  const { isEnabled, mode, config } = parsed.data;

  const existing = await db.paymentProviderConfig.findUnique({ where: { provider: id } });

  if (!config && !existing) {
    return NextResponse.json(
      { error: "validation_failed", message: "Provide credentials before saving." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  if (isEnabled && !config && !existing) {
    return NextResponse.json(
      { error: "validation_failed", message: "Add credentials before enabling this provider." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  // When new config is provided, validate against the provider-specific schema.
  let encryptedConfig: string | undefined;
  let lastFour: string | undefined;
  if (config) {
    const cfgParsed = meta.schema.safeParse(config);
    if (!cfgParsed.success) {
      return NextResponse.json(
        {
          error: "validation_failed",
          issues: cfgParsed.error.issues.slice(0, 5).map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400, headers: noStoreHeaders },
      );
    }
    encryptedConfig = encrypt(JSON.stringify(cfgParsed.data));
    lastFour = extractLastFour(meta, cfgParsed.data as Record<string, unknown>);
  }

  await db.paymentProviderConfig.upsert({
    where: { provider: id },
    create: {
      provider: id,
      isEnabled,
      mode,
      encryptedConfig: encryptedConfig ?? "",
      lastFour: lastFour ?? null,
      updatedBy: guard.session.email,
    },
    update: {
      isEnabled,
      mode,
      ...(encryptedConfig !== undefined ? { encryptedConfig, lastFour: lastFour ?? null } : {}),
      updatedBy: guard.session.email,
    },
  });

  auditLog({
    actor: guard.session.email || guard.session.userId,
    action: encryptedConfig ? "payments.config.rotate" : "payments.config.update",
    target: id,
    meta: { isEnabled, mode, lastFour: lastFour ?? null },
  });

  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ provider: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const rl = rateLimit(`admin-payments:${guard.session.userId}`, {
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
  const id = parseProviderSlug(slug);
  if (!id)
    return NextResponse.json(
      { error: "unknown_provider" },
      { status: 404, headers: noStoreHeaders },
    );

  await db.paymentProviderConfig.delete({ where: { provider: id } }).catch(() => {
    // already gone — idempotent
  });

  auditLog({
    actor: guard.session.email || guard.session.userId,
    action: "payments.config.delete",
    target: id,
  });

  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}
