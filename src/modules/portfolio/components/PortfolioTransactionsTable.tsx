import {
  Check,
  Filter,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import {
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react';

import type {
  PortfolioAccount,
  PortfolioTag,
  PortfolioTransaction,
  PortfolioTransactionInput,
  PortfolioTransactionType,
} from '@/modules/portfolio/types/portfolio.types';
import {
  createPortfolioLedger,
  formatCurrencyPln,
  formatPortfolioDate,
} from '@/modules/portfolio/utils/portfolioCalculations';

type PortfolioTransactionsTableProps = {
  account: PortfolioAccount;
  transactions: PortfolioTransaction[];
  tags: PortfolioTag[];
  isSaving: boolean;
  onUpdate: (
    transactionId: string,
    input: PortfolioTransactionInput
  ) => Promise<void>;
  onDelete: (transaction: PortfolioTransaction) => Promise<void>;
};

type SortDirection = 'newest' | 'oldest';

const cellInputClasses =
  'h-8 w-full rounded-lg border border-[var(--app-accent)] bg-zinc-950 px-2 text-xs text-zinc-100 outline-none';

export default function PortfolioTransactionsTable({
  account,
  transactions,
  tags,
  isSaving,
  onUpdate,
  onDelete,
}: PortfolioTransactionsTableProps) {
  const [typeFilter, setTypeFilter] = useState<
    PortfolioTransactionType | 'all'
  >('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] =
    useState<PortfolioTransactionInput | null>(null);

  const tagsById = useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag])),
    [tags]
  );

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pl-PL');

    const filtered = createPortfolioLedger(account, transactions).filter(
      (row) => {
        const tagName = row.transaction.tagId
          ? tagsById.get(row.transaction.tagId)?.name ?? ''
          : '';

        return (
          (typeFilter === 'all' ||
            row.transaction.type === typeFilter) &&
          (tagFilter === 'all' ||
            row.transaction.tagId === tagFilter) &&
          (!normalizedQuery ||
            row.transaction.note
              .toLocaleLowerCase('pl-PL')
              .includes(normalizedQuery) ||
            tagName
              .toLocaleLowerCase('pl-PL')
              .includes(normalizedQuery))
        );
      }
    );

    return sortDirection === 'newest'
      ? filtered.reverse()
      : filtered;
  }, [
    account,
    transactions,
    tagsById,
    typeFilter,
    tagFilter,
    query,
    sortDirection,
  ]);

  function startEditing(transaction: PortfolioTransaction) {
    setEditingId(transaction.id);
    setDraft({
      date: transaction.date,
      type: transaction.type,
      amount: transaction.amount,
      tagId: transaction.tagId,
      note: transaction.note,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setDraft(null);
  }

  async function saveEditing() {
    if (!editingId || !draft) {
      return;
    }

    await onUpdate(editingId, draft);
    cancelEditing();
  }

  function handleEditKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }

    if (event.key === 'Enter' && event.currentTarget.tagName !== 'SELECT') {
      event.preventDefault();
      void saveEditing();
    }
  }

  return (
    <section className="app-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-zinc-700 px-4 py-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">
            Historia transakcji
          </h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Kliknij ołówek, edytuj wiersz i zatwierdź Enterem
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[8rem_11rem_13rem_9rem]">
          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value as PortfolioTransactionType | 'all'
              )
            }
            className={cellInputClasses}
          >
            <option value="all">Wszystkie</option>
            <option value="expense">Wydatki</option>
            <option value="income">Przychody</option>
          </select>

          <select
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            className={cellInputClasses}
          >
            <option value="all">Wszystkie tagi</option>
            <option value="">Bez tagu</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Filter
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-2 size-3.5 text-zinc-600"
            />
            <input
              value={query}
              placeholder="Szukaj w tagach i notatkach"
              onChange={(event) => setQuery(event.target.value)}
              className={`${cellInputClasses} pl-8`}
            />
          </div>

          <select
            value={sortDirection}
            onChange={(event) =>
              setSortDirection(event.target.value as SortDirection)
            }
            className={cellInputClasses}
          >
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-zinc-300">
            Brak pasujących transakcji
          </p>
        </div>
      ) : (
        <div className="max-h-[34rem] overflow-auto">
          <table className="w-full min-w-[830px] border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-zinc-950 text-[9px] uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="border-b border-zinc-700 px-2 py-2 text-left">
                  Data
                </th>
                <th className="border-b border-zinc-700 px-2 py-2 text-left">
                  Rodzaj
                </th>
                <th className="border-b border-zinc-700 px-2 py-2 text-left">
                  Tag
                </th>
                <th className="border-b border-zinc-700 px-2 py-2 text-left">
                  Notatka
                </th>
                <th className="border-b border-zinc-700 px-2 py-2 text-right">
                  Kwota
                </th>
                <th className="border-b border-zinc-700 px-2 py-2 text-right">
                  Saldo
                </th>
                <th className="border-b border-zinc-700 px-2 py-2 text-right">
                  Akcje
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const isEditing = editingId === row.transaction.id;
                const availableTags = tags.filter(
                  (tag) =>
                    !draft ||
                    tag.kind === draft.type ||
                    tag.kind === 'both'
                );

                return (
                  <tr
                    key={row.transaction.id}
                    className="border-b border-zinc-700/70 last:border-b-0 hover:bg-zinc-950/30"
                  >
                    <td className="whitespace-nowrap px-2 py-1.5">
                      {isEditing && draft ? (
                        <input
                          type="date"
                          value={draft.date}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              date: event.target.value,
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                          className={cellInputClasses}
                        />
                      ) : (
                        formatPortfolioDate(row.transaction.date)
                      )}
                    </td>

                    <td className="px-2 py-1.5">
                      {isEditing && draft ? (
                        <select
                          value={draft.type}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              type: event.target
                                .value as PortfolioTransactionType,
                              tagId: null,
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                          className={cellInputClasses}
                        >
                          <option value="expense">Wydatek</option>
                          <option value="income">Przychód</option>
                        </select>
                      ) : (
                        <span
                          className={
                            row.transaction.type === 'income'
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }
                        >
                          {row.transaction.type === 'income'
                            ? 'Przychód'
                            : 'Wydatek'}
                        </span>
                      )}
                    </td>

                    <td className="px-2 py-1.5">
                      {isEditing && draft ? (
                        <select
                          value={draft.tagId ?? ''}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              tagId: event.target.value || null,
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                          className={cellInputClasses}
                        >
                          <option value="">Bez tagu</option>
                          {availableTags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                              {tag.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        tagsById.get(row.transaction.tagId ?? '')?.name ??
                        'Bez tagu'
                      )}
                    </td>

                    <td className="px-2 py-1.5">
                      {isEditing && draft ? (
                        <input
                          value={draft.note}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              note: event.target.value,
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                          className={cellInputClasses}
                        />
                      ) : (
                        <span
                          title={row.transaction.note}
                          className="block max-w-72 truncate text-zinc-500"
                        >
                          {row.transaction.note || '—'}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-2 py-1.5 text-right">
                      {isEditing && draft ? (
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={draft.amount}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              amount: Number(event.target.value),
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                          className={`${cellInputClasses} text-right`}
                        />
                      ) : (
                        <span
                          className={
                            row.signedAmount >= 0
                              ? 'font-bold text-emerald-400'
                              : 'font-bold text-red-400'
                          }
                        >
                          {row.signedAmount >= 0 ? '+' : ''}
                          {formatCurrencyPln(row.signedAmount)}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-2 py-1.5 text-right font-semibold text-zinc-200">
                      {formatCurrencyPln(row.balanceAfter)}
                    </td>

                    <td className="px-2 py-1.5">
                      <div className="flex justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={isSaving}
                              title="Zapisz"
                              onClick={() => {
                                void saveEditing();
                              }}
                              className="flex size-7 items-center justify-center rounded-md border border-emerald-800 bg-emerald-950/20 text-emerald-400"
                            >
                              <Check className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Anuluj"
                              onClick={cancelEditing}
                              className="flex size-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 text-zinc-500"
                            >
                              <X className="size-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={isSaving}
                              title="Edytuj wiersz"
                              onClick={() => startEditing(row.transaction)}
                              className="flex size-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 text-zinc-500"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isSaving}
                              title="Usuń"
                              onClick={() => {
                                void onDelete(row.transaction);
                              }}
                              className="flex size-7 items-center justify-center rounded-md border border-red-900 bg-red-950/20 text-red-400"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
