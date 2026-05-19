"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { Plan, UserRole } from "@prisma/client";
import { Card } from "@/components/admin/admin-primitives";
import { cn } from "@/lib/utils";

interface State {
  role: UserRole;
  plan: Plan;
  credits: number;
}

export function UserEditor({
  userId,
  email,
  initial,
}: {
  userId: string;
  email: string;
  initial: State;
}) {
  const router = useRouter();
  const [state, setState] = useState<State>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function setField<K extends keyof State>(k: K, v: State[K]) {
    setState((prev) => ({ ...prev, [k]: v }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setMsg({ ok: false, text: json.message ?? json.error ?? `Failed (${res.status})` });
      } else {
        setMsg({ ok: true, text: "Saved." });
        router.refresh();
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Unexpected error" });
    } finally {
      setBusy(false);
    }
  }

  async function softDelete() {
    if (
      !confirm(`Soft-delete ${email}? They will lose access immediately. Their data is retained.`)
    ) {
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setMsg({ ok: false, text: json.error ?? `Failed (${res.status})` });
      } else {
        router.push("/admin/users");
      }
    } finally {
      setBusy(false);
    }
  }

  const dirty = JSON.stringify(state) !== JSON.stringify(initial);

  return (
    <Card>
      <form onSubmit={save} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Role">
            <Select
              value={state.role}
              onChange={(v) => setField("role", v as UserRole)}
              options={["USER", "ADMIN"]}
            />
          </Field>
          <Field label="Plan">
            <Select
              value={state.plan}
              onChange={(v) => setField("plan", v as Plan)}
              options={["FREE", "PRO", "MAX"]}
            />
          </Field>
          <Field label="Credits (absolute set)">
            <input
              type="number"
              min={0}
              max={1_000_000}
              step={1}
              value={state.credits}
              onChange={(e) =>
                setField("credits", Math.max(0, Math.min(1_000_000, Number(e.target.value) || 0)))
              }
              className="border-input bg-background text-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy || !dirty}
            className={cn(
              "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
            )}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={softDelete}
            disabled={busy}
            className="text-destructive hover:bg-destructive/10 ml-auto inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm transition-colors disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden /> Soft-delete user
          </button>
          {msg && (
            <span
              role="status"
              className={cn(
                "rounded-md px-3 py-1.5 text-xs",
                msg.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-foreground mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Select<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as T)}
      className="border-input bg-background text-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {props.options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
