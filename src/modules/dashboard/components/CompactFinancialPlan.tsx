import { CircleDollarSign, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { FinancialPlanItem, WorkWeekSummary } from '@/modules/work/types/work.types';
import { formatCurrencyPln } from '@/modules/work/utils/workCalculations';

type CompactFinancialPlanProps = {
  items: FinancialPlanItem[];
  summary: WorkWeekSummary;
};

export default function CompactFinancialPlan({ items, summary }: CompactFinancialPlanProps) {
  const hasSurplus = summary.financialPlanBalancePln >= 0;

  const progressPercentage =
    summary.financialPlanTotalPln > 0
      ? Math.min(100, (summary.netEarningsPln / summary.financialPlanTotalPln) * 100)
      : 100;

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <CircleDollarSign aria-hidden="true" className="size-4 text-zinc-600" />

          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Plan finansowy</h2>

            <p className="mt-0.5 text-xs text-zinc-500">Bieżący tydzień</p>
          </div>
        </div>

        <Link
          to="/work"
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-100"
        >
          <Pencil aria-hidden="true" className="size-3.5" />
          Edytuj
        </Link>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-zinc-600">Cel</p>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {formatCurrencyPln(summary.financialPlanTotalPln)}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-zinc-600">Zarobiono</p>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {formatCurrencyPln(summary.netEarningsPln)}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-zinc-600">
              {hasSurplus ? 'Nadwyżka' : 'Brakuje'}
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${
                hasSurplus ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatCurrencyPln(Math.abs(summary.financialPlanBalancePln))}
            </p>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full ${hasSurplus ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {items.map((item) => (
            <p key={item.id} className="text-xs text-zinc-500">
              {item.name}:{' '}
              <span className="font-medium text-zinc-300">
                {formatCurrencyPln(item.plannedAmountPln)}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
