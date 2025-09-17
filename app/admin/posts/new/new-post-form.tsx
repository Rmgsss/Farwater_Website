"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { getCsrfToken } from "@/lib/csrf-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  contentMDX: z.string().min(20),
  coverImage: z.string().optional(),
  gallery: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export function NewPostForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: "draft",
    },
  });

  const status = watch("status");

  const onSubmit = async (values: PostFormValues) => {
    setFeedback(null);
    const payload = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      contentMDX: values.contentMDX,
      coverImage: values.coverImage?.trim() || null,
      gallery: values.gallery
        ? values.gallery
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      tags: values.tags
        ? values.tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      status: values.status,
      publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
    };

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.error ?? "Не удалось создать пост");
      return;
    }

    const data = await response.json();
    reset();
    router.replace(`/admin/posts/${data.id}/edit`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-brand-steel/40 bg-brand-navy/70 p-6 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="title">
              Заголовок
            </label>
            <input
              id="title"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="Например, Фестиваль городской культуры"
              {...register("title")}
            />
            {errors.title ? (
              <p className="mt-1 text-xs text-red-300">{errors.title.message}</p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="festival-gorodskoy-kultury"
              {...register("slug")}
            />
            {errors.slug ? (
              <p className="mt-1 text-xs text-red-300">{errors.slug.message}</p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="excerpt">
              Краткое описание
            </label>
            <textarea
              id="excerpt"
              className="mt-1 min-h-[120px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="Пара предложений для превью"
              {...register("excerpt")}
            />
            {errors.excerpt ? (
              <p className="mt-1 text-xs text-red-300">{errors.excerpt.message}</p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="contentMDX">
              Контент (MDX)
            </label>
            <textarea
              id="contentMDX"
              className="mt-1 min-h-[240px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="# Заголовок\nТекст поста..."
              {...register("contentMDX")}
            />
            {errors.contentMDX ? (
              <p className="mt-1 text-xs text-red-300">{errors.contentMDX.message}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="coverImage">
              Обложка
            </label>
            <input
              id="coverImage"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="/images/gallery/welcome.jpg"
              {...register("coverImage")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="gallery">
              Галерея (через запятую)
            </label>
            <textarea
              id="gallery"
              className="mt-1 min-h-[80px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="/images/gallery/..."
              {...register("gallery")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="tags">
              Теги (через запятую)
            </label>
            <input
              id="tags"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              placeholder="сообщество, события"
              {...register("tags")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="status">
              Статус
            </label>
            <select
              id="status"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              {...register("status")}
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </div>
          {status === "published" ? (
            <div>
              <label className="text-sm font-medium" htmlFor="publishedAt">
                Дата публикации (ISO)
              </label>
              <input
                id="publishedAt"
                className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
                placeholder="2025-09-01T10:00"
                {...register("publishedAt")}
              />
            </div>
          ) : null}
        </div>
      </div>
      {feedback ? <p className="text-sm text-red-300">{feedback}</p> : null}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="button--ghost inline-flex h-11 items-center justify-center rounded-xl px-5"
        >
          Очистить
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-sea px-6 font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
        >
          {isSubmitting ? "Сохраняем..." : "Опубликовать"}
        </button>
      </div>
    </form>
  );
}


