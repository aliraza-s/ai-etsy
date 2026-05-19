import { NextResponse } from "next/server";
import { z } from "zod";
import { AIProvider } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { TOOL_SLUG_TO_ENUM } from "@/lib/ai/schemas";
import { invalidateConfigCache } from "@/lib/ai/router";

export const runtime = "nodejs";

const providerEnum = z.enum(Object.values(AIProvider) as [AIProvider, ...AIProvider[]]);

const patchSchema = z.object({
  provider: providerEnum,
  model: z.string().trim().min(2).max(120),
  fallbackProvider: providerEnum.nullable().optional(),
  fallbackModel: z.string().trim().min(2).max(120).nullable().optional(),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(64).max(16384),
  systemPrompt: z.string().trim().min(20).max(8000),
});

export async function PATCH(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;
  const tool = TOOL_SLUG_TO_ENUM[slug];
  if (!tool) return NextResponse.json({ error: "unknown_tool" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const fallbackProvider = parsed.data.fallbackProvider ?? null;
  const fallbackModel = parsed.data.fallbackModel ?? null;

  // If one fallback field is set, both must be; if neither, both must be null.
  if (Boolean(fallbackProvider) !== Boolean(fallbackModel)) {
    return NextResponse.json(
      { error: "validation_failed", message: "Set both fallback provider AND model, or neither." },
      { status: 400 },
    );
  }

  await db.aIConfig.update({
    where: { tool },
    data: {
      provider: parsed.data.provider,
      model: parsed.data.model,
      fallbackProvider,
      fallbackModel,
      temperature: parsed.data.temperature,
      maxTokens: parsed.data.maxTokens,
      systemPrompt: parsed.data.systemPrompt,
      updatedBy: guard.session.email,
    },
  });

  invalidateConfigCache(tool);

  return NextResponse.json({ ok: true });
}
