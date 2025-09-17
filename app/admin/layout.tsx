import type { ReactNode } from "react";
import { assertAdminSessionOrRedirect } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  assertAdminSessionOrRedirect();

  return <div className="min-h-screen bg-brand-navy text-brand-ice">{children}</div>;
}
