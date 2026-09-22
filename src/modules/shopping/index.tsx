import { useLiveQuery } from 'dexie-react-hooks';
import {
  ExternalLink,
  FolderPlus,
  Link as LinkIcon,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import PageHeader from '@/shared/components/PageHeader';

const STORAGE_KEY = 'shoppingPlans';

type ShoppingCategory = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type ShoppingItem = {
  id: string;
  categoryId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  url: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

type ShoppingData = {
  categories: ShoppingCategory[];
  items: ShoppingItem[];
};

type ItemDraft = {
  categoryId: string;
  name: string;
  quantity: string;
  unitPrice: string;
  url: string;
  note: string;
};

const EMPTY_DATA: ShoppingData = { categories: [], items: [] };

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function parseData(value: string | undefined): ShoppingData {
  if (!value) return EMPTY_DATA;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return EMPTY_DATA;

    const record = parsed as Record<string, unknown>;
    const categories = Array.isArray(record.categories) ? record.categories : [];
    const items = Array.isArray(record.items) ? record.items : [];

    return {
      categories: categories.filter((category): category is ShoppingCategory => {
        if (!category || typeof category !== 'object' || Array.isArray(category)) return false;
        const value = category as Record<string, unknown>;
        return typeof value.id === 'string' && typeof value.name === 'string';
      }),
      items: items.filter((item): item is ShoppingItem => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
        const value = item as Record<string, unknown>;
        return (
          typeof value.id === 'string' &&
          typeof value.categoryId === 'string' &&
          typeof value.name === 'string' &&
          typeof value.quantity === 'number' &&
          typeof value.unitPrice === 'number'
        );
      }),
    };
  } catch {
    return EMPTY_DATA;
  }
}

function money(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(value);
}

const inputClass =
  'w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-violet-500';

