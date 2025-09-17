import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import argon2 from "argon2";
const prisma = new PrismaClient();

const now = Date.now();

  .createHash("sha256")
  .update("changeme-admin")

const basePosts = [
  {
    slug: "nasha-cel",
    title: "Наша цель",
    excerpt:
      "Фарватер Team объединяет людей вокруг творчества, даёт пространство для смелых идей и превращает встречи в истории.",
    contentMDX: `Приветствуем вас, дорогие друзья!

Мы рады представить команду «Фарватер», где мы зажигаем события для молодёжи! ??

**Наш курс:**

- вдохновлять на смелые идеи и помогать им воплощаться;
- объединять людей, которые любят творчество и городские приключения;
- создавать безопасное пространство, в котором каждый голос слышен;
- собирать истории, которые делают Владивосток ярче.

Следите за обновлениями: впереди фестивали, встречи и городские проекты, которые мы готовим вместе с вами.
`,
    coverImage: "/images/gallery/welcome.jpg",
    gallery: JSON.stringify(["/images/gallery/welcome.jpg"]),
    tags: JSON.stringify(["миссия", "сообщество"]),
    status: "published",
    publishedAt: new Date("2025-09-01T09:00:00Z"),
  },
  {
    slug: "s-dnyom-rossii",
    title: "С Днём России",
    excerpt:
      "Поздравляем со Днём России и делимся идеями, как провести праздник в нашем городе.",
    contentMDX: `Сегодня отмечаем главный праздник страны — День России.

Мы собрали несколько идей, как провести этот день вместе:

1. Прогуляйтесь по набережной и загляните в локальные арт-пространства — поддержите творцов города.
2. Поделитесь историей о своих любимых местах во Владивостоке в нашем форуме: так мы собираем карту тёплых воспоминаний.
3. Загляните в архив фестивалей Фарватера — вдохновляйтесь и планируйте новую встречу.

Пусть этот день наполнится ощущением дома, заботы и уверенности в будущем. С праздником!
`,
    coverImage: "/images/backgrounds/ECOquiz-bg-2a.png",
    gallery: JSON.stringify([
      "/images/gallery/vladivostok1.jpg",
      "/images/gallery/vladivostok2.jpg",
    ]),
    tags: JSON.stringify(["праздники", "вдохновение"]),
    status: "published",
    publishedAt: new Date("2025-06-12T06:00:00Z"),
  },
  {
    slug: "s-dnyom-goroda-vladivostok-165-let",
    title: "С Днём города Владивосток! 165 лет",
    excerpt:
      "Владивостоку — 165! Вспоминаем истории города и делимся, что вдохновляет нас создавать новые проекты.",
    contentMDX: `Владивостоку исполняется 165 лет — любимому городу, который формирует наш характер и вдохновляет на эксперименты.

### Что делает празднование особенным

- **Люди.** Волонтёры, артисты, кураторы, которые год за годом создают пространство для встреч и диалогов.
- **Места.** От Старого маяка до Зари — каждый уголок города становится площадкой для творчества.
- **Истории.** Вместе мы превращаем инициативы в проекты, а идеи — в масштабные городские события.

Мы благодарим всех, кто помогает «Фарватеру» остаётся частью этого движения. Делитесь в комментариях своими планами на праздничные дни — встретимся на улицах Владивостока!
`,
    coverImage: "/images/gallery/vladivostok-happy-birthday.jpg",
    gallery: JSON.stringify([
      "/images/gallery/vladivostok-happy-birthday.jpg",
      "/images/gallery/vladivostok3.jpg",
    ]),
    tags: JSON.stringify(["владивосток", "события"]),
    status: "published",
    publishedAt: new Date("2025-07-02T12:00:00Z"),
  },
  {
    slug: "spasibo-uchastnikam-meropriyatiya-dlya-volonterov-fkgs",
    title: "Спасибо участникам Мероприятия для волонтёров ФКГС",
    excerpt:
      "Подводим итоги волонтёрского дня ФКГС и благодарим партнёров, которые поддержали событие.",
    contentMDX: `Команда «Фарватер» благодарит всех, кто присоединился к мероприятию для волонтёров ФКГС. Вы показали, как общая энергия превращает идею в действие.

**Отдельное спасибо партнёрам за поддержку пространства и участников:**

- [COLIZEUM](https://t.me/colizeumarena)
- [Автошкола «Вектор»](https://avtoschool-vektor.ru/vladivostok)
- [ГК «Славда»](https://t.me/slenergy_vl)

Мы делились опытом, обсуждали будущие проекты и собирали запросы от сообществ. Делитесь впечатлениями на форуме и присоединяйтесь к следующим встречам — расписание скоро опубликуем.
`,
    coverImage: "/images/gallery/event_photo1.jpg",
    gallery: JSON.stringify([
      "/images/gallery/event_photo1.jpg",
      "/images/gallery/event_photo2.jpg",
      "/images/gallery/event_photo3.jpg",
    ]),
    tags: JSON.stringify(["волонтёры", "партнёры"]),
    status: "published",
    publishedAt: new Date("2025-08-24T08:00:00Z"),
  },
];

