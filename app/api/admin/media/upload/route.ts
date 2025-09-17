import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { sanitizeHtml } from "@/lib/sanitize";
import { prisma } from "@/lib/prisma";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, "jpeg" | "png" | "webp"> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

async function ensureAdmin() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function POST(request: Request) {
  try {
    await ensureAdmin();
    assertCsrf(request);
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403;
    return NextResponse.json({ error: status === 401 ? "Unauthorized" : "CSRF token неверен" }, { status });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const altRaw = (formData.get("alt") as string | null) ?? null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Не передан файл" }, { status: 400 });
  }

  const targetExt = ALLOWED_TYPES[file.type];
  if (!targetExt) {
    return NextResponse.json({ error: "Неподдерживаемый формат" }, { status: 415 });
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return NextResponse.json({ error: "Файл слишком большой (максимум 5 МБ)" }, { status: 413 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  let pipeline = sharp(buffer).rotate();
  switch (targetExt) {
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: 88, mozjpeg: true });
      break;
    case "png":
      pipeline = pipeline.png({ compressionLevel: 8 });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: 90 });
      break;
  }
  const processedBuffer = await pipeline.toBuffer();

  const fileName = `${Date.now()}-${randomUUID()}.${targetExt}`;
  const targetPath = path.join(uploadDir, fileName);
  await fs.writeFile(targetPath, processedBuffer);

  const record = await prisma.media.create({
    data: {
      path: `/uploads/${fileName}`,
      alt: altRaw ? sanitizeHtml(altRaw).trim() : null,
      type: file.type,
    },
  });

  return NextResponse.json({ success: true, media: record });
}
