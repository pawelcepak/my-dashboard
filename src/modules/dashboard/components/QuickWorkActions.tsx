import { Beer, Clock3, Mail, Save, Star, Target } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import type {
  WorkDay,
  WorkSession,
  WorkWeek,
  WorkWeekGoals,
} from '@/modules/work/types/work.types';

type QuickWorkActionsProps = {
  day: WorkDay;
  week: WorkWeek;
  isSaving: boolean;
  onUpdateDay: (updatedDay: WorkDay) => Promise<void>;
  onUpdateGoals: (goals: WorkWeekGoals) => Promise<void>;
};

const inputClasses =
  'h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800';

const labelClasses = 'mb-2 flex items-center gap-2 text-sm font-medium text-zinc-400';

function parseNonNegativeInteger(value: string): number {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function parseNullableNonNegativeNumber(value: string): number | null {
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
  const parsedValue = parseNullableNonNegativeNumber(value);

  if (parsedValue === null) {
    return null;
  }

  const limitedValue = Math.min(10, parsedValue);

  return Math.round(limitedValue * 10) / 10;
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
    week.goals.dailyMessagesTarget === null ? '' : String(week.goals.dailyMessagesTarget)
  );

  const [weeklyMessagesTarget, setWeeklyMessagesTarget] = useState(
    week.goals.weeklyMessagesTarget === null ? '' : String(week.goals.weeklyMessagesTarget)
  );

  const [dailyHoursTarget, setDailyHoursTarget] = useState(
    week.goals.dailyHoursTarget === null ? '' : String(week.goals.dailyHoursTarget)
  );

  useEffect(() => {
    setMessages(String(day.messages));
    setWorkRating(day.workRating === null ? '' : String(day.workRating));
    setBeers(String(day.beers));
  }, [day.id, day.messages, day.workRating, day.beers]);

  useEffect(() => {
    setDailyMessagesTarget(
      week.goals.dailyMessagesTarget === null ? '' : String(week.goals.dailyMessagesTarget)
    );

    setWeeklyMessagesTarget(
      week.goals.weeklyMessagesTarget === null ? '' : String(week.goals.weeklyMessagesTarget)
    );

    setDailyHoursTarget(
      week.goals.dailyHoursTarget === null ? '' : String(week.goals.dailyHoursTarget)
    );
  }, [
    week.goals.dailyHoursTarget,
    week.goals.dailyMessagesTarget,
    week.goals.weeklyMessagesTarget,
  ]);

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

    await onUpdateGoals({
      dailyMessagesTarget: parseNullableNonNegativeNumber(dailyMessagesTarget),
      weeklyMessagesTarget: parseNullableNonNegativeNumber(weeklyMessagesTarget),
      dailyHoursTarget: parseNullableNonNegativeNumber(dailyHoursTarget),
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-zinc-100">Szybkie akcje</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Najczęściej zmieniane dane bieżącego dnia i tygodnia
        </p>
      </div>

      <div className="divide-y divide-zinc-800">
        <form
          onSubmit={(event) => {
            void handleDaySubmit(event);
          }}
          className="p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-zinc-200">Dzisiejsze dane</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label>
              <span className={labelClasses}>
                <Mail aria-hidden="true" className="size-4" />
                Wiadomości
              </span>

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
              <span className={labelClasses}>
                <Star aria-hidden="true" className="size-4" />
                Ocena
              </span>

              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={workRating}
                placeholder="8,5"
                onChange={(event) => setWorkRating(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>
                <Beer aria-hidden="true" className="size-4" />
                Piwa
              </span>

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

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Save aria-hidden="true" className="size-4" />

            {isSaving ? 'Zapisywanie…' : 'Zapisz dane dnia'}
          </button>
        </form>

        <form
          onSubmit={(event) => {
            void handleSessionSubmit(event);
          }}
          className="p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-zinc-200">Dodaj blok pracy</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClasses}>
                <Clock3 aria-hidden="true" className="size-4" />
                Początek
              </span>

              <input
                type="time"
                value={sessionStart}
                onChange={(event) => setSessionStart(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>
                <Clock3 aria-hidden="true" className="size-4" />
                Koniec
              </span>

              <input
                type="time"
                value={sessionEnd}
                onChange={(event) => setSessionEnd(event.target.value)}
                className={inputClasses}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Clock3 aria-hidden="true" className="size-4" />

            {isSaving ? 'Zapisywanie…' : 'Dodaj blok'}
          </button>
        </form>

        <form
          onSubmit={(event) => {
            void handleGoalsSubmit(event);
          }}
          className="p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-zinc-200">Cele pracy</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label>
              <span className={labelClasses}>
                <Target aria-hidden="true" className="size-4" />
                Wiadomości dziennie
              </span>

              <input
                type="number"
                min="0"
                step="1"
                value={dailyMessagesTarget}
                placeholder="Brak celu"
                onChange={(event) => setDailyMessagesTarget(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>
                <Target aria-hidden="true" className="size-4" />
                Wiadomości tygodniowo
              </span>

              <input
                type="number"
                min="0"
                step="1"
                value={weeklyMessagesTarget}
                placeholder="Brak celu"
                onChange={(event) => setWeeklyMessagesTarget(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label>
              <span className={labelClasses}>
                <Target aria-hidden="true" className="size-4" />
                Godziny dziennie
              </span>

              <input
                type="number"
                min="0"
                step="0.1"
                value={dailyHoursTarget}
                placeholder="Brak celu"
                onChange={(event) => setDailyHoursTarget(event.target.value)}
                className={inputClasses}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Save aria-hidden="true" className="size-4" />

            {isSaving ? 'Zapisywanie…' : 'Zapisz cele'}
          </button>
        </form>
      </div>
    </section>
  );
}
