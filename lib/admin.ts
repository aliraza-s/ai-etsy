import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export interface AdminSession {
  userId: string;
  email: string;
}

/**
 * Gate an API route on `role === "ADMIN"`.
 *
 * Returns either `{ ok: true, session }` or `{ ok: false, response }`. Callers
 * should early-return `response` when `ok` is false to surface a 401/403.
 */
export async function requireAdmin(): Promise<
  { ok: true; session: AdminSession } | { ok: false; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }
  if (session.user.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }
  return {
    ok: true,
    session: { userId: session.user.id, email: session.user.email ?? "" },
  };
}
