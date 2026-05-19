import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/admin-primitives";
import { TOOL_SLUG_TO_ENUM } from "@/lib/ai/schemas";
import { AIConfigEditor } from "./editor";

export const dynamic = "force-dynamic";

const TOOL_LABEL: Record<string, string> = {
  TAG_GENERATOR: "Tag Generator",
  TITLE_GENERATOR: "Title Generator",
  KEYWORD_GENERATOR: "Keyword Generator",
  DESCRIPTION_GENERATOR: "Description Generator",
  LISTING_ANALYZER: "Listing Analyzer",
  SHOP_ANALYZER: "Shop Analyzer",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOL_SLUG_TO_ENUM[slug];
  return { title: tool ? TOOL_LABEL[tool] : "AI config" };
}

export default async function AIConfigEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOL_SLUG_TO_ENUM[slug];
  if (!tool) notFound();

  const config = await db.aIConfig.findUnique({ where: { tool } });
  if (!config) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/admin/ai-config"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-xs transition-colors"
      >
        ← All tools
      </Link>
      <PageHeader
        title={TOOL_LABEL[tool] ?? tool}
        description="Edit the model spec, fallback chain, sampling params, and system prompt. Use the Test button to run a sample input through the unsaved config — no credits charged, no usage logged."
      />
      <AIConfigEditor
        tool={tool}
        slug={slug}
        initial={{
          provider: config.provider,
          model: config.model,
          fallbackProvider: config.fallbackProvider,
          fallbackModel: config.fallbackModel,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          systemPrompt: config.systemPrompt,
        }}
      />
    </div>
  );
}
