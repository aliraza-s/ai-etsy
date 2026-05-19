import { generateObject } from "ai";
import type { AIConfig, Plan, Tool } from "@prisma/client";
import type { ZodTypeAny } from "zod";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import {
  InsufficientCreditsError,
  recordUsage,
  refundCredits,
  reserveCredits,
} from "@/lib/credits";
import {
  CREDIT_COST,
  MAX_BOOST_MODEL,
  MAX_BOOST_TOOLS,
  TOOL_OUTPUT_SCHEMA,
  TOOL_TIMEOUT_MS,
  buildUserPrompt,
} from "@/lib/ai/schemas";
import { estimateCost, getModel } from "./providers";
import { logError, logWarn } from "@/lib/log";

// ─── In-memory AIConfig cache (60s TTL) ──────────────────────────────────────

interface CacheEntry {
  config: AIConfig;
  expiresAt: number;
}
const configCache = new Map<Tool, CacheEntry>();
const CACHE_TTL_MS = 60_000;

async function loadConfig(tool: Tool): Promise<AIConfig> {
  const cached = configCache.get(tool);
  if (cached && cached.expiresAt > Date.now()) return cached.config;

  const config = await db.aIConfig.findUnique({ where: { tool } });
  if (!config) {
    throw new Error(
      `AIConfig missing for ${tool}. Run \`pnpm db:seed\` to populate the default configs.`,
    );
  }
  configCache.set(tool, { config, expiresAt: Date.now() + CACHE_TTL_MS });
  return config;
}

export function invalidateConfigCache(tool?: Tool) {
  if (tool) configCache.delete(tool);
  else configCache.clear();
}

// ─── API key resolution ──────────────────────────────────────────────────────

async function resolveApiKey(provider: AIConfig["provider"]): Promise<string> {
  // 1) Encrypted key stored by admin via /admin/ai-config takes precedence.
  const record = await db.apiKey.findUnique({ where: { provider } });
  if (record && record.isActive) {
    try {
      return decrypt(record.encryptedKey);
    } catch (e) {
      logError(e, { scope: "ai/router/decrypt", provider });
    }
  }
  // 2) Fall back to env vars (Phase 5 dev convenience; replace with DB key in prod).
  const envKey =
    provider === "ANTHROPIC"
      ? process.env.ANTHROPIC_API_KEY
      : provider === "OPENROUTER"
        ? process.env.OPENROUTER_API_KEY
        : provider === "TOGETHER"
          ? process.env.TOGETHER_API_KEY
          : undefined;
  if (envKey) return envKey;

  // 3) In mock mode we don't need a real key.
  if (process.env.MOCK_AI === "true") return "mock-key";

  throw new Error(
    `No API key configured for provider ${provider}. Set ${provider}_API_KEY in .env.local or add a key in /admin/ai-config.`,
  );
}

// ─── Core orchestrator ──────────────────────────────────────────────────────

export interface CallToolParams {
  tool: Tool;
  userId: string;
  userPlan: Plan;
  input: unknown;
}

export class AIRouterError extends Error {
  constructor(
    message: string,
    public code: "RATE_LIMITED" | "AI_ERROR" | "VALIDATION" | "TIMEOUT",
  ) {
    super(message);
    this.name = "AIRouterError";
  }
}

/**
 * Atomic credit-gated AI call.
 *
 * Lifecycle:
 *   1. Reserve credits (serializable tx). Throws `InsufficientCreditsError` if low.
 *   2. Resolve provider + model (Max-tier boost for analyzers).
 *   3. Try primary, then fallback (if configured).
 *   4. On total failure: refund credits + record FAILED usage log.
 *   5. On success: record SUCCESS usage log with token counts and cost.
 *
 * Returns the parsed, schema-validated output object.
 */
export async function callTool(params: CallToolParams) {
  const { tool, userId, userPlan, input } = params;
  const config = await loadConfig(tool);
  const cost = CREDIT_COST[tool];
  const outputSchema = TOOL_OUTPUT_SCHEMA[tool as keyof typeof TOOL_OUTPUT_SCHEMA] as
    | ZodTypeAny
    | undefined;
  if (!outputSchema) {
    throw new Error(`No output schema registered for ${tool}. Add one in lib/ai/schemas.ts.`);
  }

  // 1) Reserve credits up front. Throws InsufficientCreditsError if low.
  await reserveCredits(userId, tool, cost);

  // 2) Build a list of (provider, model) attempts: Max-boost / primary / fallback.
  const attempts: { provider: AIConfig["provider"]; model: string }[] = [];
  if (userPlan === "MAX" && MAX_BOOST_TOOLS.includes(tool)) {
    attempts.push(MAX_BOOST_MODEL);
  }
  attempts.push({ provider: config.provider, model: config.model });
  if (config.fallbackProvider && config.fallbackModel) {
    attempts.push({ provider: config.fallbackProvider, model: config.fallbackModel });
  }

  const userPrompt = buildUserPrompt(tool, input);
  let lastError: unknown = null;

  for (const attempt of attempts) {
    const start = Date.now();
    try {
      const apiKey = await resolveApiKey(attempt.provider);
      const model = getModel({
        provider: attempt.provider,
        model: attempt.model,
        apiKey,
      });

      const result = await generateObject({
        model,
        schema: outputSchema,
        system: config.systemPrompt,
        prompt: userPrompt,
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        abortSignal: AbortSignal.timeout(TOOL_TIMEOUT_MS[tool]),
      });

      const inputTokens = result.usage?.inputTokens ?? 0;
      const outputTokens = result.usage?.outputTokens ?? 0;
      const costUsd = estimateCost(attempt.model, inputTokens, outputTokens);

      await recordUsage(userId, tool, cost, {
        modelUsed: attempt.model,
        provider: attempt.provider,
        inputTokens,
        outputTokens,
        costUsd,
        durationMs: Date.now() - start,
        status: "SUCCESS",
      });

      return {
        output: result.object as unknown,
        modelUsed: attempt.model,
        provider: attempt.provider,
        creditsUsed: cost,
      };
    } catch (err) {
      lastError = err;
      logWarn(`ai/router ${tool} attempt failed`, {
        provider: attempt.provider,
        model: attempt.model,
        error: err instanceof Error ? err.message : String(err),
      });
      // Record FAILED usage for this attempt so admins can see retries in analytics.
      await recordUsage(userId, tool, 0, {
        modelUsed: attempt.model,
        provider: attempt.provider,
        inputTokens: 0,
        outputTokens: 0,
        costUsd: 0,
        durationMs: Date.now() - start,
        status: "FAILED",
        errorCode: classifyError(err),
      });
    }
  }

  // All attempts failed — refund and surface.
  await refundCredits(userId, cost);
  throw new AIRouterError(
    `All providers failed for ${tool}. Credits refunded.`,
    classifyError(lastError),
  );
}

function classifyError(err: unknown): AIRouterError["code"] {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (msg.includes("rate") || msg.includes("429")) return "RATE_LIMITED";
  if (msg.includes("timeout") || msg.includes("abort")) return "TIMEOUT";
  if (msg.includes("validation") || msg.includes("schema")) return "VALIDATION";
  return "AI_ERROR";
}

export { InsufficientCreditsError };
