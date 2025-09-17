import type { ReactNode } from "react";
import { assertAdminSessionOrRedirect } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await assertAdminSessionOrRedirect();

  return <div className="min-h-screen bg-brand-navy text-brand-ice">{children}</div>;
}
