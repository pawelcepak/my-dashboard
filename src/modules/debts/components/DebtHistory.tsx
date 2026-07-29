import { History, Trash2 } from 'lucide-react';
import CollapsiblePanel from '@/shared/components/CollapsiblePanel';
import type { Debt, DebtEvent } from '@/modules/debts/types/debt.types';
import { formatCurrencyPln } from '@/modules/debts/utils/debtCalculations';
type Props = {
  debts: Debt[];
  events: DebtEvent[];
  isSaving: boolean;
  onDelete: (id: string) => Promise<unknown>;
};
export default function DebtHistory({ debts, events, isSaving, onDelete }: Props) {
  const names = new Map(debts.map((d) => [d.id, d.name]));
  return (
    <CollapsiblePanel
      storageKey="debts-history"
      title="Historia zmian"
      description="Spłaty i ręczne aktualizacje salda"
      icon={<History className="size-4" />}
      summary={<p className="text-xs font-semibold text-zinc-400">{events.length} zdarzeń</p>}
      defaultOpen={false}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-xs">
          <thead className="bg-zinc-950/60 text-[10px] uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Dług</th>
              <th className="px-4 py-3 text-left">Typ</th>
              <th className="px-4 py-3 text-right">Zmiana</th>
              <th className="px-4 py-3 text-right">Saldo po</th>
              <th className="px-4 py-3 text-left">Notatka</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-zinc-700/70">
                <td className="px-4 py-3 text-zinc-400">{e.date}</td>
                <td className="px-4 py-3 font-medium text-zinc-200">
                  {names.get(e.debtId) ?? 'Usunięty dług'}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {e.type === 'payment' ? 'Spłata' : 'Aktualizacja salda'}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${e.amount <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {e.amount > 0 ? '+' : ''}
                  {formatCurrencyPln(e.amount)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-200">
                  {formatCurrencyPln(e.balanceAfter)}
                </td>
                <td className="max-w-72 truncate px-4 py-3 text-zinc-500">{e.note || '—'}</td>
                <td className="px-3">
                  <button
                    disabled={isSaving}
                    onClick={() => {
                      if (
                        confirm('Usunąć to zdarzenie? Kolejne zapisane salda pozostaną bez zmian.')
                      )
                        void onDelete(e.id);
                    }}
                    className="rounded-lg p-2 text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  Brak zapisanych zdarzeń.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CollapsiblePanel>
  );
}
