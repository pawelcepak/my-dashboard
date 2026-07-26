import { CircleDollarSign, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { FinancialPlanItem, WorkWeekSummary } from '@/modules/work/types/work.types';
import { formatCurrencyPln } from '@/modules/work/utils/workCalculations';

import { calculateFinancialPlanProgress } from '@/modules/work/utils/workCalculations';

type CompactFinancialPlanProps = {
  items: FinancialPlanItem[];
  summary: WorkWeekSummary;
};

export default function CompactFinancialPlan({ items, summary }: CompactFinancialPlanProps) {
  const hasSurplus = summary.financialPlanBalancePln >= 0;

  const planProgress = calculateFinancialPlanProgress(summary.netEarningsPln, items);

  const progressPercentage =
    summary.financialPlanTotalPln > 0
      ? Math.min(100, (summary.netEarningsPln / summary.financialPlanTotalPln) * 100)
      : 100;

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]">
            <CircleDollarSign aria-hidden="true" className="size-4 text-[var(--app-accent)]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Plan finansowy</h2>

            <p className="mt-0.5 text-xs text-zinc-500">Bieżący tydzień</p>
          </div>
        </div>

        <Link
          to="/work"
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110"
        >
          <Pencil aria-hidden="true" className="size-3.5" />
          Edytuj
        </Link>
      </div>

      <div className="p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/45 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Cel
            </p>

            <p className="mt-1 text-xl font-bold text-zinc-100">
              {formatCurrencyPln(summary.financialPlanTotalPln)}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-950/45 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Zarobiono
            </p>

            <p className="mt-1 text-xl font-bold text-zinc-100">
              {formatCurrencyPln(summary.netEarningsPln)}
            </p>
          </div>

          <div
            className={`rounded-xl border px-4 py-3 ${
              hasSurplus ? 'border-emerald-800 bg-emerald-950/20' : 'border-red-800 bg-red-950/20'
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {hasSurplus ? 'Nadwyżka' : 'Brakuje'}
            </p>

            <p
              className={`mt-1 text-xl font-bold ${
                hasSurplus ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {formatCurrencyPln(Math.abs(summary.financialPlanBalancePln))}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-xs font-medium">
            <span className="text-zinc-500">Realizacja planu</span>

            <span className="font-bold text-zinc-300">
              {progressPercentage.toLocaleString('pl-PL', {
                maximumFractionDigits: 1,
              })}
              %
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all ${
                hasSurplus ? 'bg-emerald-500' : 'bg-[var(--app-accent)]'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {planProgress.map((progress) => {
            const item = items.find((currentItem) => currentItem.id === progress.itemId);

            if (!item) {
              return null;
            }

            return (
              <div
                key={item.id}
                className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-zinc-300">{item.name}</p>

                  <p className="text-xs text-zinc-500">{progress.percentage.toFixed(0)}%</p>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${
                      progress.completed ? 'bg-emerald-500' : 'bg-[var(--app-accent)]'
                    }`}
                    style={{
                      width: `${Math.min(progress.percentage, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  {formatCurrencyPln(progress.fundedAmount)}
                  {' / '}
                  {formatCurrencyPln(item.plannedAmountPln)}
                </p>
              </div>
            );
          })}

          {items.length === 0 && (
            <p className="text-sm text-zinc-500">Brak pozycji planu finansowego.</p>
          )}
        </div>
      </div>
    </section>
  );
}
