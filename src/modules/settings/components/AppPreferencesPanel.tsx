import { Check, LayoutGrid, LoaderCircle, Palette, RotateCcw } from 'lucide-react';

import { useAppSettings } from '@/modules/settings/hooks/useAppSettings';
import type { AccentTheme, TableDensity } from '@/modules/settings/types/appSettings.types';

type DensityOption = {
  value: TableDensity;
  label: string;
  description: string;
};

type AccentOption = {
  value: AccentTheme;
  label: string;
  color: string;
};

const DENSITY_OPTIONS: DensityOption[] = [
  {
    value: 'standard',
    label: 'Standardowa',
    description: 'Większe odstępy i wygodniejsza obsługa dotykowa.',
  },
  {
    value: 'compact',
    label: 'Kompaktowa',
    description: 'Mniejsza wysokość wierszy i bardziej zwarty układ.',
  },
  {
    value: 'very-compact',
    label: 'Bardzo kompaktowa',
    description: 'Minimalne odstępy i wygląd zbliżony do arkusza.',
  },
];

const ACCENT_OPTIONS: AccentOption[] = [
  {
    value: 'crimson',
    label: 'Crimson',
    color: '#dc143c',
  },
  {
    value: 'blue',
    label: 'Blue',
    color: '#3b82f6',
  },
  {
    value: 'emerald',
    label: 'Emerald',
    color: '#10b981',
  },
  {
    value: 'amber',
    label: 'Amber',
    color: '#f59e0b',
  },
  {
    value: 'violet',
    label: 'Violet',
    color: '#8b5cf6',
  },
];

const optionClasses =
  'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]';

export default function AppPreferencesPanel() {
  const { preferences, isLoading, isSaving, error, savePreference, resetPreferences } =
    useAppSettings();

  async function handleDensityChange(value: TableDensity) {
    if (value === preferences.tableDensity || isSaving) {
      return;
    }

    await savePreference('tableDensity', value);
  }

  async function handleAccentChange(value: AccentTheme) {
    if (value === preferences.accentTheme || isSaving) {
      return;
    }

    await savePreference('accentTheme', value);
  }

  async function handleReset() {
    if (isSaving) {
      return;
    }

    await resetPreferences();
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Preferencje aplikacji</h2>

          <p className="mt-1 text-sm text-zinc-500">Wygląd i zachowanie interfejsu CHB</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
          {isLoading || isSaving ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <Palette aria-hidden="true" className="size-5" />
          )}
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {error && <div className="app-notice app-notice-error">{error}</div>}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <LayoutGrid aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Gęstość tabel</h3>

              <p className="mt-0.5 text-xs text-zinc-500">
                Określa odstępy i wysokość wierszy w tabelach arkuszowych.
              </p>
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-3">
            {DENSITY_OPTIONS.map((option) => {
              const isSelected = preferences.tableDensity === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isLoading || isSaving}
                  aria-pressed={isSelected}
                  onClick={() => {
                    void handleDensityChange(option.value);
                  }}
                  className={`${optionClasses} ${
                    isSelected
                      ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
                      : 'border-zinc-700 bg-zinc-950/40 hover:border-zinc-600 hover:bg-zinc-950/65'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-[var(--app-accent)] bg-[var(--app-accent)] text-white'
                        : 'border-zinc-600 bg-zinc-950 text-transparent'
                    }`}
                  >
                    <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-semibold ${
                        isSelected ? 'text-[var(--app-accent)]' : 'text-zinc-200'
                      }`}
                    >
                      {option.label}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-zinc-500">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-700 pt-5">
          <div className="mb-3 flex items-center gap-2">
            <Palette aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Kolor akcentu</h3>

              <p className="mt-0.5 text-xs text-zinc-500">
                Zmiana jest stosowana natychmiast w całej aplikacji.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {ACCENT_OPTIONS.map((option) => {
              const isSelected = preferences.accentTheme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isLoading || isSaving}
                  aria-pressed={isSelected}
                  onClick={() => {
                    void handleAccentChange(option.value);
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
                    isSelected
                      ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
                      : 'border-zinc-700 bg-zinc-950/40 hover:border-zinc-600 hover:bg-zinc-950/65'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span
                    aria-hidden="true"
                    className="size-4 shrink-0 rounded-full border border-white/20"
                    style={{
                      backgroundColor: option.color,
                    }}
                  />

                  <span
                    className={`min-w-0 truncate text-xs font-semibold ${
                      isSelected ? 'text-[var(--app-accent)]' : 'text-zinc-300'
                    }`}
                  >
                    {option.label}
                  </span>

                  {isSelected && (
                    <Check
                      aria-hidden="true"
                      className="ml-auto size-3.5 shrink-0 text-[var(--app-accent)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-700 pt-5">
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-700 bg-zinc-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-300">Przywróć preferencje domyślne</p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Ustawia bardzo kompaktową tabelę i motyw Crimson.
              </p>
            </div>

            <button
              type="button"
              disabled={isLoading || isSaving}
              onClick={() => {
                void handleReset();
              }}
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-xs font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Przywróć
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
