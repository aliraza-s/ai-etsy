import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import { Resend } from "resend";
import { db } from "@/lib/db";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";
const EMAIL_FROM = process.env.EMAIL_FROM ?? `${APP_NAME} <hello@example.com>`;

async function sendMagicLink({ identifier, url }: { identifier: string; url: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `\n[36m→ Magic link for ${identifier}[0m\n  ${url}\n  (set RESEND_API_KEY in .env.local to send via email)\n`,
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-email",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    ResendProvider({
      from: EMAIL_FROM,
      sendVerificationRequest: sendMagicLink,
    }),
  ],
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
