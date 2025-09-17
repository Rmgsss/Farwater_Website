import Link from "next/link";
import { Mail, Send, Users, Youtube } from "lucide-react";

const socials = [
  { label: "Telegram", href: "https://t.me/farwater8", icon: Send },
  { label: "VK", href: "#", icon: Users },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "Email", href: "mailto:hello@farvater.example", icon: Mail },
];

const mission = "Объединяем людей через творчество, вдохновляем на смелые идеи и превращаем встречи в истории.";
const values = ["Сообщество", "Креатив", "Ответственность", "Открытость", "Радость от дел"];
const symbolism = "Компас и фарватер — наш ориентир и безопасный путь среди штормов и мель.";

export const metadata = {
  title: "О нас",
  description: "Фарватер Team объединяет творческое сообщество Владивостока и поддерживает смелые идеи.",
};

export default function AboutPage() {
  return (
    <main className="bg-brand-navy text-brand-ice">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-heading text-4xl">О нас</h1>
        <p className="mt-4 text-lg text-brand-ice/90">{mission}</p>
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="font-heading text-2xl">Ценности</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {values.map((value) => (
                <li
                  key={value}
                  className="rounded-xl border border-brand-sea/30 bg-brand-navy/60 px-4 py-3 text-brand-ice/90"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl">Символика</h2>
            <p className="mt-3 text-brand-ice/90">{symbolism}</p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="font-heading text-2xl">Присоединяйтесь к нам</h2>
          <p className="mt-3 text-brand-ice/80">
            Мы всегда рады новым знакомствам. Выбирайте удобный канал связи — телеграм, VK, YouTube или почту.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center justify-between rounded-2xl border border-brand-sea/40 bg-brand-navy/70 px-6 py-6 text-left transition hover:border-brand-deep hover:bg-brand-deep/30"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-sea/90">Сообщество</p>
                  <p className="mt-2 font-heading text-xl text-brand-ice">{label}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-sea/20 text-brand-sea transition group-hover:bg-brand-sea group-hover:text-brand-navy">
                  <Icon className="h-6 w-6" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

