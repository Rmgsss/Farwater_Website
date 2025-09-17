import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { sanitizeHtml } from "@/lib/sanitize";

type RouteContext = {
  params: { id: string };
};

function ensureAdmin() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    throw new Error("UNAUTHORIZED");
  }
}

function normalizeSlug(input: string) {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `post-${randomUUID()}`;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    ensureAdmin();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: context.params.id },
  });

  if (!post) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  return NextResponse.json({
    post: {
      ...post,
      gallery: JSON.parse(post.gallery ?? "[]"),
      tags: JSON.parse(post.tags ?? "[]"),
    },
  });
}

export async function PUT(request: Request, context: RouteContext) {
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
    const updated = await prisma.post.update({
      where: { id: context.params.id },
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
      },
      select: {
        id: true,
        slug: true,
      },
    });

    return NextResponse.json({ success: true, id: updated.id, slug: updated.slug });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Slug уже используется" }, { status: 409 });
    }
    console.error("Update post failed", error);
    return NextResponse.json({ error: "Не удалось обновить пост" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    ensureAdmin();
    assertCsrf(request);
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403;
    return NextResponse.json({ error: status === 401 ? "Unauthorized" : "CSRF token неверен" }, { status });
  }

  await prisma.post.delete({ where: { id: context.params.id } }).catch(() => null);
  return NextResponse.json({ success: true });
}
