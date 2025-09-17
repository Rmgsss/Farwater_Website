import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { assertCsrf, getClientIp } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/sanitize";

const volunteerSchema = z.object({
  name: z.string().min(2),
  contact: z.string().min(3),
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

  const ipKey = `volunteer:${getClientIp(request)}`;
  const limit = rateLimit(ipKey, RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW);
  if (!limit.ok) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parseResult = volunteerSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Проверьте поля формы" }, { status: 400 });
  }

  const { name, contact, message } = parseResult.data;

  const record = await prisma.volunteerApplication.create({
    data: {
      name: sanitizeHtml(name).trim(),
      contact: sanitizeHtml(contact).trim(),
      message: sanitizeHtml(message).trim(),
    },
  });

  const mailSubject = `Новая заявка волонтёра: ${record.name}`;
  const mailBody = `Имя: ${record.name}\nКонтакт: ${record.contact}\nСообщение:\n${record.message}`;

  await sendMail(mailSubject, mailBody).catch(() => undefined);

  return NextResponse.json({ success: true });
}
