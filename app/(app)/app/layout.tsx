import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="bg-background min-h-[calc(100vh-3.5rem)]">
      <div className="border-border/60 bg-background/80 sticky top-14 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="App"
            className="-mx-2 flex items-center gap-x-1 overflow-x-auto px-2 text-sm whitespace-nowrap"
          >
            <Link
              href="/app"
              className="text-foreground hover:bg-secondary rounded px-2 py-1 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/app/tag-generator"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/app/title-generator"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              Titles
            </Link>
            <Link
              href="/app/keyword-generator"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              Keywords
            </Link>
            <Link
              href="/app/description-generator"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              Descriptions
            </Link>
            <Link
              href="/app/listing-analyzer"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              Listing audit
            </Link>
            <Link
              href="/app/shop-analyzer"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              Shop audit
            </Link>
            <Link
              href="/app/history"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
            >
              History
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-accent-foreground hover:text-accent hover:bg-secondary ml-2 rounded px-2 py-1 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
