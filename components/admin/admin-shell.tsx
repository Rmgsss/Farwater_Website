import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { adminNav } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { AdminLogoutButton } from "./logout-button";

export type AdminShellProps = {
  heading: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminShell({
  heading,
  description,
  actions,
  children,
  className,
}: AdminShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-brand-navy text-brand-ice lg:grid-cols-[240px_1fr]">
      <aside className="hidden flex-col border-brand-steel/40 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-brand-steel/40 px-6">
          <Image
            src="/brand/compass-logo.jpg"
            alt="Логотип Фарватер"
            width={40}
            height={40}
            className="rounded-full border border-brand-sea/40"
          />
          <span className="font-heading text-lg tracking-wide">Фарватер · Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6 text-sm">
          {adminNav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="flex flex-col gap-3 border-b border-brand-steel/40 bg-brand-navy/80 px-6 py-6 backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl leading-tight">{heading}</h1>
              {description ? (
                <p className="max-w-2xl text-sm text-brand-steel">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <AdminLogoutButton />
            </div>
          </div>
        </header>
        <main className={cn("flex-1 bg-brand-navy/60 px-6 py-8", className)}>{children}</main>
      </div>
    </div>
  );
}

type NavLinkProps = {
  href: string;
  label: string;
};

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 font-medium transition-colors hover:bg-brand-sea/10 hover:text-brand-sea"
    >
      {label}
    </Link>
  );
}

