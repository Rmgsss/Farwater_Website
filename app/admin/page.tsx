import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [publishedPosts, totalPosts, forumTopics, mediaCount] = await Promise.all([
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count(),
    prisma.topic.count(),
    prisma.media.count(),
  ]);

  const summaryCards = [
    {
      label: "Опубликованные посты",
      value: String(publishedPosts),
      helper: `из ${totalPosts} материалов`,
    },
    {
      label: "Темы форума",
      value: String(forumTopics),
      helper: "активные обсуждения",
    },
    {
      label: "Медиа в библиотеке",
      value: String(mediaCount),
      helper: "фото и иллюстрации",
    },
  ];

  return (
    <AdminShell
      heading="Панель управления"
      description="Следите за публикациями, форумом и медиабиблиотекой Фарватера."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-brand-steel/40 bg-brand-navy/70 p-6 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-brand-steel">{card.label}</p>
            <p className="mt-3 font-heading text-3xl">{card.value}</p>
            <p className="mt-2 text-sm text-brand-ice/80">{card.helper}</p>
          </article>
        ))}
      </section>
      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="rounded-2xl border border-brand-steel/40 bg-brand-navy/70 p-6">
          <h2 className="font-heading text-lg">Быстрые действия</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-ice/80">
            <li>• Создайте новый пост и прикрепите галерею.</li>
            <li>• Проверьте идеи в модерации форума.</li>
            <li>• Обновите медиатеку свежими фото мероприятий.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-brand-steel/40 bg-brand-navy/70 p-6">
          <h2 className="font-heading text-lg">Лента активности</h2>
          <p className="mt-2 text-sm text-brand-ice/80">Интегрируем реальные события после подключения server actions.</p>
        </div>
      </section>
    </AdminShell>
  );
}
