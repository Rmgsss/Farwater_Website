import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { sanitizeHtml } from "@/lib/sanitize";

function ensureAdmin() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    throw new Error("UNAUTHORIZED");
  }
}

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    ensureAdmin();
    assertCsrf(request);
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403;
    return NextResponse.json({ error: status === 401 ? "Unauthorized" : "CSRF token неверен" }, { status });
  }

  const body = await request.json().catch(() => ({}));
  const {
    title,
    slug,
    excerpt,
    contentMDX,
    coverImage,
    gallery = [],
    tags = [],
    status = "draft",
    publishedAt,
  } = body as {
    title?: string;
    slug?: string;
    excerpt?: string;
    contentMDX?: string;
    coverImage?: string | null;
    gallery?: string[];
    tags?: string[];
    status?: string;
    publishedAt?: string | null;
  };

  if (!title || !slug || !excerpt || !contentMDX) {
    return NextResponse.json({ error: "title, slug, excerpt и content обязательны" }, { status: 400 });
  }

  const cleanedTitle = sanitizeHtml(String(title)).trim();
  const cleanedExcerpt = sanitizeHtml(String(excerpt)).trim();
  const cleanedContent = sanitizeHtml(String(contentMDX));
  const slugValue = normalizeSlug(String(slug));
  const cleanedGallery = Array.isArray(gallery)
    ? gallery.map((item) => sanitizeHtml(String(item)).trim()).filter(Boolean)
    : [];
  const cleanedTags = Array.isArray(tags)
    ? tags.map((item) => sanitizeHtml(String(item)).trim()).filter(Boolean)
    : [];

  try {
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@farvater.local" },
      update: {},
      create: {
        email: "admin@farvater.local",
        role: "admin",
        passwordHash: "",
        twoFAEnabled: false,
      },
    });

    const post = await prisma.post.create({
      data: {
        title: cleanedTitle,
        slug: slugValue,
        excerpt: cleanedExcerpt,
        contentMDX: cleanedContent,
        coverImage: coverImage?.trim() || null,
        gallery: JSON.stringify(cleanedGallery),
        tags: JSON.stringify(cleanedTags),
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorId: adminUser.id,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    return NextResponse.json({ success: true, id: post.id, slug: post.slug });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Slug уже используется" }, { status: 409 });
    }
    console.error("Create post failed", error);
    return NextResponse.json({ error: "Не удалось создать пост" }, { status: 500 });
  }
}

export async function GET() {
  try {
    ensureAdmin();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ posts });
}


