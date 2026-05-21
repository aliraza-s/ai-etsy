"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, AtSign, KeyRound, User, Store, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { signUpSchema, type SignUpInput } from "@/lib/auth-schemas";

function safeCallbackUrl(raw: string | null): string {
  if (!raw) return "/app";
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return "/app";
  if (raw.startsWith("//")) return "/app";
  if (!raw.startsWith("/")) return "/app";
  return raw;
}

interface SignupErrorBody {
  error?: string;
  field?: string;
  message?: string;
  issues?: { path: string; message: string }[];
}

export function SignUpForm() {
  const params = useSearchParams();
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignUpInput>({
    resolver: standardSchemaResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "", etsyShopUrl: "" },
  });

  async function onSubmit(values: SignUpInput) {
    setServerError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as SignupErrorBody;
      if (body.error === "already_exists" && body.field) {
        form.setError(body.field as keyof SignUpInput, {
          message: body.message ?? "Already taken",
        });
        return;
      }
      if (body.error === "validation_failed" && body.issues) {
        for (const issue of body.issues) {
          form.setError(issue.path as keyof SignUpInput, { message: issue.message });
        }
        return;
      }
      if (res.status === 429) {
        setServerError("Too many sign-up attempts. Try again in a minute.");
        return;
      }
      setServerError("Couldn't create your account. Try again in a moment.");
      return;
    }

    // Account created — sign in via Credentials so the JWT cookie is minted.
    const signInRes = await signIn("credentials", {
      identifier: values.email,
      password: values.password,
      callbackUrl,
      redirect: false,
    });
    if (!signInRes?.ok) {
      setServerError("Account created, but sign-in failed. Try signing in manually.");
      return;
    }
    window.location.assign(signInRes.url ?? callbackUrl);
  }

  const submitting = form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <Field
        id="username"
        label="Username"
        icon={<User className="size-4" aria-hidden />}
        placeholder="yourshop"
        autoComplete="username"
        error={form.formState.errors.username?.message}
        disabled={submitting}
        {...form.register("username")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        icon={<AtSign className="size-4" aria-hidden />}
        placeholder="you@example.com"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        disabled={submitting}
        {...form.register("email")}
      />
      <Field
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        icon={<KeyRound className="size-4" aria-hidden />}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
        disabled={submitting}
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
        {...form.register("password")}
      />
      <Field
        id="etsyShopUrl"
        label={
          <>
            Etsy shop URL <span className="text-muted-foreground font-normal">(optional)</span>
          </>
        }
        type="url"
        icon={<Store className="size-4" aria-hidden />}
        placeholder="https://www.etsy.com/shop/yourshop"
        autoComplete="off"
        error={form.formState.errors.etsyShopUrl?.message}
        disabled={submitting}
        {...form.register("etsyShopUrl")}
      />

      {serverError && (
        <p role="alert" className="text-destructive text-xs">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-primary-foreground hover:bg-primary/90 ring-primary/20 hover:ring-primary/40 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
      >
        {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Create account
      </button>
    </form>
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
