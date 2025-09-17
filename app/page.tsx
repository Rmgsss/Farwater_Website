import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  HeartHandshake,
  Megaphone,
  MessageCircle,
  Palette,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    title: "Мероприятия и квесты",
    description:
      "Офлайн-встречи, городские приключения и арт-форматы. Мы объединяем людей вокруг смелых идей и любимых вселенных.",
    icon: CalendarCheck,
    href: "#events",
    cta: "Смотреть афишу",
  },
  {
    title: "Медиа и истории",
    description:
      "Рассказываем о героях Владивостока, делимся фото с мероприятий и подсвечиваем новые инициативы сообщества.",
    icon: Megaphone,
    href: "/posts",
    cta: "Читать посты",
  },
  {
    title: "Форум и комьюнити",
    description:
      "Пространство для общения, быстрых советов и совместных проектов. Тут рождаются идеи будущих событий.",
    icon: MessageCircle,
    href: "/forum",
    cta: "Войти в форум",
  },
];

const events = [
  {
    title: "Urban Sketch Meet",
    date: "27 июля, суббота",
    location: "Центр Владивостока",
    description:
      "Выходим на пленэр с художниками и фотографами — делимся материалами, техникой и вдохновением прямо на улицах города.",
    status: "Регистрация открыта",
  },
  {
    title: "Игровой квиз по аниме",
    date: "8 августа, четверг",
    location: "Городская медиатека",
    description:
      "Командный баттл по любимым сериалам, манге и OST. Призы, живая музыка и тематическая фотозона.",
    status: "Скоро анонс",
  },
  {
    title: "Лекторий «Город будущего»",
    date: "23 августа, пятница",
    location: "Пространство «Корабль»",
    description:
      "Архитекторы, художники и урбанисты обсуждают сценарии развития Владивостока и совместные проекты с жителями.",
    status: "Ищем спикеров",
  },
];

const community = [
  {
    title: "Волонтёры и организаторы",
    description:
      "Нам нужны руки, головы и сердца для мероприятий, медиа и форума. Заполняйте форму и расскажите о себе.",
    href: "/join",
    action: "Стать частью команды",
    icon: HeartHandshake,
  },
  {
    title: "Партнёры и проекты",
    description:
      "Ищем бренды, пространства и образовательные команды, которые разделяют любовь к креативу и городу.",
    href: "mailto:hello@farvater.example",
    action: "Написать нам",
    icon: Sparkles,
  },
  {
    title: "Творческие резиденты",
    description:
      "Художники, музыканты, писатели, геймдизайнеры — покажите свои работы и расскажите, как можем помочь.",
    href: "#",
    action: "Поддержать инициативу",
    icon: Palette,
  },
];

const stats = [
  { value: "150+", label: "участников в чатах и на офлайне" },
  { value: "20", label: "организованных событий за сезон" },
  { value: "12", label: "партнёров и площадок по всему городу" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/ECOquiz-bg-2a.png"
            alt="Команда Фарватер Team на мероприятии"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/95 via-brand-navy/80 to-brand-deep/80" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-20 text-center md:pt-32 md:text-left">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-sea/80">Фарватер Team</p>
          <h1 className="text-balance font-heading text-4xl leading-tight text-brand-ice sm:text-5xl lg:text-6xl">
            Делаем город ярче! 🎨 События, гик-культура, креатив тусовки — всё здесь, в Фарватер 𝕋𝕖𝕒𝕞
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-brand-ice/80 md:mx-0">
            Мы объединяем жителей Владивостока и Дальнего Востока, чтобы вместе запускать арт-проекты, фестивали,
            образовательные программы и добрые инициативы. Подписывайтесь на обновления и присоединяйтесь к движению.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
            <Link
              href="/join"
              className="rounded-full bg-brand-sea px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-navy shadow-lg shadow-brand-deep/40 transition hover:bg-brand-ice"
            >
              Присоединиться
            </Link>
            <Link
              href="#support"
              className="button--ghost rounded-full px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.25em]"
            >
              Поддержать
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6" id="support">
        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon, href, cta }) => (
            <div
              key={title}
              className="group flex flex-col justify-between rounded-3xl border border-brand-deep/50 bg-brand-navy/80 p-8 transition hover:border-brand-sea/70 hover:bg-brand-deep/40"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-sea/20 text-brand-sea">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="font-heading text-2xl">{title}</h2>
              </div>
              <p className="mt-6 text-sm text-brand-ice/80">{description}</p>
              <Link
                href={href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-sea transition group-hover:text-brand-ice"
              >
                {cta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate bg-brand-deep/20 py-20" id="events">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-navy/80 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-sea/80">Что на горизонте</p>
              <h2 className="font-heading text-3xl text-brand-ice">Ближайшие события</h2>
            </div>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-full border border-brand-sea/60 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-sea transition hover:border-brand-sea hover:text-brand-ice"
            >
              Хочу помочь
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {events.map(({ title, date, location, description, status }) => (
              <article
                key={title}
                className="flex h-full flex-col justify-between rounded-3xl border border-brand-deep/50 bg-brand-navy/80 p-8"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand-sea/70">{date}</p>
                  <h3 className="mt-3 font-heading text-2xl text-brand-ice">{title}</h3>
                  <p className="mt-2 text-sm text-brand-ice/70">{location}</p>
                  <p className="mt-4 text-sm text-brand-ice/80">{description}</p>
                </div>
                <span className="mt-6 inline-flex w-fit rounded-full bg-brand-sea/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-sea">
                  {status}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-sea/80">Комьюнити</p>
            <h2 className="font-heading text-3xl text-brand-ice">Каждый может повлиять на маршрут</h2>
            <p className="text-base text-brand-ice/80">
              Мы верим в силу коллективного творчества. Делитесь предложениями, проводите собственные активности и помогайте
              делать город дружелюбнее — мы поддержим ресурсами, людьми и опытом. Начните с простого шага.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-brand-deep/50 bg-brand-navy/70 p-6">
                  <p className="font-heading text-3xl text-brand-sea">{item.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-brand-ice/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {community.map(({ title, description, href, action, icon: Icon }) => (
              <div
                key={title}
                className="group flex flex-col gap-4 rounded-3xl border border-brand-deep/50 bg-brand-navy/80 p-6 transition hover:border-brand-sea/70 hover:bg-brand-deep/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-sea/20 text-brand-sea">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-heading text-xl text-brand-ice">{title}</h3>
                </div>
                <p className="text-sm text-brand-ice/80">{description}</p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-sea transition group-hover:text-brand-ice"
                >
                  {action}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
