import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { assertCsrf, getClientIp } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/sanitize";

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  social: z.string().optional(),
  message: z.string().min(10),
});

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_COUNT = 5;

export async function POST(request: Request) {
  try {
    assertCsrf(request);
  } catch (error) {
    return NextResponse.json({ error: "CSRF token неверен" }, { status: 403 });
  }

  const ipKey = `contact:${getClientIp(request)}`;
  const limit = rateLimit(ipKey, RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW);
  if (!limit.ok) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parseResult = contactSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Проверьте поля формы" }, { status: 400 });
  }

  const { email, phone, social, message } = parseResult.data;
  const cleanedEmail = sanitizeHtml(email).trim();
  const cleanedPhone = phone ? sanitizeHtml(phone).trim() : null;
  const cleanedSocial = social ? sanitizeHtml(social).trim() : null;
  const cleanedMessage = sanitizeHtml(message).trim();

  await prisma.contactMessage.create({
    data: {
      email: cleanedEmail,
      phone: cleanedPhone,
      social: cleanedSocial,
      message: cleanedMessage,
    },
  });

  const mailSubject = `Запрос от ${cleanedEmail}`;
  const mailBody = `Email: ${cleanedEmail}\nТелефон: ${cleanedPhone ?? "—"}\nСоцсети: ${cleanedSocial ?? "—"}\n\nСообщение:\n${cleanedMessage}`;

  await sendMail(mailSubject, mailBody).catch(() => undefined);

  return NextResponse.json({ success: true });
}
