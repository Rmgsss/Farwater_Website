"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCsrfToken } from "@/lib/csrf-client";
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

type EditPostFormProps = {
  postId: string;
};

type FeedbackState = {
  message: string;
  tone: "error" | "success";
};

export function EditPostForm({ postId }: EditPostFormProps) {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      contentMDX: "",
      coverImage: "",
      gallery: "",
      tags: "",
      status: "draft",
      publishedAt: "",
    },
  });

  const status = watch("status");

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/admin/posts/${postId}`);
      if (!response.ok) {
        setFeedback({ message: "Не удалось загрузить пост", tone: "error" });
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      const post = data.post;
      reset({
        title: post.title ?? "",
        slug: post.slug ?? "",
        excerpt: post.excerpt ?? "",
        contentMDX: post.contentMDX ?? "",
        coverImage: post.coverImage ?? "",
        gallery: Array.isArray(post.gallery) ? post.gallery.join(", ") : "",
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
        status: post.status ?? "draft",
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
      });
      setIsLoading(false);
    };

    loadPost();
  }, [postId, reset]);

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

    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback({ message: data.error ?? "Не удалось обновить пост", tone: "error" });
      return;
    }

    setFeedback({ message: "Сохранено", tone: "success" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-brand-steel/40 bg-brand-navy/70 p-6 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-brand-steel">ID поста: {postId}</p>
      {isLoading ? <p className="text-sm text-brand-steel">Загружаем данные…</p> : null}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="title">
              Заголовок
            </label>
            <input
              id="title"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
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
              {...register("slug")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="excerpt">
              Краткое описание
            </label>
            <textarea
              id="excerpt"
              className="mt-1 min-h-[120px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              {...register("excerpt")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="contentMDX">
              Контент (MDX)
            </label>
            <textarea
              id="contentMDX"
              className="mt-1 min-h-[240px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              {...register("contentMDX")}
            />
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
              {...register("coverImage")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="gallery">
              Галерея
            </label>
            <textarea
              id="gallery"
              className="mt-1 min-h-[80px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              {...register("gallery")}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="tags">
              Теги
            </label>
            <input
              id="tags"
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
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
          <div>
            <label className="text-sm font-medium" htmlFor="publishedAt">
              Дата публикации
            </label>
            <input
              id="publishedAt"
              type={status === "published" ? "datetime-local" : "text"}
              className="mt-1 h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
              {...register("publishedAt")}
            />
          </div>
        </div>
      </div>
      {feedback ? (
        <p className={`text-sm ${feedback.tone === "success" ? "text-brand-sea" : "text-red-300"}`}>
          {feedback.message}
        </p>
      ) : null}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="button--ghost inline-flex h-11 items-center justify-center rounded-xl px-5"
        >
          Назад
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="button--ghost inline-flex h-11 items-center justify-center rounded-xl px-5"
          >
            Сбросить
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-sea px-6 font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
          >
            {isSubmitting ? "Сохраняем..." : "Обновить"}
          </button>
        </div>
      </div>
    </form>
  );
}