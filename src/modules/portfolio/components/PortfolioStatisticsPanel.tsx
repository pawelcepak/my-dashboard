import { CalendarDays, ReceiptText, TrendingUp } from 'lucide-react';

import type {
  PortfolioSummary,
  PortfolioTag,
  PortfolioTransaction,
} from '@/modules/portfolio/types/portfolio.types';
import { formatCurrencyPln } from '@/modules/portfolio/utils/portfolioCalculations';

type PortfolioStatisticsPanelProps = {
  summary: PortfolioSummary;
  transactions: PortfolioTransaction[];
  tags: PortfolioTag[];
};

export default function PortfolioStatisticsPanel({
  summary,
  transactions,
  tags,
}: PortfolioStatisticsPanelProps) {
  const tagsById = new Map(tags.map((tag) => [tag.id, tag.name]));

  const categoryTotals = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== 'expense') {
      continue;
    }

    const label = transaction.tagId ? (tagsById.get(transaction.tagId) ?? 'Bez tagu') : 'Bez tagu';

    categoryTotals.set(label, (categoryTotals.get(label) ?? 0) + transaction.amount);
  }

  const categories = [...categoryTotals.entries()]
    .map(([name, value]) => ({
      name,
      value,
      percentage: summary.totalExpenses > 0 ? (value / summary.totalExpenses) * 100 : 0,
    }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 8);

  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Statystyki Portfela</h2>

        <p className="mt-0.5 text-xs text-zinc-500">
          Bieżący miesiąc i rozkład wydatków według tagów
        </p>
      </div>

      <div className="grid gap-3 p-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
          <article className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3">
            <CalendarDays className="size-4 text-emerald-400" />
            <p className="mt-2 text-[10px] uppercase tracking-wide text-zinc-500">
              Przychody miesiąca
            </p>
            <p className="mt-1 text-base font-bold text-emerald-400">
              {formatCurrencyPln(summary.currentMonthIncome)}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3">
            <ReceiptText className="size-4 text-red-400" />
            <p className="mt-2 text-[10px] uppercase tracking-wide text-zinc-500">
              Wydatki miesiąca
            </p>
            <p className="mt-1 text-base font-bold text-red-400">
              {formatCurrencyPln(summary.currentMonthExpenses)}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3">
            <TrendingUp className="size-4 text-[var(--app-accent)]" />
            <p className="mt-2 text-[10px] uppercase tracking-wide text-zinc-500">
              Średnio / dzień wydatkowy
            </p>
            <p className="mt-1 text-base font-bold text-zinc-100">
              {formatCurrencyPln(summary.averageDailyExpense)}
            </p>
          </article>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3">
          <h3 className="text-xs font-semibold text-zinc-300">Największe kategorie wydatków</h3>

          {categories.length === 0 ? (
            <p className="mt-6 text-center text-xs text-zinc-500">Brak wydatków do analizy.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="grid grid-cols-[minmax(6rem,0.8fr)_minmax(8rem,1.2fr)_6rem] items-center gap-2"
                >
                  <span className="truncate text-[11px] font-medium text-zinc-400">
                    {category.name}
                  </span>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-[var(--app-accent)]"
                      style={{
                        width: `${Math.max(2, category.percentage)}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-[10px] font-semibold text-zinc-500">
                    {category.percentage.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
