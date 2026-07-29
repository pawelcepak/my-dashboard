import { ArrowDownRight, BanknoteArrowDown, HandCoins, Landmark } from 'lucide-react';
import type { DebtsSummary as Summary } from '@/modules/debts/types/debt.types';
import { formatCurrencyPln } from '@/modules/debts/utils/debtCalculations';

type Props = { summary: Summary };
function Metric({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: typeof HandCoins;
  accent?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border p-4 ${accent ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]' : 'border-zinc-700 bg-zinc-900/55'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {label}
          </p>
          <p
            className={`mt-1.5 text-lg font-bold ${accent ? 'text-[var(--app-accent)]' : 'text-zinc-100'}`}
          >
            {value}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/40 text-zinc-500">
          <Icon className="size-4" />
        </div>
      </div>
    </article>
  );
}
export default function DebtsSummary({ summary }: Props) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric
        label="Aktualne zadłużenie"
        value={formatCurrencyPln(summary.currentTotal)}
        icon={HandCoins}
        accent
      />
      <Metric
        label="Zadłużenie początkowe"
        value={formatCurrencyPln(summary.initialTotal)}
        icon={Landmark}
      />
      <Metric
        label="Wpłacono łącznie"
        value={formatCurrencyPln(summary.totalPayments)}
        icon={BanknoteArrowDown}
      />
      <Metric
        label="Zmniejszenie netto"
        value={formatCurrencyPln(summary.netReduction)}
        icon={ArrowDownRight}
      />
    </section>
  );
}
