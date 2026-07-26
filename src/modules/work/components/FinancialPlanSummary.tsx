import { CircleDollarSign, Plus, Trash2 } from 'lucide-react';

import type { FinancialPlanItem, WorkWeekSummary } from '@/modules/work/types/work.types';
import { formatCurrencyEur, formatCurrencyPln } from '@/modules/work/utils/workCalculations';

type FinancialPlanSummaryProps = {
  items: FinancialPlanItem[];
  summary: WorkWeekSummary;
  exchangeRateEurPln: number;
  onItemsChange: (items: FinancialPlanItem[]) => void;
};

const inputClasses =
  'h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800';

function parseNonNegativeNumber(value: string): number {
  const parsedValue = Number.parseFloat(value.replace(',', '.'));

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

export default function FinancialPlanSummary({
  items,
  summary,
  exchangeRateEurPln,
  onItemsChange,
}: FinancialPlanSummaryProps) {
  const hasSurplus = summary.financialPlanBalancePln >= 0;

  function updateItem(itemId: string, changes: Partial<FinancialPlanItem>) {
    onItemsChange(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );
  }

  function addItem() {
    onItemsChange([
      ...items,
      {
        id: crypto.randomUUID(),
        name: 'Nowa pozycja',
        plannedAmountPln: 0,
      },
    ]);
  }

  function removeItem(itemId: string) {
    onItemsChange(items.filter((item) => item.id !== itemId));
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Plan finansowy</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Edytowalny podział zarobku z bieżącego tygodnia
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400">
          <CircleDollarSign aria-hidden="true" className="size-5" />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 sm:grid-cols-[minmax(0,1fr)_9rem_auto]"
            >
              <input
                type="text"
                aria-label="Nazwa pozycji planu"
                value={item.name}
                onChange={(event) =>
                  updateItem(item.id, {
                    name: event.target.value,
                  })
                }
                className={inputClasses}
              />

              <input
                type="number"
                aria-label={`Kwota dla ${item.name}`}
                min="0"
                step="0.01"
                value={item.plannedAmountPln}
                onChange={(event) =>
                  updateItem(item.id, {
                    plannedAmountPln: parseNonNegativeNumber(event.target.value),
                  })
                }
                className={inputClasses}
              />

              <button
                type="button"
                aria-label={`Usuń ${item.name}`}
                onClick={() => removeItem(item.id)}
                className="flex size-10 items-center justify-center rounded-xl border border-red-950 bg-red-950/30 text-red-400 transition hover:bg-red-950/60 hover:text-red-300"
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-200"
        >
          <Plus aria-hidden="true" className="size-4" />
          Dodaj pozycję planu
        </button>

        <div className="my-6 h-px bg-zinc-800" />

        <dl className="space-y-4">
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
