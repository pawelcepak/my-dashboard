import { Clock3, Save, Target } from 'lucide-react';
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
  'h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700';

const labelClasses = 'mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-zinc-600';

const buttonClasses =
  'flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50';

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
      dailyMessagesTarget: parseNullableNumber(dailyMessagesTarget),
      weeklyMessagesTarget: parseNullableNumber(weeklyMessagesTarget),
      dailyHoursTarget: parseNullableNumber(dailyHoursTarget),
    });
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Szybka edycja</h2>

        <p className="mt-0.5 text-xs text-zinc-500">Najczęściej używane dane</p>
      </div>

      <div className="space-y-3 p-4">
        <form
          onSubmit={(event) => {
            void handleDaySubmit(event);
          }}
          className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
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

          <button type="submit" disabled={isSaving} className={`${buttonClasses} self-end`}>
            <Save aria-hidden="true" className="size-3.5" />
            Zapisz
          </button>
        </form>

        <form
          onSubmit={(event) => {
            void handleSessionSubmit(event);
          }}
          className="grid gap-2 border-t border-zinc-800 pt-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <label>
            <span className={labelClasses}>Początek bloku</span>

            <input
              type="time"
              value={sessionStart}
              onChange={(event) => setSessionStart(event.target.value)}
              className={inputClasses}
            />
          </label>

          <label>
            <span className={labelClasses}>Koniec bloku</span>

            <input
              type="time"
              value={sessionEnd}
              onChange={(event) => setSessionEnd(event.target.value)}
              className={inputClasses}
            />
          </label>

          <button type="submit" disabled={isSaving} className={`${buttonClasses} self-end`}>
            <Clock3 aria-hidden="true" className="size-3.5" />
            Dodaj blok
          </button>
        </form>

        <form
          onSubmit={(event) => {
            void handleGoalsSubmit(event);
          }}
          className="grid gap-2 border-t border-zinc-800 pt-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label>
            <span className={labelClasses}>Cel dzienny</span>

            <input
              type="number"
              min="0"
              step="1"
              value={dailyMessagesTarget}
              placeholder="—"
              onChange={(event) => setDailyMessagesTarget(event.target.value)}
              className={inputClasses}
            />
          </label>

          <label>
            <span className={labelClasses}>Cel tygodniowy</span>

            <input
              type="number"
              min="0"
              step="1"
              value={weeklyMessagesTarget}
              placeholder="—"
              onChange={(event) => setWeeklyMessagesTarget(event.target.value)}
              className={inputClasses}
            />
          </label>

          <label>
            <span className={labelClasses}>Godziny dziennie</span>

            <input
              type="number"
              min="0"
              step="0.1"
              value={dailyHoursTarget}
              placeholder="—"
              onChange={(event) => setDailyHoursTarget(event.target.value)}
              className={inputClasses}
            />
          </label>

          <button type="submit" disabled={isSaving} className={`${buttonClasses} self-end`}>
            <Target aria-hidden="true" className="size-3.5" />
            Cele
          </button>
        </form>
      </div>
    </section>
  );
}
