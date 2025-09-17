import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";
import { EditPostForm } from "./edit-form";
import type { Metadata } from "next";

type AdminPostEditPageProps = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Редактирование поста",
};

export default async function AdminPostEditPage({ params }: AdminPostEditPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { id: true, title: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      heading={`Редактирование: ${post.title}`}
      description="Измените контент, обложку и статус публикации."
    >
      <EditPostForm postId={post.id} />
    </AdminShell>
  );
}
