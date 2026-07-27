import { ArrowDownRight, ArrowUpRight, Scale, WalletCards } from 'lucide-react';

import type { PortfolioSummary as PortfolioSummaryValue } from '@/modules/portfolio/types/portfolio.types';
import { formatCurrencyPln } from '@/modules/portfolio/utils/portfolioCalculations';

type PortfolioSummaryProps = {
  summary: PortfolioSummaryValue;
};

type MetricProps = {
  label: string;
  value: number;
  icon: typeof WalletCards;
  valueClassName?: string;
  accent?: boolean;
};

function Metric({
  label,
  value,
  icon: Icon,
  valueClassName = 'text-zinc-100',
  accent = false,
}: MetricProps) {
  return (
    <article
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
          : 'border-zinc-700 bg-zinc-950/45'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {label}
          </p>

          <p className={`mt-1.5 text-lg font-bold tracking-tight ${valueClassName}`}>
            {formatCurrencyPln(value)}
          </p>
        </div>

        <div
          className={`flex size-9 items-center justify-center rounded-lg border ${
            accent
              ? 'border-[var(--app-accent-border)] bg-zinc-950/30 text-[var(--app-accent)]'
              : 'border-zinc-700 bg-zinc-900 text-zinc-500'
          }`}
        >
          <Icon aria-hidden="true" className="size-4" />
        </div>
      </div>
    </article>
  );
}

export default function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric
        label="Aktualne saldo"
        value={summary.currentBalance}
        icon={WalletCards}
        valueClassName="text-[var(--app-accent)]"
        accent
      />

      <Metric
        label="Przychody łącznie"
        value={summary.totalIncome}
        icon={ArrowUpRight}
        valueClassName="text-emerald-400"
      />

      <Metric
        label="Wydatki łącznie"
        value={summary.totalExpenses}
        icon={ArrowDownRight}
        valueClassName="text-red-400"
      />

      <Metric
        label="Bilans przepływów"
        value={summary.netFlow}
        icon={Scale}
        valueClassName={summary.netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}
      />
    </section>
  );
}
