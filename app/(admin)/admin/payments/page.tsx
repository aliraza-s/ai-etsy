import { db } from "@/lib/db";
import { Badge, Card, PageHeader } from "@/components/admin/admin-primitives";
import { PROVIDER_META, PAYMENT_PROVIDERS } from "@/lib/payments/providers";
import { PaymentProviderForm } from "./provider-form";

export const metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  // Defense-in-depth: explicitly select only safe-to-render columns so the
  // ciphertext (`encryptedConfig`) is never even pulled into the page's
  // serializable data graph, even by accident.
  const rows = await db.paymentProviderConfig.findMany({
    select: {
      provider: true,
      isEnabled: true,
      mode: true,
      lastFour: true,
      updatedAt: true,
      updatedBy: true,
    },
  });
  const byProvider = new Map(rows.map((r) => [r.provider, r]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Payments"
        description="Toggle which payment providers are live and rotate their credentials. Secrets are AES-256-GCM-encrypted at rest — only the last 4 characters of the primary secret are ever shown. Webhook URLs are listed below each provider for copy/paste into the provider's dashboard."
      />

      <div className="space-y-4">
        {PAYMENT_PROVIDERS.map((id) => {
          const meta = PROVIDER_META[id];
          const existing = byProvider.get(id);
          return (
            <Card key={id} className="!p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-foreground inline-flex items-center gap-2 text-lg font-semibold">
                    {meta.label}
                    {existing && existing.isEnabled ? (
                      <Badge tone="success">Enabled</Badge>
                    ) : existing ? (
                      <Badge tone="warn">Configured · disabled</Badge>
                    ) : (
                      <Badge tone="default">Not configured</Badge>
                    )}
                    {existing && (
                      <Badge tone={existing.mode === "live" ? "danger" : "default"}>
                        {existing.mode === "live" ? "LIVE" : "test"}
                      </Badge>
                    )}
                  </h3>
                  <p className="text-muted-foreground mt-1 max-w-2xl text-xs leading-relaxed">
                    {meta.blurb}{" "}
                    <a
                      href={meta.consoleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      open dashboard →
                    </a>
                  </p>
                </div>
                {existing?.lastFour && (
                  <div className="text-right">
                    <p className="text-foreground font-mono text-sm">…{existing.lastFour}</p>
                    <p className="text-muted-foreground font-mono text-[10px]">
                      updated {existing.updatedAt.toLocaleDateString()}
                      {existing.updatedBy ? ` by ${existing.updatedBy}` : ""}
                    </p>
                  </div>
                )}
              </div>

              <PaymentProviderForm
                providerId={id}
                hasConfig={!!existing}
                initialEnabled={existing?.isEnabled ?? false}
                initialMode={(existing?.mode as "test" | "live" | undefined) ?? "test"}
              />

              <div className="border-border/60 text-muted-foreground mt-5 border-t pt-4 font-mono text-[11px]">
                Webhook URL — paste into {meta.label} dashboard:
                <code className="text-foreground bg-secondary ml-2 rounded px-1.5 py-0.5">
                  {`{your-domain}`}
                  {meta.webhookPath}
                </code>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
