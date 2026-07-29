import { CircleDollarSign, Plus, RefreshCw } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import CollapsiblePanel from '@/shared/components/CollapsiblePanel';
import type {
  Debt,
  DebtBalanceUpdateInput,
  DebtInput,
  DebtPaymentInput,
} from '@/modules/debts/types/debt.types';
import { getCurrentDebtBalance } from '@/modules/debts/utils/debtCalculations';
import type { DebtEvent } from '@/modules/debts/types/debt.types';

type Props = {
  debts: Debt[];
  events: DebtEvent[];
  isSaving: boolean;
  onCreateDebt: (i: DebtInput) => Promise<unknown>;
  onPayment: (i: DebtPaymentInput) => Promise<unknown>;
  onBalanceUpdate: (i: DebtBalanceUpdateInput) => Promise<unknown>;
};
const input =
  'h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-[var(--app-accent)]';
const today = () => new Date().toISOString().slice(0, 10);
const num = (v: string) => Number.parseFloat(v.replace(',', '.'));
export default function DebtActionsPanel({
  debts,
  events,
  isSaving,
  onCreateDebt,
  onPayment,
  onBalanceUpdate,
}: Props) {
  const [debtId, setDebtId] = useState('');
  const selected = useMemo(() => debts.find((d) => d.id === debtId) ?? debts[0], [debts, debtId]);
  const [payDate, setPayDate] = useState(today());
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [balanceDate, setBalanceDate] = useState(today());
  const [balance, setBalance] = useState('');
  const [balanceNote, setBalanceNote] = useState('');
  const [name, setName] = useState('');
  const [initial, setInitial] = useState('');
  const [note, setNote] = useState('');
  async function payment(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    await onPayment({ debtId: selected.id, date: payDate, amount: num(payAmount), note: payNote });
    setPayAmount('');
    setPayNote('');
  }
  async function update(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    await onBalanceUpdate({
      debtId: selected.id,
      date: balanceDate,
      currentBalance: num(balance),
      note: balanceNote,
    });
    setBalance('');
    setBalanceNote('');
  }
  async function create(e: FormEvent) {
    e.preventDefault();
    await onCreateDebt({ name, initialAmount: num(initial), note });
    setName('');
    setInitial('');
    setNote('');
  }
  return (
    <div className="grid items-start gap-4 xl:grid-cols-2">
      <CollapsiblePanel
        storageKey="debts-payment"
        title="Dodaj spłatę"
        description="Ręczny wpis zmniejszający saldo"
        icon={<CircleDollarSign className="size-4" />}
        defaultOpen={false}
      >
        <form onSubmit={payment} className="grid gap-3 p-4 sm:grid-cols-2">
          <select
            className={input}
            value={selected?.id ?? ''}
            onChange={(e) => setDebtId(e.target.value)}
          >
            {debts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            className={input}
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
          />
          <input
            className={input}
            inputMode="decimal"
            placeholder="Kwota spłaty"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
          <input
            className={input}
            placeholder="Notatka (opcjonalnie)"
            value={payNote}
            onChange={(e) => setPayNote(e.target.value)}
          />
          <button
            disabled={isSaving || !selected}
            className="h-10 rounded-xl bg-[var(--app-accent)] px-4 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2"
          >
            Zapisz spłatę
          </button>
        </form>
      </CollapsiblePanel>
      <CollapsiblePanel
        storageKey="debts-balance-update"
        title="Aktualizuj saldo"
        description="Wpisz stan widoczny obecnie u wierzyciela"
        icon={<RefreshCw className="size-4" />}
        summary={
          selected ? (
            <p className="text-xs font-semibold text-zinc-400">
              Teraz {getCurrentDebtBalance(selected, events).toFixed(2).replace('.', ',')} zł
            </p>
          ) : undefined
        }
        defaultOpen={false}
      >
        <form onSubmit={update} className="grid gap-3 p-4 sm:grid-cols-2">
          <select
            className={input}
            value={selected?.id ?? ''}
            onChange={(e) => setDebtId(e.target.value)}
          >
            {debts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            className={input}
            type="date"
            value={balanceDate}
            onChange={(e) => setBalanceDate(e.target.value)}
          />
          <input
            className={input}
            inputMode="decimal"
            placeholder="Nowe aktualne saldo"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          <input
            className={input}
            placeholder="Powód / notatka"
            value={balanceNote}
            onChange={(e) => setBalanceNote(e.target.value)}
          />
          <button
            disabled={isSaving || !selected}
            className="h-10 rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] px-4 text-sm font-semibold text-[var(--app-accent)] disabled:opacity-50 sm:col-span-2"
          >
            Zaktualizuj saldo
          </button>
        </form>
      </CollapsiblePanel>
      <div className="xl:col-span-2">
        <CollapsiblePanel
          storageKey="debts-new-debt"
          title="Nowy dług"
          description="Dodaj kolejne zobowiązanie"
          icon={<Plus className="size-4" />}
          defaultOpen={false}
        >
          <form onSubmit={create} className="grid gap-3 p-4 md:grid-cols-[1fr_14rem_1.5fr_auto]">
            <input
              className={input}
              placeholder="Nazwa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={input}
              inputMode="decimal"
              placeholder="Kwota początkowa"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
            />
            <input
              className={input}
              placeholder="Notatka"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              disabled={isSaving}
              className="h-10 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 disabled:opacity-50"
            >
              Dodaj dług
            </button>
          </form>
        </CollapsiblePanel>
      </div>
    </div>
  );
}
