"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { getCsrfToken } from "@/lib/csrf-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(6, "Введите пароль"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
      body: JSON.stringify({ password: values.password }),
    });

    if (response.ok) {
      router.replace("/admin");
      return;
    }

    const payload = await response.json().catch(() => ({ error: "Ошибка авторизации" }));
    setErrorMessage(payload.error ?? "Ошибка авторизации");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-brand-navy/95 px-6 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-brand-steel/30 bg-brand-navy/80 p-8 shadow-[0_0_0_1px_rgba(112,162,184,0.25)]">
        <div className="mb-6 text-center">
          <p className="font-heading text-2xl text-brand-ice">Фарватер · Admin</p>
          <p className="mt-2 text-sm text-brand-steel">Вход для редакторов и команды модерации.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11 w-full rounded-xl border border-brand-steel/50 bg-brand-navy/40 px-3 text-sm text-brand-ice placeholder:text-brand-steel focus:border-brand-sea focus:outline-none"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-red-300">{errors.password.message}</p>
            ) : null}
          </div>
          {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-sea font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
          >
            {isSubmitting ? "Входим..." : "Войти"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-brand-steel">
          Нужен доступ? Напишите <Link href="mailto:hello@farvater.example" className="text-brand-sea">команде</Link>.
        </p>
      </div>
    </div>
  );
}

