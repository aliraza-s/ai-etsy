import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/auth-schemas";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { auditLog, noStoreHeaders } from "@/lib/security";

/**
 * POST /api/auth/signup
 *
 * Creates a new user with email + password + username and an optional
 * Etsy shop URL. On success the client should immediately call
 * `signIn("credentials", { identifier, password })` so the JWT cookie
 * is minted by Auth.js the normal way — we don't issue session cookies
 * from this route.
 *
 * Rate-limited per IP: 8 signups / 5 minutes (burst of 4).
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "signup"), {
    capacity: 4,
    refillPerSecond: 4 / 300,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: noStoreHeaders });
  }

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_failed",
        // Strip `received` / extras — only path + message ever leaves the server.
        issues: parsed.error.issues.slice(0, 5).map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400, headers: noStoreHeaders },
    );
  }
  const { username, email, password, etsyShopUrl } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.toLowerCase().trim();

  const passwordHash = await hashPassword(password);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  try {
    const created = await db.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        name: normalizedUsername,
        passwordHash,
        etsyShopUrl,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
        creditBalance: { create: { credits: 15, resetsAt: nextMonth } },
      },
      select: { id: true },
    });
    auditLog({
      actor: created.id,
      action: "user.signup",
      target: created.id,
      meta: { ip: clientKey(request, "signup") },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      // Unique constraint hit. We deliberately do NOT echo which field
      // collided — that would enable email/username enumeration. The UI
      // shows a generic "already taken" message; users can iterate on
      // username themselves. The internal audit log records the field so
      // operators can still debug.
      const target = (err.meta?.target as string[] | undefined) ?? [];
      const field = target.includes("username") ? "username" : "email";
      auditLog({
        actor: "anonymous",
        action: "user.signup.collision",
        target: field,
        meta: { ip: clientKey(request, "signup") },
      });
      return NextResponse.json(
        { error: "already_exists", message: "That email or username is already taken." },
        { status: 409, headers: noStoreHeaders },
      );
    }
    throw err;
  }

  return NextResponse.json({ ok: true }, { status: 201, headers: noStoreHeaders });
}
