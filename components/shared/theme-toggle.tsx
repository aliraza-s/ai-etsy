"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes hydration guard: theme resolves on the client, so we render a
  // theme-agnostic icon until mount to avoid SSR/CSR mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const current = mounted ? (theme === "system" ? resolvedTheme : theme) : undefined;
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
      className={cn(
        "border-border bg-background hover:bg-secondary focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      <Sun
        className="h-4 w-4 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90"
        aria-hidden
      />
      <Moon
        className="absolute h-4 w-4 scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0"
        aria-hidden
      />
    </button>
  );
}
