import { AdminShell } from "@/components/admin/admin-shell";
import { ModerationActions } from "@/components/admin/moderation-actions";
import { prisma } from "@/lib/prisma";

export default async function AdminForumModerationPage() {
  const pendingComments = await prisma.comment.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      post: { select: { title: true, slug: true } },
      topic: { select: { title: true } },
    },
  });

  return (
    <AdminShell
      heading="Модерация форума"
      description="Проверяйте идеи и комментарии перед публикацией."
    >
      <div className="space-y-4">
        {pendingComments.length === 0 ? (
          <p className="text-sm text-brand-steel">Нет материалов на модерации.</p>
        ) : null}
        {pendingComments.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-brand-steel/40 bg-brand-navy/70 p-5 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading text-lg text-brand-ice">{item.post?.title ?? item.topic?.title ?? "Комментарий"}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-steel">Автор: {item.authorName}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm text-brand-ice/80">{item.contentMD}</p>
            <div className="mt-5">
              <ModerationActions commentId={item.id} initialStatus={item.status} />
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
