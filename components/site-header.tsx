"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { mainNav } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300",
        scrolled ? "bg-brand-navy/95 border-brand-deep/60 backdrop-blur" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-brand-ice">
          <span className="relative h-12 w-12 overflow-hidden rounded-full border border-brand-sea/50">
            <Image
              src="/brand/compass-logo.jpg"
              alt="Фарватер Team"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-heading text-lg">Фарватер Team</span>
            <span className="text-xs uppercase tracking-[0.3em] text-brand-sea/80">Навигатор креативных людей</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav
            .filter((item) => !item.hidden)
            .map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium uppercase tracking-[0.2em] transition",
                    active ? "text-brand-sea" : "text-brand-ice/80 hover:text-brand-sea"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-sea/60 text-brand-ice transition hover:border-brand-sea hover:text-brand-sea md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Открыть меню"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="px-6 pb-6 md:hidden">
          <div className="space-y-2 rounded-3xl border border-brand-deep/60 bg-brand-navy/95 p-6">
            {mainNav
              .filter((item) => !item.hidden)
              .map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition",
                      active ? "bg-brand-deep text-brand-sea" : "text-brand-ice/80 hover:bg-brand-deep/60 hover:text-brand-sea"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
