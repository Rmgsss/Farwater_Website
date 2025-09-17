import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { assertCsrf, getClientIp } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/sanitize";

const ideaSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  needs: z.string().optional(),
  contact: z.string().optional(),
});

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_COUNT = 5;

export async function POST(request: Request) {
  try {
    assertCsrf(request);
  } catch (error) {
    return NextResponse.json({ error: "CSRF token неверен" }, { status: 403 });
  }

  const ipKey = `idea:${getClientIp(request)}`;
  const limit = rateLimit(ipKey, RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW);
  if (!limit.ok) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parseResult = ideaSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Проверьте поля формы" }, { status: 400 });
  }

  const { title, summary, needs, contact } = parseResult.data;

  const record = await prisma.ideaProposal.create({
    data: {
      title: sanitizeHtml(title).trim(),
      summary: sanitizeHtml(summary).trim(),
      needs: needs ? sanitizeHtml(needs).trim() : null,
      contact: contact ? sanitizeHtml(contact).trim() : null,
    },
  });

  const mailSubject = `Новая идея: ${record.title}`;
  const mailBody = `Идея: ${record.title}\nКонтакты: ${record.contact ?? "—"}\nОписание:\n${record.summary}\n\nРесурсы:\n${record.needs ?? "Не указано"}`;

  await sendMail(mailSubject, mailBody).catch(() => undefined);

  return NextResponse.json({ success: true });
}
