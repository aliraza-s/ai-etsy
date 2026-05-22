"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AtSign, Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { signInSchema, type SignInInput } from "@/lib/auth-schemas";

const magicLinkSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
type MagicLinkValues = z.infer<typeof magicLinkSchema>;

/**
 * Accept only same-origin paths as the post-signin redirect target.
 *
 * Rejects absolute URLs (open-redirect protection), protocol-relative URLs
 * ("//evil.com"), and any path that doesn't start with `/`. Falls back to
 * the default `/app` route on any rejection.
 */
function safeCallbackUrl(raw: string | null): string {
  if (!raw) return "/app";
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return "/app";
  if (raw.startsWith("//")) return "/app";
  if (!raw.startsWith("/")) return "/app";
  return raw;
}

type Mode = "password" | "magic";

export function SignInForm() {
  const params = useSearchParams();
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const passwordForm = useForm<SignInInput>({
    resolver: standardSchemaResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const magicForm = useForm<MagicLinkValues>({
    resolver: standardSchemaResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function onPasswordSubmit(values: SignInInput) {
    setServerError(null);
    const res = await signIn("credentials", {
      identifier: values.identifier,
      password: values.password,
      callbackUrl,
      redirect: false,
    });
    if (!res?.ok) {
      setServerError("Incorrect email/username or password.");
      return;
    }
    window.location.assign(res.url ?? callbackUrl);
  }

  async function onMagicSubmit(values: MagicLinkValues) {
    setServerError(null);
    await signIn("resend", { email: values.email, callbackUrl, redirect: false });
    setMagicSent(true);
  }

  async function onGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  const passwordSubmitting = passwordForm.formState.isSubmitting;
  const magicSubmitting = magicForm.formState.isSubmitting;
  const anyBusy = passwordSubmitting || magicSubmitting || googleLoading;

  return (
    // suppressHydrationWarning here because privacy extensions
    // (Bitdefender Anti-Tracker, etc.) inject `bis_skin_checked` onto every
    // <div> before React hydrates, which causes a noisy console warning even
    // though hydration still completes successfully.
    <div className="mt-6 space-y-4" suppressHydrationWarning>
      <button
        type="button"
        onClick={onGoogle}
        disabled={anyBusy}
        className="border-border bg-background hover:bg-secondary inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <GoogleMark className="size-4" />
        )}
        Continue with Google
      </button>

      <div className="text-muted-foreground relative flex items-center gap-3 text-xs">
        <span className="bg-border h-px flex-1" />
        or
        <span className="bg-border h-px flex-1" />
      </div>

      {/* Mode switcher */}
      <div className="border-border bg-secondary/40 inline-flex w-full rounded-md border p-0.5 text-xs">
        <ModeTab active={mode === "password"} onClick={() => setMode("password")}>
          Email / username
        </ModeTab>
        <ModeTab active={mode === "magic"} onClick={() => setMode("magic")}>
          Magic link
        </ModeTab>
      </div>

      {mode === "password" ? (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
          <Field
            id="identifier"
            label="Email or username"
            icon={<AtSign className="size-4" aria-hidden />}
            placeholder="you@example.com or yourshop"
            autoComplete="username"
            error={passwordForm.formState.errors.identifier?.message}
            disabled={passwordSubmitting}
            {...passwordForm.register("identifier")}
          />
          <Field
            id="password"
            label={
              <span className="flex items-center justify-between">
                <span>Password</span>
                <Link
                  href="/signin?mode=magic"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("magic");
                  }}
                  className="text-muted-foreground hover:text-foreground text-xs font-normal"
                >
                  Forgot? Use magic link
                </Link>
              </span>
            }
            type={showPassword ? "text" : "password"}
            icon={<KeyRound className="size-4" aria-hidden />}
            placeholder="Your password"
            autoComplete="current-password"
            error={passwordForm.formState.errors.password?.message}
            disabled={passwordSubmitting}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            {...passwordForm.register("password")}
          />
          {serverError && (
            <p role="alert" className="text-destructive text-xs">
              {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={anyBusy}
            className="bg-primary text-primary-foreground hover:bg-primary/90 ring-primary/20 hover:ring-primary/40 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
          >
            {passwordSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Sign in
          </button>
        </form>
      ) : (
        <form onSubmit={magicForm.handleSubmit(onMagicSubmit)} className="space-y-3">
          <Field
            id="magic-email"
            label="Email"
            type="email"
            icon={<AtSign className="size-4" aria-hidden />}
            placeholder="you@example.com"
            autoComplete="email"
            error={magicForm.formState.errors.email?.message}
            disabled={magicSubmitting}
            {...magicForm.register("email")}
          />
          {magicSent ? (
            <p className="border-primary/30 bg-primary/5 text-primary rounded-md border px-3 py-2 text-xs">
              Check your inbox — we sent you a sign-in link.
            </p>
          ) : (
            <button
              type="submit"
              disabled={anyBusy}
              className="bg-primary text-primary-foreground hover:bg-primary/90 ring-primary/20 hover:ring-primary/40 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              {magicSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Mail className="size-4" aria-hidden />
              )}
              Send magic link
            </button>
          )}
        </form>
      )}

      <p className="text-muted-foreground text-center text-sm">
        New here?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 flex-1 items-center justify-center rounded font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(props, ref) {
  const { id, label, icon, suffix, error, className, ...rest } = props;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 h-11 w-full rounded-md border text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60",
            icon ? "pl-9" : "pl-3",
            suffix ? "pr-11" : "pr-3",
            error && "border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          {...rest}
        />
        {suffix && <span className="absolute top-1/2 right-1.5 -translate-y-1/2">{suffix}</span>}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
});

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}
