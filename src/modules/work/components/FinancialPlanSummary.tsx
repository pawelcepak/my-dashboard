import { ArrowDown, ArrowUp, CircleDollarSign, Lock, LockOpen, Plus, Trash2 } from 'lucide-react';

import type { FinancialPlanItem, WorkWeekSummary } from '@/modules/work/types/work.types';
import { formatCurrencyEur, formatCurrencyPln } from '@/modules/work/utils/workCalculations';

type FinancialPlanSummaryProps = {
  items: FinancialPlanItem[];
  summary: WorkWeekSummary;
  exchangeRateEurPln: number;
  onItemsChange: (items: FinancialPlanItem[]) => void;
};

const inputClasses =
  'h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

function parseNonNegativeNumber(value: string): number {
  const parsedValue = Number.parseFloat(value.replace(',', '.'));

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function normalizeItems(items: FinancialPlanItem[]): FinancialPlanItem[] {
  return [...items]
    .sort(
      (firstItem, secondItem) =>
        (firstItem.priority ?? Number.MAX_SAFE_INTEGER) -
        (secondItem.priority ?? Number.MAX_SAFE_INTEGER)
    )
    .map((item, index) => ({
      ...item,
      priority: index + 1,
      locked: item.locked ?? false,
    }));
}

function reindexItems(items: FinancialPlanItem[]): FinancialPlanItem[] {
  return items.map((item, index) => ({
    ...item,
    priority: index + 1,
    locked: item.locked ?? false,
  }));
}

export default function FinancialPlanSummary({
  items,
  summary,
  exchangeRateEurPln,
  onItemsChange,
}: FinancialPlanSummaryProps) {
  const hasSurplus = summary.financialPlanBalancePln >= 0;

  const orderedItems = normalizeItems(items);

  function saveItems(nextItems: FinancialPlanItem[]) {
    onItemsChange(reindexItems(nextItems));
  }

  function updateItem(itemId: string, changes: Partial<FinancialPlanItem>) {
    saveItems(
      orderedItems.map((item) =>
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
    saveItems([
      ...orderedItems,
      {
        id: crypto.randomUUID(),
        name: '',
        plannedAmountPln: 0,
        priority: orderedItems.length + 1,
        locked: false,
      },
    ]);
  }

  function removeItem(itemId: string) {
    const item = orderedItems.find((candidateItem) => candidateItem.id === itemId);

    if (!item || item.locked) {
      return;
    }

    const itemLabel = item.name.trim() || `Priorytet ${item.priority}`;

    const shouldRemove = window.confirm(
      `Czy usunąć cel „${itemLabel}”?\n\nTa operacja usunie go z planu finansowego aktywnego tygodnia.`
    );

    if (!shouldRemove) {
      return;
    }

    saveItems(orderedItems.filter((currentItem) => currentItem.id !== itemId));
  }

  function moveItem(itemId: string, direction: 'up' | 'down') {
    const currentIndex = orderedItems.findIndex((item) => item.id === itemId);

    if (currentIndex < 0) {
      return;
    }

    const currentItem = orderedItems[currentIndex];

    if (currentItem.locked) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= orderedItems.length) {
      return;
    }

    const targetItem = orderedItems[targetIndex];

    if (targetItem.locked) {
      return;
    }

    const nextItems = [...orderedItems];

    [nextItems[currentIndex], nextItems[targetIndex]] = [
      nextItems[targetIndex],
      nextItems[currentIndex],
    ];

    saveItems(nextItems);
  }

  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Plan finansowy</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Kolejność określa sposób rozdzielania zarobionych środków.
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-400">
          <CircleDollarSign aria-hidden="true" className="size-5" />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="space-y-3">
          {orderedItems.map((item, index) => {
            const previousItem = orderedItems[index - 1];
            const nextItem = orderedItems[index + 1];

            const canMoveUp = index > 0 && !item.locked && !previousItem?.locked;

            const canMoveDown =
              index < orderedItems.length - 1 && !item.locked && !nextItem?.locked;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3 ${
                  item.locked
                    ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
                    : 'border-zinc-700 bg-zinc-950/40'
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-xs font-bold text-zinc-300">
                      {item.priority}
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Priorytet {item.priority}
                      </p>

                      <p className="text-[11px] text-zinc-500">
                        {item.locked ? 'Pozycja zablokowana' : 'Pozycję można przesuwać'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!canMoveUp}
                      aria-label={`Przesuń ${item.name || 'cel'} wyżej`}
                      title={canMoveUp ? 'Przesuń wyżej' : 'Nie można przesunąć wyżej'}
                      onClick={() => moveItem(item.id, 'up')}
                      className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 transition hover:border-[var(--app-accent-border)] hover:text-[var(--app-accent)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp aria-hidden="true" className="size-4" />
                    </button>

                    <button
                      type="button"
                      disabled={!canMoveDown}
                      aria-label={`Przesuń ${item.name || 'cel'} niżej`}
                      title={canMoveDown ? 'Przesuń niżej' : 'Nie można przesunąć niżej'}
                      onClick={() => moveItem(item.id, 'down')}
                      className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 transition hover:border-[var(--app-accent-border)] hover:text-[var(--app-accent)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown aria-hidden="true" className="size-4" />
                    </button>

                    <button
                      type="button"
                      aria-label={
                        item.locked
                          ? `Odblokuj ${item.name || 'cel'}`
                          : `Zablokuj ${item.name || 'cel'}`
                      }
                      title={item.locked ? 'Odblokuj priorytet' : 'Zablokuj priorytet'}
                      onClick={() =>
                        updateItem(item.id, {
                          locked: !item.locked,
                        })
                      }
                      className={`flex size-9 items-center justify-center rounded-lg border transition ${
                        item.locked
                          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100'
                      }`}
                    >
                      {item.locked ? (
                        <Lock aria-hidden="true" className="size-4" />
                      ) : (
                        <LockOpen aria-hidden="true" className="size-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={item.locked}
                      aria-label={`Usuń ${item.name || 'cel'}`}
                      title={item.locked ? 'Najpierw odblokuj cel' : 'Usuń cel'}
                      onClick={() => removeItem(item.id)}
                      className="flex size-9 items-center justify-center rounded-lg border border-red-800 bg-red-950/30 text-red-400 transition hover:bg-red-950/60 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                  <label>
                    <span className="sr-only">Nazwa pozycji planu</span>

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
                      placeholder="Nazwa celu"
                    />
                  </label>

                  <label>
                    <span className="sr-only">Kwota celu</span>

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
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 text-sm font-medium text-zinc-400 transition hover:border-[var(--app-accent-border)] hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent)]"
        >
          <Plus aria-hidden="true" className="size-4" />
          Dodaj cel na końcu listy
        </button>

        <div className="my-6 h-px bg-zinc-700" />

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

        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
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
