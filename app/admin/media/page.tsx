import { AdminShell } from "@/components/admin/admin-shell";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { prisma } from "@/lib/prisma";

export default async function AdminMediaPage() {
  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <AdminShell
      heading="Медиабиблиотека"
      description="Управляйте изображениями и файлами для постов, галерей и баннеров."
    >
      <MediaUploadForm />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mediaItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-brand-steel/40 bg-brand-navy/70 shadow-[0_0_0_1px_rgba(112,162,184,0.12)]"
          >
            <div
              className="h-40 w-full bg-brand-steel/20"
              style={{
                backgroundImage: `url(${item.path})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="space-y-1 px-4 py-3 text-sm">
              <p className="font-medium text-brand-ice">{item.alt ?? "Без описания"}</p>
              <p className="text-xs text-brand-steel">{item.path}</p>
              <p className="text-xs text-brand-steel">{item.type}</p>
            </div>
          </article>
        ))}
        {mediaItems.length === 0 ? (
          <p className="text-sm text-brand-steel">Пока нет загруженных файлов.</p>
        ) : null}
      </div>
    </AdminShell>
  );
}
