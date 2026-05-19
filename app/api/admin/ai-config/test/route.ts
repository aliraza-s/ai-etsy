import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { AIProvider, Tool } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { getModel } from "@/lib/ai/providers";
import { TOOL_OUTPUT_SCHEMA, TOOL_TIMEOUT_MS, buildUserPrompt } from "@/lib/ai/schemas";
import { SAMPLE_INPUTS } from "@/lib/ai/sample-inputs";
import type { ZodTypeAny } from "zod";

export const runtime = "nodejs";
export const maxDuration = 120;

const testSchema = z.object({
  tool: z.enum(Object.values(Tool) as [Tool, ...Tool[]]),
  provider: z.enum(Object.values(AIProvider) as [AIProvider, ...AIProvider[]]),
  model: z.string().trim().min(2).max(120),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(64).max(16384),
  systemPrompt: z.string().trim().min(20).max(8000),
});

async function resolveKey(provider: AIProvider): Promise<string> {
  const record = await db.apiKey.findUnique({ where: { provider } });
  if (record && record.isActive) {
    try {
      return decrypt(record.encryptedKey);
    } catch {
      // fall through to env
    }
  }
  const envKey =
    provider === "ANTHROPIC"
      ? process.env.ANTHROPIC_API_KEY
      : provider === "OPENROUTER"
        ? process.env.OPENROUTER_API_KEY
        : provider === "TOGETHER"
          ? process.env.TOGETHER_API_KEY
          : undefined;
  if (envKey) return envKey;
  if (process.env.MOCK_AI === "true") return "mock-key";
  throw new Error(
    `No API key configured for ${provider}. Add one in /admin/api-keys or set ${provider}_API_KEY in .env.`,
  );
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = testSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { tool, provider, model, temperature, maxTokens, systemPrompt } = parsed.data;
  const outputSchema = TOOL_OUTPUT_SCHEMA[tool as keyof typeof TOOL_OUTPUT_SCHEMA] as
    | ZodTypeAny
    | undefined;
  if (!outputSchema) {
    return NextResponse.json({ error: "no_schema_for_tool" }, { status: 400 });
  }

  const sampleInput = SAMPLE_INPUTS[tool];
  const userPrompt = buildUserPrompt(tool, sampleInput);

  const start = Date.now();
  try {
    const apiKey = await resolveKey(provider);
    const aiModel = getModel({ provider, model, apiKey });

    const result = await generateObject({
      model: aiModel,
      schema: outputSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature,
      maxOutputTokens: maxTokens,
      abortSignal: AbortSignal.timeout(TOOL_TIMEOUT_MS[tool]),
    });

    return NextResponse.json({
      ok: true,
      durationMs: Date.now() - start,
      output: result.object,
      modelUsed: model,
      provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        durationMs: Date.now() - start,
        error: message.slice(0, 800),
      },
      { status: 200 },
    );
  }
}
