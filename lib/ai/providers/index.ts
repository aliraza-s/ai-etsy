import type { AIProvider } from "@prisma/client";
import type { LanguageModel } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { createMockModel } from "./mock";

export type ProviderEnv = AIProvider | "MOCK";

/**
 * Resolves a Vercel-AI-SDK `LanguageModel` for the given provider + model id.
 *
 * `apiKey` should be the decrypted plaintext key. If `MOCK_AI=true` (dev
 * convenience), all providers return a mock model that fabricates responses
 * without calling any external service.
 */
export function getModel({
  provider,
  model,
  apiKey,
}: {
  provider: AIProvider;
  model: string;
  apiKey: string;
}): LanguageModel {
  if (process.env.MOCK_AI === "true") {
    return createMockModel(provider, model);
  }

  switch (provider) {
    case "ANTHROPIC":
      return createAnthropic({ apiKey })(model);
    case "OPENROUTER":
      return createOpenRouter({ apiKey })(model);
    case "TOGETHER":
      return createTogetherAI({ apiKey })(model);
    default: {
      const exhaustive: never = provider;
      throw new Error(`Unsupported provider: ${exhaustive as string}`);
    }
  }
}

/** Per-1K-token cost (USD) — used to estimate `costUsd` in UsageLog. Approximate; refresh quarterly. */
export const TOKEN_COSTS: Record<string, { input: number; output: number }> = {
  // Anthropic Claude
  "claude-haiku-4-5-20251001": { input: 0.0008, output: 0.004 },
  "claude-sonnet-4-6": { input: 0.003, output: 0.015 },
  // OpenRouter — Qwen
  "qwen/qwen-2.5-7b-instruct": { input: 0.0002, output: 0.0002 },
  "qwen/qwen-2.5-32b-instruct": { input: 0.0008, output: 0.0008 },
};

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rate = TOKEN_COSTS[model] ?? { input: 0.001, output: 0.002 };
  return (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output;
}
