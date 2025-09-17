import { AdminShell } from "@/components/admin/admin-shell";
import { NewPostForm } from "./new-post-form";

export default function AdminPostCreatePage() {
  return (
    <AdminShell
      heading="Новая публикация"
      description="Добавьте контент, обложку и галерею для поста перед публикацией."
    >
      <NewPostForm />
    </AdminShell>
  );
}
