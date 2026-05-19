import Link from "next/link";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";

export const NAV_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export async function SiteNav() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="from-primary to-accent inline-block size-6 rounded-md bg-gradient-to-br"
          />
          <span>{APP_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthed ? (
            <Link
              href="/app"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-foreground hover:bg-secondary hidden rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signin"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hidden items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <MobileNav isAuthed={isAuthed} />
        </div>
      </nav>
    </header>
  );
}
