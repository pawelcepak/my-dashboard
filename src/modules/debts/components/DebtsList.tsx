import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { DebtEvent, DebtInput, DebtWithSummary } from '@/modules/debts/types/debt.types';
import { formatCurrencyPln, getDebtEvents } from '@/modules/debts/utils/debtCalculations';

type Props = {
  debts: DebtWithSummary[];
  events: DebtEvent[];
  isSaving: boolean;
  onUpdate: (id: string, input: DebtInput) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
};
const input =
  'h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none';
export default function DebtsList({ debts, events, isSaving, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <section className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
      {debts.map((debt) => {
        const last = getDebtEvents(debt.id, events).at(-1);
        return (
          <article key={debt.id} className="rounded-2xl border border-zinc-700 bg-zinc-900/55 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-zinc-100">{debt.name}</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {debt.currentBalance <= 0.005 ? 'Spłacony' : 'Aktywny'} · {debt.eventCount}{' '}
                  zdarzeń
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  title="Edytuj"
                  onClick={() => setEditing(editing === debt.id ? null : debt.id)}
                  className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-zinc-100"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  title="Usuń"
                  disabled={isSaving}
                  onClick={() => {
                    if (confirm(`Usunąć dług „${debt.name}” wraz z historią?`))
                      void onDelete(debt.id);
                  }}
                  className="rounded-lg border border-red-900/60 p-2 text-red-400"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-zinc-950/50 p-2">
                <p className="text-zinc-500">Początkowo</p>
                <p className="mt-1 font-semibold text-zinc-300">
                  {formatCurrencyPln(debt.initialAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-950/50 p-2">
                <p className="text-zinc-500">Aktualnie</p>
                <p className="mt-1 font-bold text-[var(--app-accent)]">
                  {formatCurrencyPln(debt.currentBalance)}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-950/50 p-2">
                <p className="text-zinc-500">Wpłacono</p>
                <p className="mt-1 font-semibold text-emerald-400">
                  {formatCurrencyPln(debt.totalPayments)}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-950/50 p-2">
                <p className="text-zinc-500">Zmiana netto</p>
                <p className="mt-1 font-semibold text-zinc-300">
                  {formatCurrencyPln(debt.netReduction)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-[var(--app-accent)]"
                style={{ width: `${debt.progressPercent}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
              <span>{debt.progressPercent.toFixed(1).replace('.', ',')}%</span>
              <span>{last ? `Aktualizacja ${last.date}` : 'Brak historii'}</span>
            </div>
            {debt.note && <p className="mt-3 text-xs leading-5 text-zinc-500">{debt.note}</p>}
            {editing === debt.id && (
              <form
                className="mt-3 grid gap-2 border-t border-zinc-700 pt-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await onUpdate(debt.id, {
                    name: String(fd.get('name')),
                    initialAmount: Number(String(fd.get('initial')).replace(',', '.')),
                    note: String(fd.get('note')),
                  });
                  setEditing(null);
                }}
              >
                <input name="name" defaultValue={debt.name} className={input} />
                <input name="initial" defaultValue={debt.initialAmount} className={input} />
                <input name="note" defaultValue={debt.note} className={input} />
                <button className="h-9 rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-950">
                  Zapisz zmiany
                </button>
              </form>
            )}
          </article>
        );
      })}
    </section>
  );
}
