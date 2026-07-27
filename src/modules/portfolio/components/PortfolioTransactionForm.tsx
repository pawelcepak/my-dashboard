import { Save } from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

import type {
  PortfolioTag,
  PortfolioTransactionInput,
  PortfolioTransactionType,
} from '@/modules/portfolio/types/portfolio.types';

type PortfolioTransactionFormProps = {
  tags: PortfolioTag[];
  isSaving: boolean;
  onSave: (input: PortfolioTransactionInput) => Promise<void>;
};

const inputClasses =
  'h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

const LAST_EXPENSE_TAG_KEY = 'chb:portfolio:last-expense-tag';
const LAST_INCOME_TAG_KEY = 'chb:portfolio:last-income-tag';

function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getStoredTagId(type: PortfolioTransactionType): string {
  return (
    window.localStorage.getItem(
      type === 'income'
        ? LAST_INCOME_TAG_KEY
        : LAST_EXPENSE_TAG_KEY
    ) ?? ''
  );
}

export default function PortfolioTransactionForm({
  tags,
  isSaving,
  onSave,
}: PortfolioTransactionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState(getTodayIso);
  const [type, setType] =
    useState<PortfolioTransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [tagId, setTagId] = useState('');
  const [note, setNote] = useState('');

  const availableTags = useMemo(
    () =>
      tags.filter(
        (tag) => tag.kind === type || tag.kind === 'both'
      ),
    [tags, type]
  );

  useEffect(() => {
    const storedTagId = getStoredTagId(type);

    if (
      storedTagId &&
      availableTags.some((tag) => tag.id === storedTagId)
    ) {
      setTagId(storedTagId);
      return;
    }

    if (type === 'income') {
      const enterTalkTag = availableTags.find(
        (tag) =>
          tag.name.toLocaleLowerCase('pl-PL') === 'entertalkpro'
      );

      setTagId(enterTalkTag?.id ?? '');
      return;
    }

    setTagId('');
  }, [availableTags, type]);

  function resetAfterSave() {
    setDate(getTodayIso());
    setAmount('');
    setNote('');
    amountRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number.parseFloat(amount.replace(',', '.'));

    await onSave({
      date,
      type,
      amount: parsedAmount,
      tagId: tagId || null,
      note,
    });

    if (tagId) {
      window.localStorage.setItem(
        type === 'income'
          ? LAST_INCOME_TAG_KEY
          : LAST_EXPENSE_TAG_KEY,
        tagId
      );
    }

    resetAfterSave();
  }

  function handleFieldKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      event.currentTarget.tagName !== 'SELECT'
    ) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">
          Nowa transakcja
        </h2>

        <p className="mt-0.5 text-xs text-zinc-500">
          Enter zapisuje, a ostatni tag jest zapamiętywany
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="grid gap-2 p-3 md:grid-cols-[10.5rem_9rem_10rem_minmax(11rem,1fr)_minmax(12rem,1.3fr)_auto]"
      >
        <label>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Data
          </span>

          <input
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            onKeyDown={handleFieldKeyDown}
            className={inputClasses}
          />
        </label>

        <label>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Rodzaj
          </span>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as PortfolioTransactionType
              )
            }
            className={inputClasses}
          >
            <option value="expense">Wydatek</option>
            <option value="income">Przychód</option>
          </select>
        </label>

        <label>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Kwota
          </span>

          <input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            required
            value={amount}
            placeholder="0,00"
            onChange={(event) => setAmount(event.target.value)}
            onKeyDown={handleFieldKeyDown}
            className={inputClasses}
          />
        </label>

        <label>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Tag
          </span>

          <select
            value={tagId}
            onChange={(event) => setTagId(event.target.value)}
            className={inputClasses}
          >
            <option value="">Bez tagu</option>

            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Notatka
          </span>

          <input
            type="text"
            value={note}
            placeholder="Opcjonalnie"
            maxLength={240}
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={handleFieldKeyDown}
            className={inputClasses}
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-5 flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save aria-hidden="true" className="size-4" />
          Dodaj
        </button>
      </form>
    </section>
  );
}
