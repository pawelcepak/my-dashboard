import { CalendarPlus, Check, ChevronDown, Copy, Trash2 } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';

import type { WorkWeek, WorkWeekCreateOptions } from '@/modules/work/types/work.types';
import { formatIsoDate } from '@/modules/work/utils/workCalculations';
import {
  formatWorkWeekLabel,
  getIsoWeekInformation,
  getIsoWeeksInYear,
} from '@/modules/work/utils/workWeekDate';

type WorkWeekManagerProps = {
  activeWeek: WorkWeek;
  weeks: WorkWeek[];
  isSaving: boolean;
  onSelectWeek: (workWeekId: string) => Promise<void>;
  onCreateWeek: (options: WorkWeekCreateOptions) => Promise<WorkWeek | undefined>;
  onDeleteWeek: (workWeekId: string) => Promise<void>;
};

const inputClasses =
  'h-8 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

export default function WorkWeekManager({
  activeWeek,
  weeks,
  isSaving,
  onSelectWeek,
  onCreateWeek,
  onDeleteWeek,
}: WorkWeekManagerProps) {
  const currentIsoWeek = useMemo(() => getIsoWeekInformation(), []);

  const [isCreationOpen, setIsCreationOpen] = useState(false);

  const [year, setYear] = useState(currentIsoWeek.year);

  const [weekNumber, setWeekNumber] = useState(currentIsoWeek.weekNumber);

  const [copySettings, setCopySettings] = useState(true);

  const [localError, setLocalError] = useState<string | null>(null);

  const maximumWeekNumber = getIsoWeeksInYear(year);

  async function handleCreateWeek(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    try {
      await onCreateWeek({
        year,
        weekNumber,
        copySettingsFromWeekId: copySettings ? activeWeek.id : null,
      });

      setIsCreationOpen(false);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Nie udało się utworzyć tygodnia.');
    }
  }

  async function handleDeleteWeek() {
    setLocalError(null);

    if (weeks.length <= 1) {
      setLocalError('Nie można usunąć ostatniego tygodnia w bazie.');

      return;
    }

    const weekLabel = formatWorkWeekLabel(activeWeek.year, activeWeek.weekNumber);

    const firstConfirmation = window.confirm(
      `USUWANIE TYGODNIA\n\n${weekLabel}\n${formatIsoDate(activeWeek.startDate)} – ${formatIsoDate(
        activeWeek.endDate
      )}\n\nUsunięte zostaną wszystkie wiadomości, bloki pracy, oceny, piwa, cele i plan finansowy tego tygodnia.\n\nPrzed kontynuowaniem upewnij się, że masz aktualny backup JSON.\n\nCzy przejść do końcowego potwierdzenia?`
    );

    if (!firstConfirmation) {
      return;
    }

    const requiredText = `USUŃ ${weekLabel}`;

    const providedText = window.prompt(
      `Aby trwale usunąć tydzień, wpisz dokładnie:\n\n${requiredText}`
    );

    if (providedText !== requiredText) {
      if (providedText !== null) {
        setLocalError('Usuwanie anulowano. Wpisany tekst potwierdzenia był nieprawidłowy.');
      }

      return;
    }

    try {
      await onDeleteWeek(activeWeek.id);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Nie udało się usunąć tygodnia.');
    }
  }

  return (
    <section className="relative w-full">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <label className="relative min-w-[11rem] flex-1 sm:max-w-[15rem]">
          <span className="sr-only">Wybierz tydzień</span>

          <select
            value={activeWeek.id}
            disabled={isSaving}
            onChange={(event) => {
              void onSelectWeek(event.target.value);
            }}
            className={`${inputClasses} appearance-none pr-8 text-xs font-semibold`}
          >
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                {formatWorkWeekLabel(week.year, week.weekNumber)} · {formatIsoDate(week.startDate)}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-2 right-2.5 size-3.5 text-zinc-500"
          />
        </label>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => setIsCreationOpen((currentValue) => !currentValue)}
          className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] px-2.5 text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarPlus aria-hidden="true" className="size-3.5" />
          Nowy
        </button>

        <button
          type="button"
          disabled={isSaving || weeks.length <= 1}
          onClick={() => {
            void handleDeleteWeek();
          }}
          className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-800 bg-red-950/30 px-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
          Usuń
        </button>
      </div>

      {isCreationOpen && (
        <form
          onSubmit={(event) => {
            void handleCreateWeek(event);
          }}
          className="absolute right-0 top-10 z-20 w-full min-w-[20rem] rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl sm:w-[42rem]"
        >
          <div className="grid gap-2 sm:grid-cols-[7rem_7rem_minmax(15rem,1fr)_auto] sm:items-end">
            <label>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Rok
              </span>

              <input
                type="number"
                min="2020"
                max="2100"
                value={year}
                onChange={(event) => {
                  const newYear = Number(event.target.value);

                  setYear(newYear);

                  const newMaximum = getIsoWeeksInYear(newYear);

                  setWeekNumber((currentWeekNumber) => Math.min(currentWeekNumber, newMaximum));
                }}
                className={inputClasses}
              />
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Tydzień
              </span>

              <input
                type="number"
                min="1"
                max={maximumWeekNumber}
                value={weekNumber}
                onChange={(event) => setWeekNumber(Number(event.target.value))}
                className={inputClasses}
              />
            </label>

            <label className="flex min-h-8 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3">
              <input
                type="checkbox"
                checked={copySettings}
                onChange={(event) => setCopySettings(event.target.checked)}
                className="size-4 accent-[var(--app-accent)]"
              />

              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <Copy aria-hidden="true" className="size-4 text-zinc-500" />
                Skopiuj kurs, cele i plan z aktywnego tygodnia
              </span>
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[var(--app-accent)] px-4 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check aria-hidden="true" className="size-4" />

              {isSaving ? 'Tworzenie…' : 'Utwórz'}
            </button>
          </div>
        </form>
      )}

      {localError && (
        <div className="border-t border-zinc-700 px-4 py-3">
          <p className="text-sm font-medium text-red-300">{localError}</p>
        </div>
      )}
    </section>
  );
}
