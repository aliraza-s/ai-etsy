"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Pencil, X } from "lucide-react";
import type { AnnouncementAudience } from "@prisma/client";
import { Badge, Card, formatRelative } from "@/components/admin/admin-primitives";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const AUDIENCES: AnnouncementAudience[] = ["ALL", "FREE", "PRO", "MAX", "ADMIN"];

const EMPTY: Omit<Item, "id" | "createdAt"> = {
  title: "",
  body: "",
  audience: "ALL",
  isActive: true,
  expiresAt: null,
};

export function AnnouncementsManager({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<{ id?: string; data: typeof EMPTY }>({ data: EMPTY });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) {
    setEditing((e) => ({ ...e, data: { ...e.data, [k]: v } }));
  }

  function startEdit(item: Item) {
    setEditing({
      id: item.id,
      data: {
        title: item.title,
        body: item.body,
        audience: item.audience,
        isActive: item.isActive,
        expiresAt: item.expiresAt,
      },
    });
    setMsg(null);
  }

  function clearEdit() {
    setEditing({ data: EMPTY });
    setMsg(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const url = editing.id
        ? `/api/admin/announcements/${editing.id}`
        : `/api/admin/announcements`;
      const method = editing.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing.data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setMsg({ ok: false, text: json.message ?? json.error ?? `Failed (${res.status})` });
      } else {
        setMsg({ ok: true, text: editing.id ? "Saved." : "Created." });
        clearEdit();
        router.refresh();
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Unexpected error" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement? It will disappear from the app immediately.")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setMsg({ ok: false, text: `Failed (${res.status})` });
      } else {
        if (editing.id === id) clearEdit();
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-foreground font-semibold">
              {editing.id ? "Edit announcement" : "New announcement"}
            </h2>
            {editing.id && (
              <button
                type="button"
                onClick={clearEdit}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
              >
                <X className="size-3.5" aria-hidden /> Cancel edit
              </button>
            )}
          </div>

          <Field label="Title">
            <input
              type="text"
              value={editing.data.title}
              onChange={(e) => set("title", e.target.value)}
              required
              maxLength={120}
              placeholder="e.g. Black Friday: 30% off Pro & Max annual"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </Field>

          <Field label="Body">
            <textarea
              value={editing.data.body}
              onChange={(e) => set("body", e.target.value)}
              required
              rows={4}
              maxLength={1000}
              placeholder="One-paragraph message. Plain text — no markdown."
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Audience">
              <select
                value={editing.data.audience}
                onChange={(e) => set("audience", e.target.value as AnnouncementAudience)}
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Expires (optional)">
              <input
                type="datetime-local"
                value={editing.data.expiresAt ? toLocalInput(editing.data.expiresAt) : ""}
                onChange={(e) =>
                  set("expiresAt", e.target.value ? new Date(e.target.value).toISOString() : null)
                }
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              />
            </Field>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                type="checkbox"
                checked={editing.data.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
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
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Plus className="size-4" aria-hidden />
              )}
              {editing.id ? "Save changes" : "Create announcement"}
            </button>
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
      </Card>

      {initial.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase">
            All announcements ({initial.length})
          </h2>
          {initial.map((a) => {
            const expired = a.expiresAt && new Date(a.expiresAt) < new Date();
            return (
              <Card key={a.id} className="!p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-foreground font-semibold">{a.title}</h3>
                      <AudienceBadge audience={a.audience} />
                      {expired ? (
                        <Badge tone="danger">Expired</Badge>
                      ) : a.isActive ? (
                        <Badge tone="success">Active</Badge>
                      ) : (
                        <Badge>Inactive</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1.5 text-sm">{a.body}</p>
                    <p className="text-muted-foreground mt-2 font-mono text-[10px] tracking-wider uppercase">
                      created {formatRelative(a.createdAt)}
                      {a.expiresAt ? ` · expires ${new Date(a.expiresAt).toLocaleString()}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded p-1.5 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(a.id)}
                      disabled={busy}
                      className="text-destructive hover:bg-destructive/10 rounded p-1.5 transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
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

function AudienceBadge({ audience }: { audience: AnnouncementAudience }) {
  if (audience === "ALL") return <Badge>All</Badge>;
  if (audience === "MAX") return <Badge tone="warn">Max</Badge>;
  if (audience === "PRO") return <Badge tone="info">Pro</Badge>;
  if (audience === "ADMIN") return <Badge tone="info">Admin</Badge>;
  return <Badge>{audience}</Badge>;
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
