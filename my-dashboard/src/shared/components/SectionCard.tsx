import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-zinc-100">{title}</h2>

        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
