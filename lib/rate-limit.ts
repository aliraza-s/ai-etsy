/**
 * Lightweight in-memory rate limiter (token bucket per key).
 *
 * Suitable for single-instance dev + small-scale prod. When we move to
 * multi-instance Vercel / serverless, swap the `buckets` Map for an
 * Upstash Redis client and the rest of the API stays unchanged.
 *
 * NOT a security boundary on its own — it's a friction layer on top of the
 * usual defenses (CSRF cookies, session auth, atomic credit deduction).
 */

interface Bucket {
  /** Tokens currently available. */
  tokens: number;
  /** Last refill timestamp (ms). */
  refilledAt: number;
}

const buckets = new Map<string, Bucket>();

/** Periodic GC so the Map doesn't grow unbounded across long-running processes. */
let lastGc = 0;
const GC_INTERVAL_MS = 5 * 60 * 1000;
const GC_MAX_AGE_MS = 60 * 60 * 1000;

function gc() {
  const now = Date.now();
  if (now - lastGc < GC_INTERVAL_MS) return;
  lastGc = now;
  for (const [key, b] of buckets) {
    if (now - b.refilledAt > GC_MAX_AGE_MS) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  /** Bucket capacity (max burst). */
  capacity: number;
  /** Token refill rate, in tokens per second. */
  refillPerSecond: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Tokens left in the bucket after this call. */
  remaining: number;
  /** Seconds until the next token is available. 0 when not throttled. */
  retryAfterSeconds: number;
}

/**
 * Consume one token for `key`.
 *
 * Returns `ok: true` when the request is allowed, `ok: false` when throttled.
 * Throttled responses should send `Retry-After: <seconds>` and HTTP 429.
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  gc();
  const now = Date.now();
  const existing = buckets.get(key);
  const bucket: Bucket = existing ?? { tokens: opts.capacity, refilledAt: now };

  // Refill: add tokens proportional to time since last refill.
  if (existing) {
    const elapsedSec = (now - bucket.refilledAt) / 1000;
    const refill = elapsedSec * opts.refillPerSecond;
    bucket.tokens = Math.min(opts.capacity, bucket.tokens + refill);
    bucket.refilledAt = now;
  }

  if (bucket.tokens < 1) {
    const secondsToOne = (1 - bucket.tokens) / opts.refillPerSecond;
    buckets.set(key, bucket);
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(secondsToOne)),
    };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.floor(bucket.tokens), retryAfterSeconds: 0 };
}

/**
 * Best-effort client IP extraction from common proxy headers.
 *
 * Falls back to a static string so an unknown client still gets rate-limited
 * (just less precisely). Prefer the leftmost (closest-to-origin) value from
 * `x-forwarded-for` since intermediate proxies may inject their own.
 */
export function clientKey(request: Request, scope: string): string {
  const fwd = request.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
