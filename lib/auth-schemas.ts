import { z } from "zod";

/**
 * Shared zod schemas for sign-up / sign-in flows.
 *
 * Co-locating these in one file lets the API route, the React-Hook-Form
 * resolver, and the Credentials provider all enforce the same shape so we
 * don't drift validation between client and server.
 */

const USERNAME_RE = /^[a-z0-9_]{3,32}$/i;

/** Reject `https://` and other protocol prefixes other than http(s). */
function isProbablyEtsyUrl(value: string): boolean {
  try {
    const u = new URL(value);
    if (!/^https?:$/.test(u.protocol)) return false;
    return /(^|\.)etsy\.com$/i.test(u.hostname);
  } catch {
    return false;
  }
}

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(32, "Keep it under 32 characters")
    .regex(USERNAME_RE, "Letters, numbers, and underscores only"),
  email: z.string().email("Enter a valid email").max(254),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(128, "Keep it under 128 characters"),
  etsyShopUrl: z
    .string()
    .trim()
    .max(2048)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => v === undefined || isProbablyEtsyUrl(v), {
      message: "Enter a full https://www.etsy.com/... URL",
    }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  /** Accepts an email OR a username — we resolve at the auth layer. */
  identifier: z.string().min(3, "Enter your email or username").max(254),
  password: z.string().min(1, "Enter your password").max(128),
});

export type SignInInput = z.infer<typeof signInSchema>;
