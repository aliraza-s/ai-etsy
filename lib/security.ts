/**
 * Security helpers used across auth + admin routes.
 *
 *  - `assertEncryptionKey()` — fails fast with a clean error message when
 *    `ENCRYPTION_KEY` is missing/invalid, so admin payloads don't return
 *    raw 500s that hint at server-side state.
 *
 *  - `dummyVerifyPassword()` — runs a scrypt against a constant secret so
 *    the credentials provider's `authorize()` has the same latency whether
 *    the supplied identifier matches a real user or not. Without this, an
 *    attacker can probe `identifier → exists?` by timing the response.
 *
 *  - `noStoreHeaders()` — shared headers for sensitive admin JSON responses
 *    so they're never cached by browsers, CDNs, or shared proxies.
 */

import { hashPassword, verifyPassword } from "@/lib/password";

/**
 * Lazy-generated dummy hash. The first call pays a one-time scrypt cost
 * (~50ms) and the result is memoized. Every subsequent call to
 * `dummyVerifyPassword` then runs a full scrypt verify against it, so the
 * branch where the user doesn't exist has the same latency as the branch
 * where it does — defeating username/email enumeration via response timing.
 *
 * Generated at runtime instead of hardcoded so the hash is guaranteed to
 * parse cleanly through `verifyPassword`, and so it inherits whatever
 * scrypt params we're currently using.
 */
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword(
      // Random-ish constant string — value doesn't matter, only that scrypt runs.
      "not-a-real-password-just-here-for-constant-time-comparison",
    );
  }
  return dummyHashPromise;
}

export async function dummyVerifyPassword(candidate: string): Promise<void> {
  const hash = await getDummyHash();
  // Result is intentionally discarded — only the scrypt work matters.
  await verifyPassword(candidate, hash).catch(() => false);
}

export function assertEncryptionKey(): void {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new EncryptionKeyMisconfiguredError();
  }
}

export class EncryptionKeyMisconfiguredError extends Error {
  constructor() {
    super("ENCRYPTION_KEY env var is missing or malformed (must be 64-char hex)");
    this.name = "EncryptionKeyMisconfiguredError";
  }
}

export const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
} as const;

/**
 * Structured audit log for sensitive admin actions (key rotation, payment
 * provider edits, etc.). Goes to stdout as a single JSON line — picked up
 * by any log scraper (Vercel logs, Datadog, etc.). Does NOT include the
 * secret value itself, just metadata.
 */
export function auditLog(event: {
  actor: string;
  action: string;
  target: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    type: "audit",
    ts: new Date().toISOString(),
    ...event,
  };
  // Single-line JSON for easy ingestion. Avoid console.log for tooling that
  // already pipes that to user output; use console.warn-level for audit so it
  // routes to stderr-style streams in most platforms.
  console.warn(JSON.stringify(payload));
}
