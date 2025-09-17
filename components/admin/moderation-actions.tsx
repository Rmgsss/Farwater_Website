"use client";

import { getCsrfToken } from "@/lib/csrf-client";
import { useState } from "react";

type ModerationActionsProps = {
  commentId: string;
  initialStatus: string;
};

export function ModerationActions({ commentId, initialStatus }: ModerationActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateStatus = async (nextStatus: string) => {
    setIsBusy(true);
    setMessage(null);
    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
      body: JSON.stringify({ status: nextStatus }),
    });
    setIsBusy(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error ?? "Ошибка");
      return;
    }

    setStatus(nextStatus);
    setMessage("Готово");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => updateStatus("approved")}
        disabled={isBusy}
        className="inline-flex items-center rounded-xl border border-brand-sea/50 px-4 py-2 text-sm text-brand-sea transition hover:bg-brand-sea/10 disabled:opacity-50"
      >
        Одобрить
      </button>
      <button
        type="button"
        onClick={() => updateStatus("rejected")}
        disabled={isBusy}
        className="inline-flex items-center rounded-xl border border-red-400/60 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
      >
        Отклонить
      </button>
      {message ? (
        <span className={`text-sm ${message === "Готово" ? "text-brand-sea" : "text-red-300"}`}>{message}</span>
      ) : (
        <span className="text-xs uppercase tracking-[0.3em] text-brand-steel">{status}</span>
      )}
    </div>
  );
}
