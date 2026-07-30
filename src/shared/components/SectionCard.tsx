import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700/80 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        {description && <p className="mt-0.5 text-xs leading-5 text-zinc-500">{description}</p>}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
