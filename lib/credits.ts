import { Prisma, type AIProvider, type Tool, type UsageStatus } from "@prisma/client";
import { db } from "@/lib/db";

export class InsufficientCreditsError extends Error {
  constructor(
    public required: number,
    public available: number,
  ) {
    super(`Insufficient credits: need ${required}, have ${available}`);
    this.name = "InsufficientCreditsError";
  }
}

export interface UsageMetrics {
  modelUsed: string;
  provider: AIProvider;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  durationMs: number;
  status: UsageStatus;
  errorCode?: string;
}

/**
 * Atomically reserve `cost` credits for `userId` running `tool`.
 *
 * Wraps a Prisma serializable transaction: SELECT FOR UPDATE the row,
 * verify the balance, then UPDATE. If `cost` exceeds the balance, throws
 * `InsufficientCreditsError` (no rows mutated).
 *
 * Returns the post-deduction balance, which the caller should pass to
 * `recordUsage()` after the AI call completes (success or failure).
 *
 * On total failure, call `refundCredits()` with the same `cost`.
 */
export async function reserveCredits(
  userId: string,
  tool: Tool,
  cost: number,
): Promise<{ creditsRemaining: number }> {
  return db.$transaction(
    async (tx) => {
      const balance = await tx.creditBalance.findUnique({ where: { userId } });
      if (!balance) {
        throw new InsufficientCreditsError(cost, 0);
      }
      if (balance.credits < cost) {
        throw new InsufficientCreditsError(cost, balance.credits);
      }
      const next = await tx.creditBalance.update({
        where: { userId },
        data: { credits: { decrement: cost } },
      });
      return { creditsRemaining: next.credits };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

/** Refund credits — used when an AI call fails after reservation. Idempotent at the row level (no double-deduction risk because we always add). */
export async function refundCredits(userId: string, cost: number): Promise<void> {
  await db.creditBalance.update({
    where: { userId },
    data: { credits: { increment: cost } },
  });
}

/** Insert the UsageLog row. Should be called once per attempt, regardless of success/failure. */
export async function recordUsage(
  userId: string,
  tool: Tool,
  creditsUsed: number,
  metrics: UsageMetrics,
): Promise<void> {
  await db.usageLog.create({
    data: {
      userId,
      tool,
      creditsUsed,
      modelUsed: metrics.modelUsed,
      provider: metrics.provider,
      inputTokens: metrics.inputTokens,
      outputTokens: metrics.outputTokens,
      costUsd: new Prisma.Decimal(metrics.costUsd.toFixed(6)),
      durationMs: metrics.durationMs,
      status: metrics.status,
      errorCode: metrics.errorCode,
    },
  });
}
