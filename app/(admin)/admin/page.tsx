import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/app");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Phase 7 wires the AI-config editor, user management, and analytics. For now this page just
        confirms role-gating works.
      </p>
      <div className="border-border bg-card text-card-foreground mt-8 rounded-xl border p-6">
        <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
          signed in as
        </p>
        <p className="mt-1 font-medium">{session.user.email}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">role: ADMIN</p>
      </div>
    </div>
  );
}
