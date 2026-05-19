import { AIProvider } from "@prisma/client";
import { db } from "@/lib/db";
import { PageHeader, Card, Badge } from "@/components/admin/admin-primitives";
import { KeyRotator } from "./key-rotator";

export const metadata = { title: "API keys" };
export const dynamic = "force-dynamic";

const PROVIDER_META: Record<AIProvider, { label: string; envVar: string; helpUrl: string }> = {
  ANTHROPIC: {
    label: "Anthropic",
    envVar: "ANTHROPIC_API_KEY",
    helpUrl: "https://console.anthropic.com/settings/keys",
  },
  OPENROUTER: {
    label: "OpenRouter",
    envVar: "OPENROUTER_API_KEY",
    helpUrl: "https://openrouter.ai/keys",
  },
  TOGETHER: {
    label: "Together AI",
    envVar: "TOGETHER_API_KEY",
    helpUrl: "https://api.together.xyz/settings/api-keys",
  },
};

export default async function ApiKeysPage() {
  const keys = await db.apiKey.findMany();
  const byProvider = new Map(keys.map((k) => [k.provider, k]));
  const providers = Object.values(AIProvider);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="API keys"
        description="Provider keys are encrypted at rest with AES-256-GCM. Only the last 4 characters are ever shown. Saving a new key overwrites the previous one — the previous plaintext is unrecoverable."
      />

      {process.env.MOCK_AI === "true" && (
        <Card className="border-accent/40 mb-6">
          <p className="text-foreground text-sm">
            <span className="text-accent-foreground font-semibold">MOCK_AI=true</span> is set in
            your environment — the router will short-circuit to the mock model regardless of stored
            keys. Unset it in <code className="font-mono text-xs">.env.local</code> to exercise real
            providers.
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {providers.map((p) => {
          const existing = byProvider.get(p);
          const meta = PROVIDER_META[p];
          return (
            <Card key={p} className="!p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-foreground inline-flex items-center gap-2 text-lg font-semibold">
                    {meta.label}
                    {existing && existing.isActive ? (
                      <Badge tone="success">Active</Badge>
                    ) : existing ? (
                      <Badge tone="warn">Disabled</Badge>
                    ) : (
                      <Badge tone="default">Not set</Badge>
                    )}
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Env fallback: <code className="font-mono">{meta.envVar}</code> ·{" "}
                    <a
                      href={meta.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      get key →
                    </a>
                  </p>
                </div>
                {existing && (
                  <div className="text-right">
                    <p className="text-foreground font-mono text-sm">…{existing.lastFour}</p>
                    <p className="text-muted-foreground font-mono text-[10px]">
                      updated {existing.updatedAt.toLocaleDateString()}
                      {existing.updatedBy ? ` by ${existing.updatedBy}` : ""}
                    </p>
                  </div>
                )}
              </div>
              <KeyRotator
                provider={p}
                hasKey={!!existing}
                isActive={existing?.isActive ?? false}
                monthlyBudgetUsd={
                  existing?.monthlyBudgetUsd != null
                    ? Number(existing.monthlyBudgetUsd.toString())
                    : null
                }
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
