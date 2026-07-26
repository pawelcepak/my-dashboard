import { Clock3, Save, Target } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import type {
  WorkDay,
  WorkSession,
  WorkWeek,
  WorkWeekGoals,
} from '@/modules/work/types/work.types';
import {
  formatGoalValue,
  synchronizeWorkGoals,
  type WorkGoalSource,
} from '@/modules/work/utils/workCalculations';

type QuickWorkActionsProps = {
  day: WorkDay;
  week: WorkWeek;
  isSaving: boolean;
  onUpdateDay: (updatedDay: WorkDay) => Promise<void>;
  onUpdateGoals: (goals: WorkWeekGoals) => Promise<void>;
};

const inputClasses =
  'h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 text-sm font-medium text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

const labelClasses =
  'mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500';

const buttonClasses =
  'flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] px-3 text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';

function parseNonNegativeInteger(value: string): number {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function parseNullableNumber(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsedValue = Number.parseFloat(value.replace(',', '.'));

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function parseWorkRating(value: string): number | null {
  const parsedValue = parseNullableNumber(value);

  if (parsedValue === null) {
    return null;
  }

  return Math.round(Math.min(10, parsedValue) * 10) / 10;
}

export default function QuickWorkActions({
  day,
  week,
  isSaving,
  onUpdateDay,
  onUpdateGoals,
}: QuickWorkActionsProps) {
  const [messages, setMessages] = useState(String(day.messages));

  const [workRating, setWorkRating] = useState(
    day.workRating === null ? '' : String(day.workRating)
  );

  const [beers, setBeers] = useState(String(day.beers));

  const [sessionStart, setSessionStart] = useState('08:00');

  const [sessionEnd, setSessionEnd] = useState('09:00');

  const [dailyMessagesTarget, setDailyMessagesTarget] = useState(
    formatGoalValue(week.goals.dailyMessagesTarget)
  );

  const [weeklyMessagesTarget, setWeeklyMessagesTarget] = useState(
    formatGoalValue(week.goals.weeklyMessagesTarget)
  );

  const [weeklyMessagesTarget5Days, setWeeklyMessagesTarget5Days] = useState(
    formatGoalValue(week.goals.weeklyMessagesTarget5Days)
  );

  const [dailyHoursTarget, setDailyHoursTarget] = useState(
    formatGoalValue(week.goals.dailyHoursTarget)
  );

  const [lastGoalSource, setLastGoalSource] = useState<WorkGoalSource>('weekly-7-days');

  useEffect(() => {
    setMessages(String(day.messages));

    setWorkRating(day.workRating === null ? '' : String(day.workRating));

    setBeers(String(day.beers));
  }, [day.id, day.messages, day.workRating, day.beers]);

  useEffect(() => {
    setDailyMessagesTarget(formatGoalValue(week.goals.dailyMessagesTarget));

    setWeeklyMessagesTarget(formatGoalValue(week.goals.weeklyMessagesTarget));

    setWeeklyMessagesTarget5Days(formatGoalValue(week.goals.weeklyMessagesTarget5Days));

    setDailyHoursTarget(formatGoalValue(week.goals.dailyHoursTarget));
  }, [
    week.goals.dailyHoursTarget,
    week.goals.dailyMessagesTarget,
    week.goals.weeklyMessagesTarget,
    week.goals.weeklyMessagesTarget5Days,
  ]);

  function synchronizeGoalFields(source: WorkGoalSource, value: string) {
    const sourceValue = parseNullableNumber(value);

    const synchronizedGoals = synchronizeWorkGoals(
      source,
      sourceValue,
      parseNullableNumber(dailyHoursTarget)
    );

    setDailyMessagesTarget(formatGoalValue(synchronizedGoals.dailyMessagesTarget));

    setWeeklyMessagesTarget(formatGoalValue(synchronizedGoals.weeklyMessagesTarget));

    setWeeklyMessagesTarget5Days(formatGoalValue(synchronizedGoals.weeklyMessagesTarget5Days));

    setLastGoalSource(source);
  }

  async function handleDaySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onUpdateDay({
      ...day,
      messages: parseNonNegativeInteger(messages),
      workRating: parseWorkRating(workRating),
      beers: parseNonNegativeInteger(beers),
    });
  }

  async function handleSessionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newSession: WorkSession = {
      id: crypto.randomUUID(),
      startTime: sessionStart,
      endTime: sessionEnd,
    };

    await onUpdateDay({
      ...day,
      sessions: [...day.sessions, newSession],
    });
  }

  async function handleGoalsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const sourceValue =
      lastGoalSource === 'daily'
        ? parseNullableNumber(dailyMessagesTarget)
        : lastGoalSource === 'weekly-7-days'
          ? parseNullableNumber(weeklyMessagesTarget)
          : parseNullableNumber(weeklyMessagesTarget5Days);

    const synchronizedGoals = synchronizeWorkGoals(
      lastGoalSource,
      sourceValue,
      parseNullableNumber(dailyHoursTarget)
    );

    await onUpdateGoals(synchronizedGoals);
  }

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Szybki wpis</h2>

        <p className="mt-0.5 text-xs text-zinc-500">Najczęściej zmieniane dane dnia i tygodnia</p>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
        <form
          onSubmit={(event) => {
            void handleDaySubmit(event);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300">Dzisiejsze dane</h3>

            <Save aria-hidden="true" className="size-4 text-zinc-500" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label>
              <span className={labelClasses}>Wiadomości</span>

              <input
                type="number"
                min="0"
                step="1"
                value={messages}
                onChange={(event) => setMessages(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>Ocena</span>

              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={workRating}
                onChange={(event) => setWorkRating(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>Piwa</span>

              <input
                type="number"
                min="0"
                step="1"
                value={beers}
                onChange={(event) => setBeers(event.target.value)}
                className={inputClasses}
              />
            </label>
          </div>

          <button type="submit" disabled={isSaving} className={`${buttonClasses} mt-3 w-full`}>
            <Save aria-hidden="true" className="size-3.5" />
            Zapisz dzień
          </button>
        </form>

        <form
          onSubmit={(event) => {
            void handleSessionSubmit(event);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300">Nowy blok pracy</h3>

            <Clock3 aria-hidden="true" className="size-4 text-zinc-500" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className={labelClasses}>Początek</span>

              <input
                type="time"
                value={sessionStart}
                onChange={(event) => setSessionStart(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>Koniec</span>

              <input
                type="time"
                value={sessionEnd}
                onChange={(event) => setSessionEnd(event.target.value)}
                className={inputClasses}
              />
            </label>
          </div>

          <button type="submit" disabled={isSaving} className={`${buttonClasses} mt-3 w-full`}>
            <Clock3 aria-hidden="true" className="size-3.5" />
            Dodaj blok
          </button>
        </form>

        <form
          onSubmit={(event) => {
            void handleGoalsSubmit(event);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-zinc-300">Cele pracy</h3>

              <p className="mt-0.5 text-[10px] text-zinc-500">
                Zmiana jednego celu przelicza dwa pozostałe
              </p>
            </div>

            <Target aria-hidden="true" className="size-4 text-zinc-500" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className={labelClasses}>Dzienny</span>

              <input
                type="text"
                inputMode="decimal"
                value={dailyMessagesTarget}
                placeholder="—"
                onChange={(event) => {
                  const value = event.target.value;

                  setDailyMessagesTarget(value);

                  synchronizeGoalFields('daily', value);
                }}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>Tydzień 7 dni</span>

              <input
                type="text"
                inputMode="decimal"
                value={weeklyMessagesTarget}
                placeholder="—"
                onChange={(event) => {
                  const value = event.target.value;

                  setWeeklyMessagesTarget(value);

                  synchronizeGoalFields('weekly-7-days', value);
                }}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>Tydzień 5 dni</span>

              <input
                type="text"
                inputMode="decimal"
                value={weeklyMessagesTarget5Days}
                placeholder="—"
                onChange={(event) => {
                  const value = event.target.value;

                  setWeeklyMessagesTarget5Days(value);

                  synchronizeGoalFields('weekly-5-days', value);
                }}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>Godziny dziennie</span>

              <input
                type="text"
                inputMode="decimal"
                value={dailyHoursTarget}
                placeholder="—"
                onChange={(event) => setDailyHoursTarget(event.target.value)}
                className={inputClasses}
              />
            </label>
          </div>

          <button type="submit" disabled={isSaving} className={`${buttonClasses} mt-3 w-full`}>
            <Target aria-hidden="true" className="size-3.5" />
            Zapisz cele
          </button>
        </form>
      </div>
    </section>
  );
}
