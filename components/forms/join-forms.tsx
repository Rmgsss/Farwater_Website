"use client";

import type { ReactNode } from "react";
import { getCsrfToken } from "@/lib/csrf-client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const volunteerSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  contact: z.string().min(3, "Добавьте контакт"),
  message: z.string().min(10, "Расскажите о себе"),
});

const ideaSchema = z.object({
  title: z.string().min(3, "Название обязательно"),
  summary: z.string().min(10, "Опишите идею"),
  needs: z.string().optional(),
  contact: z.string().optional(),
});

const contactSchema = z.object({
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  social: z.string().optional(),
  message: z.string().min(10, "Сообщение не может быть пустым"),
});

type VolunteerValues = z.infer<typeof volunteerSchema>;
type IdeaValues = z.infer<typeof ideaSchema>;
type ContactValues = z.infer<typeof contactSchema>;

type Feedback = {
  type: "success" | "error";
  message: string;
};

export function JoinForms() {
  return (
    <div className="space-y-12">
      <section>
        <header className="mb-4 space-y-2">
          <h2 className="font-heading text-2xl text-brand-ice">Стать волонтёром</h2>
          <p className="text-sm text-brand-ice/80">
            Расскажите о себе, и мы свяжемся с вами перед ближайшими проектами.
          </p>
        </header>
        <VolunteerForm />
      </section>
      <section>
        <header className="mb-4 space-y-2">
          <h2 className="font-heading text-2xl text-brand-ice">Предложить идею</h2>
          <p className="text-sm text-brand-ice/80">
            Делитесь концептом — поможем собрать команду и ресурсы.
          </p>
        </header>
        <IdeaForm />
      </section>
      <section>
        <header className="mb-4 space-y-2">
          <h2 className="font-heading text-2xl text-brand-ice">Связаться с нами</h2>
          <p className="text-sm text-brand-ice/80">
            Напишите, если нужна консультация, партнёрство или медиа-поддержка.
          </p>
        </header>
        <ContactForm />
      </section>
    </div>
  );
}

function VolunteerForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VolunteerValues>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (values: VolunteerValues) => {
    setFeedback(null);
    const response = await fetch("/api/forms/volunteer", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback({ type: "error", message: data.error ?? "Не удалось отправить" });
      return;
    }

    setFeedback({ type: "success", message: "Спасибо! Мы скоро свяжемся." });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-3xl border border-brand-steel/40 bg-brand-navy/70 p-6 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
    >
      <Field label="Имя" error={errors.name?.message}>
        <input
          className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Как к вам обращаться?"
          {...register("name")}
        />
      </Field>
      <Field label="Контакты" error={errors.contact?.message}>
        <input
          className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Телеграм, телефон или email"
          {...register("contact")}
        />
      </Field>
      <Field label="О себе" error={errors.message?.message}>
        <textarea
          className="min-h-[120px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Чем хотите помочь, какие навыки есть?"
          {...register("message")}
        />
      </Field>
      {feedback ? (
        <p className={`text-sm ${feedback.type === "success" ? "text-brand-sea" : "text-red-300"}`}>
          {feedback.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-sea px-6 font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
        >
          {isSubmitting ? "Отправляем..." : "Отправить"}
        </button>
      </div>
    </form>
  );
}

function IdeaForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IdeaValues>({
    resolver: zodResolver(ideaSchema),
  });

  const onSubmit = async (values: IdeaValues) => {
    setFeedback(null);
    const response = await fetch("/api/forms/idea", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback({ type: "error", message: data.error ?? "Не удалось отправить" });
      return;
    }

    setFeedback({ type: "success", message: "Идея пришла! Спасибо." });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-3xl border border-brand-steel/40 bg-brand-navy/70 p-6 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
    >
      <Field label="Название" error={errors.title?.message}>
        <input
          className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Например, Ночной квест по маякам"
          {...register("title")}
        />
      </Field>
      <Field label="Описание" error={errors.summary?.message}>
        <textarea
          className="min-h-[140px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Что будет происходить, для кого и чем вдохновляет?"
          {...register("summary")}
        />
      </Field>
      <Field label="Какие ресурсы нужны?" error={errors.needs?.message}>
        <textarea
          className="min-h-[100px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Оборудование, площадки, партнёры..."
          {...register("needs")}
        />
      </Field>
      <Field label="Контакты" error={errors.contact?.message}>
        <input
          className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Телеграм или email (по желанию)"
          {...register("contact")}
        />
      </Field>
      {feedback ? (
        <p className={`text-sm ${feedback.type === "success" ? "text-brand-sea" : "text-red-300"}`}>
          {feedback.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-sea px-6 font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
        >
          {isSubmitting ? "Отправляем..." : "Предложить"}
        </button>
      </div>
    </form>
  );
}

function ContactForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    setFeedback(null);
    const response = await fetch("/api/forms/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback({ type: "error", message: data.error ?? "Не удалось отправить" });
      return;
    }

    setFeedback({ type: "success", message: "Сообщение отправлено, спасибо!" });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-3xl border border-brand-steel/40 bg-brand-navy/70 p-6 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input
            className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
            placeholder="hello@farvater.example"
            {...register("email")}
          />
        </Field>
        <Field label="Телефон" error={errors.phone?.message}>
          <input
            className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
            placeholder="+7 (999) 000-00-00"
            {...register("phone")}
          />
        </Field>
      </div>
      <Field label="Соцсети или мессенджеры" error={errors.social?.message}>
        <input
          className="h-11 w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="@farvater_team"
          {...register("social")}
        />
      </Field>
      <Field label="Сообщение" error={errors.message?.message}>
        <textarea
          className="min-h-[140px] w-full rounded-xl border border-brand-steel/40 bg-brand-navy/40 px-3 py-2 text-sm text-brand-ice focus:border-brand-sea focus:outline-none"
          placeholder="Опишите запрос"
          {...register("message")}
        />
      </Field>
      {feedback ? (
        <p className={`text-sm ${feedback.type === "success" ? "text-brand-sea" : "text-red-300"}`}>
          {feedback.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-sea px-6 font-semibold text-brand-navy transition hover:bg-brand-sea/90 disabled:opacity-60"
        >
          {isSubmitting ? "Отправляем..." : "Отправить"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="text-sm">
      <label className="mb-2 inline-block font-medium text-brand-ice">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}




