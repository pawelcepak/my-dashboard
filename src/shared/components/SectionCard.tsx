import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700 px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">{title}</h2>

        {description && <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
