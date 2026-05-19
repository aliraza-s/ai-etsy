import Link from "next/link";
import { db } from "@/lib/db";
import { Badge, Card, PageHeader } from "@/components/admin/admin-primitives";
import { ChevronRight } from "lucide-react";
import { CREDIT_COST, MAX_BOOST_TOOLS, TOOL_ENUM_TO_SLUG } from "@/lib/ai/schemas";

export const metadata = { title: "AI config" };
export const dynamic = "force-dynamic";

const TOOL_LABEL: Record<string, string> = {
  TAG_GENERATOR: "Tag Generator",
  TITLE_GENERATOR: "Title Generator",
  KEYWORD_GENERATOR: "Keyword Generator",
  DESCRIPTION_GENERATOR: "Description Generator",
  LISTING_ANALYZER: "Listing Analyzer",
  SHOP_ANALYZER: "Shop Analyzer",
};

export default async function AIConfigListPage() {
  const configs = await db.aIConfig.findMany({ orderBy: { tool: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="AI config"
        description="Per-tool model, fallback, system prompt, temperature, and max-token budget. Edits take effect within 60 seconds (router cache TTL)."
      />

      {configs.length === 0 ? (
        <Card>
          <p className="text-muted-foreground text-sm">
            No AIConfig rows found. Run <code className="font-mono text-xs">pnpm db:seed</code> to
            create the default 6.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {configs.map((c) => {
            const slug = TOOL_ENUM_TO_SLUG[c.tool];
            const boosted = MAX_BOOST_TOOLS.includes(c.tool);
            return (
              <Link
                key={c.id}
                href={`/admin/ai-config/${slug}`}
                className="border-border bg-card hover:border-primary/40 hover:bg-secondary/40 group flex items-center justify-between rounded-xl border p-5 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-foreground font-semibold">{TOOL_LABEL[c.tool]}</h3>
                    <Badge tone="info">{CREDIT_COST[c.tool]} cr</Badge>
                    {boosted && <Badge tone="warn">Max → Sonnet 4.6</Badge>}
                  </div>
                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    {c.provider.toLowerCase()} · {c.model}
                    {c.fallbackProvider && c.fallbackModel
                      ? ` → fallback: ${c.fallbackProvider.toLowerCase()} · ${c.fallbackModel}`
                      : ""}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    temp {c.temperature} · max {c.maxTokens} tokens · updated{" "}
                    {c.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight
                  className="text-muted-foreground group-hover:text-foreground size-5 transition-colors"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
