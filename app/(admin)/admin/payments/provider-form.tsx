"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import {
  PROVIDER_META,
  providerSlug,
  type PaymentProviderId,
  type ProviderField,
} from "@/lib/payments/providers";
import { cn } from "@/lib/utils";

export function PaymentProviderForm({
  providerId,
  hasConfig,
  initialEnabled,
  initialMode,
}: {
  providerId: PaymentProviderId;
  hasConfig: boolean;
  initialEnabled: boolean;
  initialMode: "test" | "live";
}) {
  const router = useRouter();
  const meta = PROVIDER_META[providerId];
  const [enabled, setEnabled] = useState(initialEnabled);
  const [mode, setMode] = useState<"test" | "live">(initialMode);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(meta.fields.map((f) => [f.key, ""])),
  );
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function setField(k: string, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (fieldErrors[k]) setFieldErrors((prev) => ({ ...prev, [k]: "" }));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setFieldErrors({});

    // Only send `config` if the admin filled in *any* credential field.
    // Empty form = keep existing ciphertext, just update flags.
    const filled = Object.values(values).some((v) => v.trim().length > 0);
    const config = filled
      ? Object.fromEntries(
          Object.entries(values)
            .filter(([, v]) => v.trim().length > 0)
            .map(([k, v]) => [k, v.trim()]),
        )
      : undefined;

    try {
      const res = await fetch(`/api/admin/payments/${providerSlug(providerId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: enabled, mode, config }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        issues?: { path: string; message: string }[];
      };
      if (!res.ok) {
        if (json.issues && json.issues.length > 0) {
          const errors: Record<string, string> = {};
          for (const i of json.issues) errors[i.path] = i.message;
          setFieldErrors(errors);
          setMsg({ ok: false, text: "Fix the highlighted fields and try again." });
        } else {
          setMsg({ ok: false, text: json.message ?? json.error ?? `Failed (${res.status})` });
        }
      } else {
        setMsg({ ok: true, text: filled ? "Saved + rotated." : "Saved." });
        setValues(Object.fromEntries(meta.fields.map((f) => [f.key, ""])));
        router.refresh();
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Unexpected error" });
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    if (
      !confirm(
        `Remove the stored ${meta.label} config? This disables ${meta.label} immediately for all users.`,
      )
    ) {
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/payments/${providerSlug(providerId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setMsg({ ok: false, text: json.error ?? `Failed (${res.status})` });
      } else {
        setMsg({ ok: true, text: "Removed." });
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      {/* Mode + enabled toggles */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="border-border bg-background flex cursor-pointer items-start gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="mt-0.5 size-4 rounded"
          />
          <div>
            <p className="text-foreground text-sm font-medium">Enable {meta.label}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              When off, the checkout flow won&apos;t show this provider to users.
            </p>
          </div>
        </label>
        <div className="border-border bg-background rounded-md border p-3">
          <p className="text-foreground text-sm font-medium">Environment</p>
          <div className="mt-2 inline-flex w-full overflow-hidden rounded-md border">
            <ModeButton active={mode === "test"} onClick={() => setMode("test")}>
              Test / sandbox
            </ModeButton>
            <ModeButton active={mode === "live"} onClick={() => setMode("live")} danger>
              Live
            </ModeButton>
          </div>
        </div>
      </div>

      {/* Per-provider credential fields */}
      <fieldset className="space-y-3" disabled={busy}>
        <legend className="text-foreground mb-1 text-sm font-medium">
          {hasConfig ? "Rotate credentials" : "Credentials"}
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            {hasConfig
              ? "Leave fields blank to keep the current values."
              : "Required before you can enable this provider."}
          </span>
        </legend>
        {meta.fields.map((f) => (
          <CredentialField
            key={f.key}
            field={f}
            value={values[f.key] ?? ""}
            onChange={(v) => setField(f.key, v)}
            revealed={reveal[f.key] ?? false}
            onToggleReveal={() => setReveal((p) => ({ ...p, [f.key]: !p[f.key] }))}
            error={fieldErrors[f.key]}
          />
        ))}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
          )}
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {hasConfig ? "Save changes" : "Save"}
        </button>
        {hasConfig && (
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className="text-destructive hover:bg-destructive/10 inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm transition-colors disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden /> Remove
          </button>
        )}
        {msg && (
          <span
            role="status"
            className={cn(
              "ml-auto rounded-md px-3 py-1.5 text-xs",
              msg.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}

function CredentialField({
  field,
  value,
  onChange,
  revealed,
  onToggleReveal,
  error,
}: {
  field: ProviderField;
  value: string;
  onChange: (v: string) => void;
  revealed: boolean;
  onToggleReveal: () => void;
  error?: string;
}) {
  const isLongText = field.key === "publicKey";
  return (
    <div>
      <label className="text-foreground mb-1.5 flex items-center justify-between text-sm font-medium">
        <span>
          {field.label}
          {field.optional && (
            <span className="text-muted-foreground ml-1 font-normal">(optional)</span>
          )}
        </span>
        {field.helpUrl && (
          <a
            href={field.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs font-normal hover:underline"
          >
            help
          </a>
        )}
      </label>
      <div className="relative">
        {isLongText ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            spellCheck={false}
            autoComplete="off"
            rows={4}
            className={cn(
              "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none",
              error && "border-destructive",
            )}
          />
        ) : (
          <>
            <input
              type={field.secret && !revealed ? "password" : "text"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              spellCheck={false}
              autoComplete="off"
              className={cn(
                "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                field.secret && "pr-10",
                error && "border-destructive",
              )}
            />
            {field.secret && (
              <button
                type="button"
                onClick={onToggleReveal}
                tabIndex={-1}
                aria-label={revealed ? "Hide value" : "Show value"}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
              >
                {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
          </>
        )}
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  danger,
  children,
}: {
  active: boolean;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 flex-1 items-center justify-center text-xs font-medium transition-colors",
        active
          ? danger
            ? "bg-destructive/15 text-destructive"
            : "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
