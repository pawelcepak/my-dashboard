import { Pencil, Plus, Save, Tags, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import type {
  PortfolioAccount,
  PortfolioTag,
  PortfolioTagInput,
  PortfolioTagKind,
} from '@/modules/portfolio/types/portfolio.types';

type PortfolioSettingsPanelProps = {
  account: PortfolioAccount;
  tags: PortfolioTag[];
  isSaving: boolean;
  onUpdateAccount: (initialBalance: number, initialBalanceDate: string) => Promise<void>;
  onCreateTag: (input: PortfolioTagInput) => Promise<void>;
  onUpdateTag: (tagId: string, input: PortfolioTagInput) => Promise<void>;
  onDeleteTag: (tag: PortfolioTag) => Promise<void>;
};

const inputClasses =
  'h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

export default function PortfolioSettingsPanel({
  account,
  tags,
  isSaving,
  onUpdateAccount,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: PortfolioSettingsPanelProps) {
  const [initialBalance, setInitialBalance] = useState(String(account.initialBalance));

  const [initialBalanceDate, setInitialBalanceDate] = useState(account.initialBalanceDate);

  const [tagName, setTagName] = useState('');
  const [tagKind, setTagKind] = useState<PortfolioTagKind>('expense');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  useEffect(() => {
    setInitialBalance(String(account.initialBalance));
    setInitialBalanceDate(account.initialBalanceDate);
  }, [account.initialBalance, account.initialBalanceDate]);

  function resetTagForm() {
    setTagName('');
    setTagKind('expense');
    setEditingTagId(null);
  }

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedBalance = Number.parseFloat(initialBalance.replace(',', '.'));

    await onUpdateAccount(parsedBalance, initialBalanceDate);
  }

  async function handleTagSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = {
      name: tagName,
      kind: tagKind,
    };

    if (editingTagId) {
      await onUpdateTag(editingTagId, input);
    } else {
      await onCreateTag(input);
    }

    resetTagForm();
  }

  return (
    <section className="app-panel overflow-hidden">
      <div className="flex items-center gap-3 border-b border-zinc-700 px-5 py-4">
        <Tags aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Ustawienia portfela i tagi</h2>

          <p className="mt-0.5 text-xs text-zinc-500">Saldo początkowe oraz własne kategorie</p>
        </div>
      </div>

      <div className="grid gap-5 p-4 xl:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)]">
        <form
          onSubmit={(event) => {
            void handleAccountSubmit(event);
          }}
          className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-950/35 p-4"
        >
          <h3 className="text-xs font-semibold text-zinc-300">Punkt początkowy</h3>

          <label>
            <span className="mb-1.5 block text-xs font-medium text-zinc-500">Saldo początkowe</span>

            <input
              type="text"
              inputMode="decimal"
              required
              value={initialBalance}
              onChange={(event) => setInitialBalance(event.target.value)}
              className={inputClasses}
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-medium text-zinc-500">
              Data salda początkowego
            </span>

            <input
              type="date"
              required
              value={initialBalanceDate}
              onChange={(event) => setInitialBalanceDate(event.target.value)}
              className={inputClasses}
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] px-3 text-xs font-semibold text-[var(--app-accent)] disabled:opacity-50"
          >
            <Save aria-hidden="true" className="size-3.5" />
            Zapisz punkt początkowy
          </button>
        </form>

        <div className="space-y-3">
          <form
            onSubmit={(event) => {
              void handleTagSubmit(event);
            }}
            className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem_auto]"
          >
            <input
              type="text"
              required
              maxLength={40}
              value={tagName}
              placeholder="Nazwa tagu"
              onChange={(event) => setTagName(event.target.value)}
              className={inputClasses}
            />

            <select
              value={tagKind}
              onChange={(event) => setTagKind(event.target.value as PortfolioTagKind)}
              className={inputClasses}
            >
              <option value="expense">Wydatek</option>
              <option value="income">Przychód</option>
              <option value="both">Oba rodzaje</option>
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] px-3 text-xs font-semibold text-white disabled:opacity-50"
              >
                {editingTagId ? (
                  <Save aria-hidden="true" className="size-3.5" />
                ) : (
                  <Plus aria-hidden="true" className="size-3.5" />
                )}
                {editingTagId ? 'Zapisz' : 'Dodaj'}
              </button>

              {editingTagId && (
                <button
                  type="button"
                  onClick={resetTagForm}
                  className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-500"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
            </div>
          </form>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-950/35 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-300">{tag.name}</p>

                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-zinc-600">
                    {tag.kind === 'income'
                      ? 'Przychód'
                      : tag.kind === 'expense'
                        ? 'Wydatek'
                        : 'Przychód i wydatek'}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    title="Edytuj tag"
                    onClick={() => {
                      setEditingTagId(tag.id);
                      setTagName(tag.name);
                      setTagKind(tag.kind);
                    }}
                    className="flex size-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-500"
                  >
                    <Pencil aria-hidden="true" className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    title="Usuń tag"
                    onClick={() => {
                      void onDeleteTag(tag);
                    }}
                    className="flex size-8 items-center justify-center rounded-lg border border-red-900 bg-red-950/20 text-red-400"
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
