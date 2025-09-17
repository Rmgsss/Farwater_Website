"use client";

import { getCsrfToken } from "@/lib/csrf-client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function MediaUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setStatus("Выберите файл");
      return;
    }

    setIsUploading(true);
    setStatus(null);

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      headers: { "X-CSRF-Token": getCsrfToken() },
      body: formData,
    });

    setIsUploading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus(data.error ?? "Не удалось загрузить файл");
      return;
    }

    setStatus("Готово");
    formRef.current?.reset();
    router.refresh();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-brand-steel/40 bg-brand-navy/60 p-4"
    >
      <label className="text-sm font-medium text-brand-ice" htmlFor="file">
        Загрузить новое изображение
      </label>
      <input
        id="file"
        name="file"
        type="file"
        accept="image/*"
        className="text-sm text-brand-ice"
      />
      <input
        name="alt"
        type="text"
        placeholder="Alt-текст"
        className="h-10 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
      />
      <button
        type="submit"
        disabled={isUploading}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-sea px-4 text-sm font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
      >
        {isUploading ? "Загружаем..." : "Загрузить"}
      </button>
      {status ? (
        <p className={`text-sm ${status === "Готово" ? "text-brand-sea" : "text-red-300"}`}>{status}</p>
      ) : null}
    </form>
  );
}