const fillerPosts = Array.from({ length: 30 }).map((_, index) => {
  const order = index + 1;
  const published = order % 3 !== 0;
  return {
    slug: `city-notes-${order}`,
    title: `Городские заметки #${order}`,
    excerpt: `Короткие заметки о проектах Фарватера и том, как мы делаем Владивосток ярче. Выпуск ${order}.`,
    contentMDX: `### Заметки недели ${order}

- Обсудили новые идеи для городских квестов.
- Собрали отзывы волонтёров и усиливаем программу наставничества.
- Планируем фотосессию на набережной и запись подкаста о культурных инициативах.

Если у вас есть идеи, поделитесь ими в форуме — мы читаем каждое сообщение!`,
    coverImage: order % 2 === 0 ? "/images/backgrounds/ECOquiz-bg-2b.png" : null,
    gallery: JSON.stringify([
      "/images/gallery/vladivostok1.jpg",
      "/images/gallery/nature" + ((order % 5) + 1) + ".jpg",
    ]),
    tags: JSON.stringify(["еженедельник", order % 2 === 0 ? "проекты" : "вдохновение"]),
    status: published ? "published" : "draft",
    publishedAt: published
      ? new Date(now - order * 86400000)
      : null,
  };
});

const gallerySources = [
  { path: "/images/gallery/event_photo1.jpg", alt: "Волонтёры ФКГС на сцене" },
  { path: "/images/gallery/event_photo2.jpg", alt: "Рабочие сессии в коворкинге" },
  { path: "/images/gallery/event_photo3.jpg", alt: "Обсуждение идей у стенда" },
  { path: "/images/gallery/vladivostok1.jpg", alt: "Морская панорама Владивостока" },
  { path: "/images/gallery/vladivostok2.jpg", alt: "Канатная дорога Владивостока" },
  { path: "/images/gallery/vladivostok3.jpg", alt: "Закат над бухтой Золотой Рог" },
  { path: "/images/gallery/vladivostok-happy-birthday.jpg", alt: "С Днём рождения, Владивосток" },
  { path: "/images/gallery/welcome.jpg", alt: "Добро пожаловать в Фарватер" },
  { path: "/images/gallery/nature1.jpg", alt: "Лесная тропа к морю" },
  { path: "/images/gallery/nature2.jpg", alt: "Камни и волны на побережье" },
  { path: "/images/gallery/nature3.jpg", alt: "Скалы и голубое небо" },
  { path: "/images/gallery/nature4.jpg", alt: "Галька и пена прибоя" },
  { path: "/images/gallery/nature5.jpg", alt: "Закат над сопками" },
];

const GALLERY_TARGET_COUNT = 812;

const gallerySeed = Array.from({ length: GALLERY_TARGET_COUNT }).map((_, index) => {
  const base = gallerySources[index % gallerySources.length];
  const batch = Math.floor(index / gallerySources.length) + 1;
  const alt = batch > 1 ? `${base.alt} — серия ${batch}` : base.alt;
  return {
    path: base.path,
    alt,
    width: null,
    height: null,
    type: "image",
    createdAt: new Date(now - index * 60000),
  };
});

const topics = [
  {
    title: "Идеи для городских квестов",
    bodyMD:
      "Собираем маршруты и загадки для нового сезона городских квестов. Делитесь локациями, историями и скрытыми сокровищами Владивостока!",
    status: "open",
    votes: 24,
    authorName: "Фарватер Team",
  },
  {
    title: "Каких мастер-классов хотите?",
    bodyMD:
      "Планируем расписание мастер-классов на осень. Напишите, каких форматов вам не хватает: музыка, digital, ремёсла или что-то совсем новое?",
    status: "open",
    votes: 17,
    authorName: "Фарватер Team",
  },
];

async function main() {
  await prisma.comment.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.post.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await argon2.hash("changeme-admin", { type: argon2.argon2id, memoryCost: 2 ** 16, timeCost: 3, parallelism: 1 });

  const admin = await prisma.user.create({
    data: {
      email: "admin@farvater.local",
      role: "admin",
      passwordHash: adminPasswordHash,
      twoFAEnabled: false,
    },
  });

  const authorId = admin.id;

  const postPayload = [...basePosts, ...fillerPosts].map((post, index) => ({
    ...post,
    authorId,
    createdAt: new Date(now - (index + 1) * 3600000),
  }));

  await prisma.post.createMany({ data: postPayload });

  await prisma.topic.createMany({
    data: topics.map((topic, index) => ({
      ...topic,
      createdAt: new Date(now - index * 7200000),
    })),
  });

  await prisma.media.createMany({
    data: gallerySeed.map((item) => ({
      ...item,
      uploadedById: authorId,
    })),
  });
}

main()
  .then(() => {
    console.log("Seed data applied successfully.");
  })
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



