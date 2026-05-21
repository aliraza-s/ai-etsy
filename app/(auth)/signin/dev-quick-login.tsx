"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dev-only quick-login block.
 *
 * Renders only when `process.env.NODE_ENV !== "production"`. Calls into the
 * Credentials provider added in `lib/auth.ts` — that provider rejects sign-in
 * if the env is production, so this is defended at both layers.
 */

const ACCOUNTS = [
  {
    email: "aliraza4043627@gmail.com",
    label: "Admin · MAX · 600 cr",
    note: "Full access including /admin",
    tone: "admin" as const,
  },
  {
    email: "test-pro@craftly.local",
    label: "Pro tester · 200 cr",
    note: "Mid-tier flow",
    tone: "pro" as const,
  },
  {
    email: "test-free@craftly.local",
    label: "Free tester · 15 cr",
    note: "Hits the credit wall fast",
    tone: "free" as const,
  },
];

export function DevQuickLogin() {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guard at render time so the block is fully absent in prod builds.
  if (process.env.NODE_ENV === "production") return null;

  async function signInAs(email: string) {
    setPending(email);
    setError(null);
    const res = await signIn("dev-credentials", { email, callbackUrl: "/app", redirect: false });
    if (!res?.ok) {
      setError(
        res?.error === "CredentialsSignin"
          ? `No seeded user matches ${email}. Run \`pnpm db:seed\` first.`
          : `Sign-in failed (${res?.error ?? "unknown"}).`,
      );
      setPending(null);
      return;
    }
    // Hard redirect so the new JWT cookie takes effect before navigation.
    window.location.assign(res.url ?? "/app");
  }

  return (
    <div className="border-accent/40 bg-accent/5 mt-6 rounded-md border p-4">
      <div className="flex items-center gap-1.5">
        <Zap className="text-accent-foreground size-3.5" aria-hidden />
        <p className="text-accent-foreground font-mono text-[10px] font-semibold tracking-wider uppercase">
          Dev mode · quick login
        </p>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        Skip the magic-link round trip. One click per seeded account.
      </p>
      <ul className="mt-3 space-y-1.5">
        {ACCOUNTS.map((a) => (
          <li key={a.email}>
            <button
              type="button"
              onClick={() => signInAs(a.email)}
              disabled={pending !== null}
              className={cn(
                "border-border bg-background hover:bg-secondary group flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:opacity-60",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-foreground inline-flex items-center gap-2 font-medium">
                  {a.label}
                  {a.tone === "admin" && (
                    <span className="border-primary/40 bg-primary/10 text-primary rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase">
                      admin
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground mt-0.5 truncate font-mono text-[10px]">
                  {a.email} · {a.note}
                </p>
              </div>
              {pending === a.email ? (
                <Loader2 className="text-muted-foreground size-4 animate-spin" aria-hidden />
              ) : (
                <span className="text-muted-foreground group-hover:text-foreground text-xs transition-colors">
                  Sign in →
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="text-destructive mt-3 text-xs">
          {error}
        </p>
      )}
      <p className="text-muted-foreground mt-3 text-[10px]">
        This block is hidden when <code className="font-mono">NODE_ENV=production</code>. The
        Credentials provider also refuses to authorize in prod.
      </p>
    </div>
  );
}
