import { CircleDollarSign } from 'lucide-react';

import type { FinancialPlanItem, WorkWeekSummary } from '@/modules/work/types/work.types';
import { formatCurrencyEur, formatCurrencyPln } from '@/modules/work/utils/workCalculations';

type FinancialPlanSummaryProps = {
  items: FinancialPlanItem[];
  summary: WorkWeekSummary;
  exchangeRateEurPln: number;
};

export default function FinancialPlanSummary({
  items,
  summary,
  exchangeRateEurPln,
}: FinancialPlanSummaryProps) {
  const hasSurplus = summary.financialPlanBalancePln >= 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Plan finansowy</h2>

          <p className="mt-1 text-sm text-zinc-500">Podział zarobku netto z bieżącego tygodnia</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400">
          <CircleDollarSign aria-hidden="true" className="size-5" />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <dl className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-400">{item.name}</dt>

              <dd className="text-sm font-medium text-zinc-200">
                {formatCurrencyPln(item.plannedAmountPln)}
              </dd>
            </div>
          ))}

          <div className="h-px bg-zinc-800" />

          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-zinc-500">Plan razem</dt>

            <dd className="text-sm font-semibold text-zinc-100">
              {formatCurrencyPln(summary.financialPlanTotalPln)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-zinc-500">Zarobek netto</dt>

            <dd className="text-sm font-semibold text-zinc-100">
              {formatCurrencyPln(summary.netEarningsPln)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-zinc-500">{hasSurplus ? 'Nadwyżka' : 'Brakuje'}</dt>

            <dd
              className={`text-sm font-semibold ${
                hasSurplus ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatCurrencyPln(Math.abs(summary.financialPlanBalancePln))}
            </dd>
          </div>
        </dl>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-600">Szczegóły wypłaty</p>

          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Brutto</dt>

              <dd className="text-zinc-300">{formatCurrencyEur(summary.grossEarningsEur)}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Opłata</dt>

              <dd className="text-zinc-300">{formatCurrencyEur(summary.payoutFeeEur)}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Kurs</dt>

              <dd className="text-zinc-300">
                {exchangeRateEurPln.toFixed(2).replace('.', ',')} PLN
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