export default function ShoppingPage() {
  const setting = useLiveQuery(() => database.appSettings.get(STORAGE_KEY));
  const data = useMemo(() => parseData(setting?.value), [setting?.value]);

  const [categoryName, setCategoryName] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [itemDraft, setItemDraft] = useState<ItemDraft | null>(null);

  const totalPlanned = useMemo(
    () => data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [data.items]
  );

  const persist = async (nextData: ShoppingData) => {
    const now = new Date().toISOString();
    await database.appSettings.put({
      key: STORAGE_KEY,
      value: JSON.stringify(nextData),
      updatedAt: now,
    });
    cloudDirtyTracker.markDirty();
  };

  const addCategory = async () => {
    const name = categoryName.trim();
    if (!name) return;

    const now = new Date().toISOString();
    await persist({
      ...data,
      categories: [
        ...data.categories,
        { id: createId('category'), name, createdAt: now, updatedAt: now },
      ],
    });
    setCategoryName('');
    setShowCategoryForm(false);
  };

  const renameCategory = async (categoryId: string) => {
    const name = editingCategoryName.trim();
    if (!name) return;

    const now = new Date().toISOString();
    await persist({
      ...data,
      categories: data.categories.map((category) =>
        category.id === categoryId ? { ...category, name, updatedAt: now } : category
      ),
    });
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const deleteCategory = async (categoryId: string) => {
    if (data.items.some((item) => item.categoryId === categoryId)) {
      window.alert('Najpierw usuń lub przenieś rzeczy z tej kategorii.');
      return;
    }

    if (!window.confirm('Usunąć tę kategorię?')) return;

    await persist({
      ...data,
      categories: data.categories.filter((category) => category.id !== categoryId),
    });
  };

  const openNewItem = (categoryId?: string) => {
    setItemDraft({
      categoryId: categoryId ?? data.categories[0]?.id ?? '',
      name: '',
      quantity: '1',
      unitPrice: '',
      url: '',
      note: '',
    });
  };

  const openEditItem = (item: ShoppingItem) => {
    setItemDraft({
      categoryId: item.categoryId,
      name: item.name,
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
      url: item.url,
      note: item.note,
    });
    setEditingCategoryId(`item:${item.id}`);
  };

  const closeItemEditor = () => {
    setItemDraft(null);
    if (editingCategoryId?.startsWith('item:')) setEditingCategoryId(null);
  };

  const saveItem = async () => {
    if (!itemDraft || !itemDraft.categoryId || !itemDraft.name.trim()) return;

    const quantity = Number(itemDraft.quantity.replace(',', '.'));
    const unitPrice = Number(itemDraft.unitPrice.replace(',', '.'));

    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      window.alert('Podaj prawidłową ilość i cenę.');
      return;
    }

    const now = new Date().toISOString();
    const editingItemId = editingCategoryId?.startsWith('item:')
      ? editingCategoryId.slice('item:'.length)
      : null;

    const nextItem: ShoppingItem = {
      id: editingItemId ?? createId('item'),
      categoryId: itemDraft.categoryId,
      name: itemDraft.name.trim(),
      quantity,
      unitPrice,
      url: itemDraft.url.trim(),
      note: itemDraft.note.trim(),
      createdAt: editingItemId
        ? data.items.find((item) => item.id === editingItemId)?.createdAt ?? now
        : now,
      updatedAt: now,
    };

    await persist({
      ...data,
      items: editingItemId
        ? data.items.map((item) => (item.id === editingItemId ? nextItem : item))
        : [...data.items, nextItem],
    });

    closeItemEditor();
  };

  const deleteItem = async (itemId: string) => {
    if (!window.confirm('Usunąć tę rzecz z planu zakupowego?')) return;
    await persist({ ...data, items: data.items.filter((item) => item.id !== itemId) });
  };

  const sortedCategories = [...data.categories].sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Plany zakupowe"
        description="Kategorie, rzeczy, ceny i linki — wszystko zapisuje się lokalnie i synchronizuje z chmurą CHB."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowCategoryForm((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/60 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/20"
            >
              <FolderPlus className="size-4" />
              Kategoria
            </button>
            <button
              type="button"
              onClick={() => openNewItem()}
              disabled={data.categories.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" />
              Rzecz
            </button>
          </div>
        }
      />

      {showCategoryForm && (
        <section className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Nazwa kategorii
              </span>
              <input
                autoFocus
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void addCategory();
                }}
                className={inputClass}
                placeholder="np. Buty, Narzędzia, Elektronika"
              />
            </label>
            <button
              type="button"
              onClick={() => void addCategory()}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Dodaj kategorię
            </button>
            <button
              type="button"
              onClick={() => setShowCategoryForm(false)}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Anuluj
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Planowany koszt</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{money(totalPlanned)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Kategorie</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{data.categories.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Rzeczy</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{data.items.length}</p>
        </div>
      </section>

      {data.categories.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
          <ShoppingBag className="mx-auto size-9 text-violet-400" />
          <h2 className="mt-3 text-base font-semibold text-zinc-100">Brak planów zakupowych</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Dodaj pierwszą kategorię, a potem wpisuj rzeczy tak jak w prostym arkuszu.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {sortedCategories.map((category) => {
            const items = data.items.filter((item) => item.categoryId === category.id);
            const categoryTotal = items.reduce(
              (sum, item) => sum + item.quantity * item.unitPrice,
              0
            );
            const isRenaming = editingCategoryId === category.id;

            return (
              <section key={category.id} className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/60">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700/80 px-4 py-3">
                  <div className="min-w-0">
                    {isRenaming ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={editingCategoryName}
                          onChange={(event) => setEditingCategoryName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') void renameCategory(category.id);
                            if (event.key === 'Escape') setEditingCategoryId(null);
                          }}
                          className={`${inputClass} max-w-xs`}
                        />
                        <button
                          type="button"
                          onClick={() => void renameCategory(category.id)}
                          className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Zapisz
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-bold text-zinc-100">{category.name}</h2>
                        <p className="text-xs text-zinc-500">
                          {items.length} {items.length === 1 ? 'rzecz' : 'rzeczy'}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-violet-300">{money(categoryTotal)}</span>
                    <button
                      type="button"
                      onClick={() => openNewItem(category.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/50 px-2.5 py-1.5 text-xs font-semibold text-violet-200 hover:bg-violet-500/10"
                    >
                      <Plus className="size-3.5" />
                      Dodaj rzecz
                    </button>
                    {!isRenaming && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(category.id);
                          setEditingCategoryName(category.name);
                        }}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                        aria-label={`Edytuj kategorię ${category.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void deleteCategory(category.id)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
                      aria-label={`Usuń kategorię ${category.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-zinc-950/30 text-[10px] uppercase tracking-wide text-zinc-500">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Rzecz</th>
                        <th className="w-24 px-3 py-2.5 text-right font-semibold">Ilość</th>
                        <th className="w-32 px-3 py-2.5 text-right font-semibold">Cena</th>
                        <th className="w-32 px-3 py-2.5 text-right font-semibold">Razem</th>
                        <th className="w-28 px-3 py-2.5 font-semibold">Link</th>
                        <th className="w-24 px-3 py-2.5 text-right font-semibold">Akcje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-sm text-zinc-500">
                            Ta kategoria nie ma jeszcze żadnych rzeczy.
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 align-top">
                              <div className="font-semibold text-zinc-100">{item.name}</div>
                              {item.note && <div className="mt-0.5 text-xs text-zinc-500">{item.note}</div>}
                            </td>
                            <td className="px-3 py-3 text-right text-zinc-300">{item.quantity}</td>
                            <td className="px-3 py-3 text-right text-zinc-300">{money(item.unitPrice)}</td>
                            <td className="px-3 py-3 text-right font-semibold text-zinc-100">
                              {money(item.quantity * item.unitPrice)}
                            </td>
                            <td className="px-3 py-3">
                              {item.url ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-violet-300 hover:text-violet-200"
                                >
                                  <ExternalLink className="size-4" />
                                  Otwórz
                                </a>
                              ) : (
                                <span className="text-zinc-600">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditItem(item)}
                                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                  aria-label={`Edytuj ${item.name}`}
                                >
                                  <Pencil className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void deleteItem(item.id)}
                                  className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
                                  aria-label={`Usuń ${item.name}`}
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {itemDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
              <div>
                <h2 className="font-bold text-zinc-100">
                  {editingCategoryId?.startsWith('item:') ? 'Edytuj rzecz' : 'Dodaj rzecz'}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">Cena jest ceną jednej sztuki.</p>
              </div>
              <button
                type="button"
                onClick={closeItemEditor}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Zamknij"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Rzecz</span>
                <input
                  autoFocus
                  value={itemDraft.name}
                  onChange={(event) => setItemDraft({ ...itemDraft, name: event.target.value })}
                  className={inputClass}
                  placeholder="np. buty robocze"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Kategoria</span>
                <select
                  value={itemDraft.categoryId}
                  onChange={(event) => setItemDraft({ ...itemDraft, categoryId: event.target.value })}
                  className={inputClass}
                >
                  {sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Ilość</span>
                <input
                  type="number"
                  min="0.01"
                  step="1"
                  value={itemDraft.quantity}
                  onChange={(event) => setItemDraft({ ...itemDraft, quantity: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Cena / szt.</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemDraft.unitPrice}
                  onChange={(event) => setItemDraft({ ...itemDraft, unitPrice: event.target.value })}
                  className={inputClass}
                  placeholder="0,00"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Link</span>
                <div className="relative">
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="url"
                    value={itemDraft.url}
                    onChange={(event) => setItemDraft({ ...itemDraft, url: event.target.value })}
                    className={`${inputClass} pl-9`}
                    placeholder="https://..."
                  />
                </div>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Notatka</span>
                <input
                  value={itemDraft.note}
                  onChange={(event) => setItemDraft({ ...itemDraft, note: event.target.value })}
                  className={inputClass}
                  placeholder="opcjonalnie: rozmiar, model, kolor..."
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-zinc-700 px-5 py-4">
              <button
                type="button"
                onClick={closeItemEditor}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={() => void saveItem()}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
