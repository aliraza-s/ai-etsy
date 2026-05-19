"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import type { AIProvider } from "@prisma/client";
import { cn } from "@/lib/utils";

export function KeyRotator({
  provider,
  hasKey,
  isActive,
  monthlyBudgetUsd,
}: {
  provider: AIProvider;
  hasKey: boolean;
  isActive: boolean;
  monthlyBudgetUsd: number | null;
}) {
  const router = useRouter();
  const [newKey, setNewKey] = useState("");
  const [budget, setBudget] = useState(monthlyBudgetUsd != null ? String(monthlyBudgetUsd) : "");
  const [active, setActive] = useState(hasKey ? isActive : true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/api-keys/${provider.toLowerCase()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // omit `key` when the field is empty so the budget/active toggle alone works on existing rows
          key: newKey || undefined,
          monthlyBudgetUsd: budget === "" ? null : Number(budget),
          isActive: active,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setMsg({ ok: false, text: json.message ?? json.error ?? `Failed (${res.status})` });
      } else {
        setMsg({ ok: true, text: newKey ? "Saved + rotated." : "Saved." });
        setNewKey("");
        router.refresh();
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Unexpected error" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Remove the stored ${provider} key? The router will fall back to env var.`)) {
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/api-keys/${provider.toLowerCase()}`, {
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
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="text-foreground mb-1.5 block text-sm font-medium">
          {hasKey ? "Rotate API key" : "Set API key"}
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder={
              hasKey ? "Paste new key to rotate (leave empty to keep current)" : "Paste key…"
            }
            spellCheck={false}
            autoComplete="off"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 pr-10 font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
            aria-label={show ? "Hide key" : "Show key"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="text-muted-foreground mt-1.5 text-xs">
          Encrypted with AES-256-GCM before storage. Only the last 4 characters are ever displayed.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-foreground mb-1.5 block text-sm font-medium">
            Monthly budget cap (USD, optional)
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 200"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          />
        </label>
        <label className="bg-card flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="size-4 rounded"
          />
          Active
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
          )}
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {hasKey ? "Save changes" : "Save key"}
        </button>
        {hasKey && (
          <button
            type="button"
            onClick={remove}
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
