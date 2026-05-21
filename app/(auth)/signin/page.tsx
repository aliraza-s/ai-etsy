import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./signin-form";
import { DevQuickLogin } from "./dev-quick-login";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account with a magic link or Google.",
};

export default function SignInPage() {
  return (
    <div className="border-border bg-card text-card-foreground w-full max-w-md rounded-2xl border p-8 shadow-sm backdrop-blur">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        <span className="text-gradient">Welcome back</span>
      </h1>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        Sign in with your email or username, a magic link, or Google.
      </p>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
      <DevQuickLogin />
      <p className="text-muted-foreground mt-6 text-xs">
        By continuing you agree to our{" "}
        <a href="/terms" className="hover:text-foreground underline underline-offset-2">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="hover:text-foreground underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
