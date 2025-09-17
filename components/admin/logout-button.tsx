"use client";

import { getCsrfToken } from "@/lib/csrf-client";

export function AdminLogoutButton() {
  const onLogout = async () => {
    await fetch("/api/admin/login", {
      method: "DELETE",
      headers: { "X-CSRF-Token": getCsrfToken() },
    });
    window.location.href = "/admin/login";
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex h-9 items-center justify-center rounded-xl border border-brand-sea/50 px-4 text-sm font-semibold text-brand-sea transition hover:bg-brand-sea/10"
    >
      Выйти
    </button>
  );
}
