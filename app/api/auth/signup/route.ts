import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/auth-schemas";
import { rateLimit, clientKey } from "@/lib/rate-limit";

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
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_failed",
        issues: parsed.error.issues.slice(0, 5).map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const { username, email, password, etsyShopUrl } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.toLowerCase().trim();

  const passwordHash = await hashPassword(password);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  try {
    await db.user.create({
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
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      // Unique constraint hit — could be email or username. Don't echo which.
      const target = (err.meta?.target as string[] | undefined) ?? [];
      const field = target.includes("username") ? "username" : "email";
      return NextResponse.json(
        { error: "already_exists", field, message: `That ${field} is already taken.` },
        { status: 409 },
      );
    }
    throw err;
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
