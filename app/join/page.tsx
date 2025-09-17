import { JoinForms } from "@/components/forms/join-forms";

export const metadata = {
  title: "Присоединиться",
  description:
    "Форма для волонтёров, инициатив и контактов с командой Фарватер Team.",
};

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10 space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-steel">
          Фарватер Team
        </p>
        <h1 className="font-heading text-4xl text-brand-ice">
          Присоединяйтесь к команде и идеям
        </h1>
        <p className="mx-auto max-w-2xl text-brand-ice/80">
          Волонтёры, авторы и партнёры — оставьте заявку, и мы ответим с деталями по участию, поддержке и сотрудничеству.
        </p>
      </header>
      <JoinForms />
    </div>
  );
}
