import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account with a magic link or Google.",
};

export default function SignInPage() {
  return (
    <div className="border-border bg-card text-card-foreground w-full max-w-md rounded-xl border p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Sign in with a magic link or Google. New here? Same form — we&apos;ll create your account.
      </p>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
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
