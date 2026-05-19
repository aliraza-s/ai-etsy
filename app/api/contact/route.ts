import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { logError } from "@/lib/log";

export const runtime = "nodejs";

const TOPICS = ["general", "billing", "bug", "feature", "partnership", "other"] as const;

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  topic: z.enum(TOPICS),
  message: z.string().trim().min(10).max(3000),
  /** Honeypot — must be empty. */
  website: z.string().max(0).optional().nullable(),
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";
const SUPPORT_INBOX = process.env.CONTACT_INBOX ?? "hello@craftly.app";
const EMAIL_FROM = process.env.EMAIL_FROM ?? `${APP_NAME} <hello@example.com>`;

const TOPIC_LABEL: Record<(typeof TOPICS)[number], string> = {
  general: "General",
  billing: "Billing",
  bug: "Bug report",
  feature: "Feature request",
  partnership: "Partnership / press",
  other: "Other",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { name, email, topic, message, website } = parsed.data;

  // Honeypot: silently drop spam without telling the bot why.
  if (website && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const subject = `[${APP_NAME}] ${TOPIC_LABEL[topic]} — ${name}`;
  const text =
    `New contact-form submission\n` +
    `─────────────────────────────\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Topic:   ${TOPIC_LABEL[topic]}\n\n` +
    `Message:\n${message}\n`;

  if (!process.env.RESEND_API_KEY) {
    console.log(`\n\x1b[36m→ Contact form (${TOPIC_LABEL[topic]})\x1b[0m`);
    console.log(text);
    console.log(`  (set RESEND_API_KEY in .env.local to forward to ${SUPPORT_INBOX})\n`);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: SUPPORT_INBOX,
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    logError(error, { scope: "api/contact/resend" });
    return NextResponse.json(
      { error: "send_failed", message: "Couldn't send your message. Email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
