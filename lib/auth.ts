import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";
import type { UserRole } from "@prisma/client";
import { Resend } from "resend";
import { db } from "@/lib/db";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";
const EMAIL_FROM = process.env.EMAIL_FROM ?? `${APP_NAME} <hello@example.com>`;

/**
 * `true` when this is a non-production deployment. We use it to enable
 * the dev-only Credentials provider so testers can switch between seeded
 * accounts with one click. Hard-gated by `NODE_ENV` so it can never
 * accidentally ship to production.
 */
const isDev = process.env.NODE_ENV !== "production";

async function sendMagicLink({ identifier, url }: { identifier: string; url: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `\n\x1b[36m→ Magic link for ${identifier}\x1b[0m\n  ${url}\n  (set RESEND_API_KEY in .env.local to send via email)\n`,
    );
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: identifier,
    subject: `Sign in to ${APP_NAME}`,
    text: `Sign in to ${APP_NAME} by clicking this link:\n\n${url}\n\nIf you didn't request this, you can ignore this email.\n`,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
}

/**
 * Dev-only credentials provider — accepts an email, returns the matching
 * seeded user as a session identity. No password (it's dev). Refuses to
 * authorize unknown emails so it can't be used to mint sessions for
 * arbitrary addresses.
 */
const devCredentialsProvider = Credentials({
  id: "dev-credentials",
  name: "Dev quick-login",
  credentials: { email: { label: "Email", type: "email" } },
  async authorize(input) {
    if (process.env.NODE_ENV === "production") return null;
    const email = typeof input?.email === "string" ? input.email.toLowerCase().trim() : "";
    if (!email) return null;
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      image: user.image ?? undefined,
      // Carried through to the JWT callback below so role-gating works.
      role: user.role,
    };
  },
});

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID ?? "",
    clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  ResendProvider({
    from: EMAIL_FROM,
    sendVerificationRequest: sendMagicLink,
  }),
];
if (isDev) providers.push(devCredentialsProvider);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Adapter is still used by the Email provider for VerificationToken
  // storage; the Credentials provider coexists fine on JWT sessions.
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-email",
    error: "/auth/error",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
