export type NavItem = {
  label: string;
  href: string;
  hidden?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Посты", href: "/posts" },
  { label: "Галерея", href: "/gallery" },
  { label: "Форум", href: "/forum" },
  { label: "Присоединиться", href: "/join" },
];

export const secondaryNav: NavItem[] = [
  { label: "Мероприятия", href: "/events", hidden: true },
  { label: "Партнёры", href: "/partners", hidden: true },
  { label: "Приватность", href: "/privacy" },
  { label: "Условия", href: "/terms" },
];

export const adminNav: NavItem[] = [
  { label: "Обзор", href: "/admin" },
  { label: "Новый пост", href: "/admin/posts/new" },
  { label: "Редактор", href: "/admin/posts" },
  { label: "Медиа", href: "/admin/media" },
  { label: "Модерация форума", href: "/admin/forum/moderation" },
];
