import Image from "next/image";
import Link from "next/link";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { mainNav, secondaryNav } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-deep/50 bg-brand-navy/90 text-brand-ice">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-4">
            <span className="relative h-14 w-14 overflow-hidden rounded-full border border-brand-sea/60">
              <Image
                src="/brand/compass-logo.jpg"
                alt={SITE_NAME}
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div className="space-y-1">
              <p className="font-heading text-xl">{SITE_NAME}</p>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-sea/80">Сообщество, что ведёт к идеям</p>
            </div>
          </Link>
          <p className="max-w-md text-sm text-brand-ice/80">{SITE_DESCRIPTION}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <nav className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-sea/80">Навигация</p>
            <ul className="space-y-2 text-sm">
              {mainNav
                .filter((item) => !item.hidden)
                .map((item) => (
                  <li key={item.href}>
                    <Link className="hover:text-brand-sea" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          <nav className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-sea/80">Дополнительно</p>
            <ul className="space-y-2 text-sm">
              {secondaryNav
                .filter((item) => !item.hidden)
                .map((item) => (
                  <li key={item.href}>
                    <Link className="hover:text-brand-sea" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-brand-deep/50 py-4 text-center text-xs text-brand-ice/60">
        © {new Date().getFullYear()} {SITE_NAME}. Все права защищены.
      </div>
    </footer>
  );
}
