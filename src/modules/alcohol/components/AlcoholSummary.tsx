import { Beer, CalendarDays, CircleDollarSign, Pause } from 'lucide-react';

import type { AlcoholOverview } from '@/modules/alcohol/types/alcohol.types';
import { formatCurrencyPln } from '@/modules/portfolio/utils/portfolioCalculations';

type AlcoholSummaryProps = {
  overview: AlcoholOverview;
};

export default function AlcoholSummary({ overview }: AlcoholSummaryProps) {
  const cards = [
    {
      label: 'Dni picia',
      value: String(overview.totalDrinkingDays),
      icon: CalendarDays,
    },
    {
      label: 'Piwa z Work',
      value: String(overview.totalBeers),
      icon: Beer,
    },
    {
      label: 'Wydatki łącznie',
      value: formatCurrencyPln(overview.totalExpense),
      icon: CircleDollarSign,
    },
    {
      label: 'Najdłuższa przerwa',
      value: `${overview.longestBreak} dni`,
      icon: Pause,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <article key={label} className="rounded-xl border border-zinc-700 bg-zinc-900/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {label}
              </p>
              <p className="mt-1.5 text-lg font-bold text-zinc-100">{value}</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
              <Icon className="size-4" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
