import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIRouterError, callTool } from "@/lib/ai/router";
import { InsufficientCreditsError } from "@/lib/credits";
import { TOOL_INPUT_SCHEMA, TOOL_SLUG_TO_ENUM } from "@/lib/ai/schemas";

export const runtime = "nodejs";

const ALLOWED_SLUGS = new Set([
  "tag-generator",
  "title-generator",
  "keyword-generator",
  "description-generator",
  "listing-analyzer",
  "shop-analyzer",
]);

export async function POST(request: Request, ctx: { params: Promise<{ tool: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { tool: slug } = await ctx.params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "unknown_tool" }, { status: 404 });
  }
  const toolEnum = TOOL_SLUG_TO_ENUM[slug]!;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const inputSchema = TOOL_INPUT_SCHEMA[toolEnum as keyof typeof TOOL_INPUT_SCHEMA];
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const userPlan =
    (await db.subscription.findUnique({ where: { userId: session.user.id } }))?.plan ?? "FREE";

  try {
    const result = await callTool({
      tool: toolEnum,
      userId: session.user.id,
      userPlan,
      input: parsed.data,
    });

    const generation = await db.generation.create({
      data: {
        userId: session.user.id,
        tool: toolEnum,
        input: parsed.data,
        output: result.output as never,
      },
    });

    const balance = await db.creditBalance.findUnique({
      where: { userId: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      generationId: generation.id,
      output: result.output,
      modelUsed: result.modelUsed,
      provider: result.provider,
      creditsUsed: result.creditsUsed,
      creditsRemaining: balance?.credits ?? 0,
    });
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json(
        {
          error: "insufficient_credits",
          required: err.required,
          available: err.available,
        },
        { status: 402 },
      );
    }
    if (err instanceof AIRouterError) {
      const status = err.code === "RATE_LIMITED" ? 429 : err.code === "TIMEOUT" ? 504 : 502;
      return NextResponse.json({ error: err.code.toLowerCase(), message: err.message }, { status });
    }
    console.error("[/api/ai/[tool]] unhandled", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
