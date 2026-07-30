import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  LoaderCircle,
  Navigation,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useState, type DragEvent } from 'react';

import { getOrderedNavigationItems, type NavigationItemId } from '@/app/layout/navigation';
import { useAppSettings } from '@/modules/settings/hooks/useAppSettings';
import {
  DEFAULT_APP_PREFERENCES,
  NAVIGATION_TAB_COLORS,
  type NavigationTabColor,
} from '@/modules/settings/types/appSettings.types';

const COLOR_LABELS: Record<NavigationTabColor, string> = {
  crimson: 'Crimson',
  blue: 'Niebieski',
  emerald: 'Szmaragdowy',
  amber: 'Bursztynowy',
  violet: 'Fioletowy',
  cyan: 'Cyjan',
  orange: 'Pomarańczowy',
  pink: 'Różowy',
  zinc: 'Szary',
};

const COLOR_VALUES: Record<NavigationTabColor, string> = {
  crimson: '#ff315d',
  blue: '#60a5fa',
  emerald: '#34d399',
  amber: '#fbbf24',
  violet: '#a78bfa',
  cyan: '#22d3ee',
  orange: '#fb923c',
  pink: '#f472b6',
  zinc: '#a1a1aa',
};

function moveItem(
  order: NavigationItemId[],
  itemId: NavigationItemId,
  targetIndex: number
): NavigationItemId[] {
  const currentIndex = order.indexOf(itemId);

  if (
    currentIndex < 0 ||
    targetIndex < 0 ||
    targetIndex >= order.length ||
    currentIndex === targetIndex
  ) {
    return [...order];
  }

  const nextOrder = [...order];
  nextOrder.splice(currentIndex, 1);
  nextOrder.splice(targetIndex, 0, itemId);

  return nextOrder;
}

export default function NavigationPreferencesPanel() {
  const { preferences, isLoading, isSaving, error, savePreference } = useAppSettings();

  const [localOrder, setLocalOrder] = useState<NavigationItemId[]>(preferences.navigationOrder);

  const [draggedId, setDraggedId] = useState<NavigationItemId | null>(null);

  useEffect(() => {
    setLocalOrder(preferences.navigationOrder);
  }, [preferences.navigationOrder]);

  const items = useMemo(() => getOrderedNavigationItems(localOrder), [localOrder]);

  async function persistOrder(nextOrder: NavigationItemId[]) {
    setLocalOrder(nextOrder);

    try {
      await savePreference('navigationOrder', nextOrder);
    } catch {
      setLocalOrder(preferences.navigationOrder);
    }
  }

  function handleDragStart(event: DragEvent<HTMLDivElement>, itemId: NavigationItemId) {
    setDraggedId(itemId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', itemId);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>, targetId: NavigationItemId) {
    event.preventDefault();

    const sourceId = draggedId ?? (event.dataTransfer.getData('text/plain') as NavigationItemId);

    setDraggedId(null);

    if (!sourceId || sourceId === targetId) {
      return;
    }

    const targetIndex = localOrder.indexOf(targetId);

    await persistOrder(moveItem(localOrder, sourceId, targetIndex));
  }

  async function handleColorChange(itemId: NavigationItemId, color: NavigationTabColor) {
    await savePreference('navigationTabColors', {
      ...preferences.navigationTabColors,
      [itemId]: color,
    });
  }

  async function handleReset() {
    setLocalOrder(DEFAULT_APP_PREFERENCES.navigationOrder);

    await savePreference('navigationOrder', DEFAULT_APP_PREFERENCES.navigationOrder);

    await savePreference('navigationTabColors', DEFAULT_APP_PREFERENCES.navigationTabColors);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Dolne zakładki</h2>

          <p className="mt-1 text-sm text-zinc-500">Kolejność i osobny kolor każdej zakładki</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
          {isLoading || isSaving ? (
            <LoaderCircle className="size-5 animate-spin" />
          ) : (
            <Navigation className="size-5" />
          )}
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {error && <div className="app-notice app-notice-error">{error}</div>}

        <p className="text-xs leading-5 text-zinc-500">
          Na komputerze przeciągnij cały wiersz lub uchwyt. Strzałki działają zawsze i zapisują
          zmianę od razu. Pierwsze cztery pozycje są widoczne bezpośrednio na telefonie.
        </p>

        <div className="space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const color = preferences.navigationTabColors[item.id] ?? 'crimson';

            return (
              <div
                key={item.id}
                draggable={!isSaving}
                onDragStart={(event) => handleDragStart(event, item.id)}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(event) => {
                  void handleDrop(event, item.id);
                }}
                className={`grid cursor-grab items-center gap-3 rounded-xl border bg-zinc-950/40 p-3 transition active:cursor-grabbing sm:grid-cols-[auto_minmax(10rem,1fr)_minmax(12rem,0.8fr)_auto] ${
                  draggedId === item.id
                    ? 'border-[var(--app-accent)] opacity-55'
                    : 'border-zinc-700'
                }`}
              >
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-center text-zinc-600 sm:flex"
                >
                  <GripVertical className="size-5" />
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900"
                    style={{ color: COLOR_VALUES[color] }}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-200">
                      {index + 1}. {item.label}
                    </p>
                    <p className="truncate text-[10px] text-zinc-600">{item.path}</p>
                  </div>
                </div>

                <label
                  className="flex min-w-0 items-center gap-2"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <span
                    className="size-3 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: COLOR_VALUES[color] }}
                  />

                  <select
                    value={color}
                    disabled={isSaving}
                    onChange={(event) => {
                      void handleColorChange(item.id, event.target.value as NavigationTabColor);
                    }}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-300 outline-none focus:border-[var(--app-accent)]"
                  >
                    {NAVIGATION_TAB_COLORS.map((option) => (
                      <option key={option} value={option}>
                        {COLOR_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </label>

                <div
                  className="flex justify-end gap-1"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={isSaving || index === 0}
                    aria-label={`Przesuń ${item.label} wcześniej`}
                    onClick={() => {
                      void persistOrder(moveItem(localOrder, item.id, index - 1));
                    }}
                    className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-500 transition hover:text-zinc-200 disabled:opacity-30"
                  >
                    <ChevronUp className="size-4 sm:-rotate-90" />
                  </button>

                  <button
                    type="button"
                    disabled={isSaving || index === items.length - 1}
                    aria-label={`Przesuń ${item.label} później`}
                    onClick={() => {
                      void persistOrder(moveItem(localOrder, item.id, index + 1));
                    }}
                    className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-500 transition hover:text-zinc-200 disabled:opacity-30"
                  >
                    <ChevronDown className="size-4 sm:-rotate-90" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-zinc-700 bg-zinc-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-300">Przywróć domyślny układ</p>
            <p className="mt-1 text-xs text-zinc-500">
              Dashboard, Praca, Długi, Portfel, Alkohol i Ustawienia — wszystkie w Crimson.
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading || isSaving}
            onClick={() => {
              void handleReset();
            }}
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-xs font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            Przywróć
          </button>
        </div>
      </div>
    </section>
  );
}
