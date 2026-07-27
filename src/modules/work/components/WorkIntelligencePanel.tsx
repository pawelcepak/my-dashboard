import { Beer, Gauge, Lightbulb, Star, Trophy } from 'lucide-react';

import MessagesPerHourIndicator from '@/modules/work/components/MessagesPerHourIndicator';
import type { WorkDay, WorkWeek } from '@/modules/work/types/work.types';
import {
  formatDecimal,
  formatHours,
  formatShortIsoDate,
  getDayMessagesPerHour,
  getDayTotalMessages,
  getDayWorkedHours,
} from '@/modules/work/utils/workCalculations';

type WorkIntelligencePanelProps = {
  week: WorkWeek;
};

type CompletedDay = {
  day: WorkDay;
  hours: number;
  messagesPerHour: number;
  totalMessages: number;
};

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatOptionalDecimal(value: number | null): string {
  return value === null ? '—' : formatDecimal(value);
}

function createCompletedDays(week: WorkWeek): CompletedDay[] {
  return week.days
    .map((day) => {
      const hours = getDayWorkedHours(day);

      return {
        day,
        hours,
        totalMessages: getDayTotalMessages(day),
        messagesPerHour: hours > 0 ? getDayMessagesPerHour(day) : 0,
      };
    })
    .filter((entry) => entry.hours > 0 || entry.totalMessages > 0);
}

export default function WorkIntelligencePanel({ week }: WorkIntelligencePanelProps) {
  const completedDays = createCompletedDays(week);

  const daysWithMeasuredRate = completedDays.filter(
    (entry) => entry.hours > 0 && entry.totalMessages > 0
  );

  const bestDay = [...daysWithMeasuredRate].sort(
    (firstDay, secondDay) => secondDay.messagesPerHour - firstDay.messagesPerHour
  )[0];

  const alcoholFreeDays = daysWithMeasuredRate.filter((entry) => entry.day.beers === 0);

  const beerDays = daysWithMeasuredRate.filter((entry) => entry.day.beers > 0);

  const alcoholFreeAverage = average(alcoholFreeDays.map((entry) => entry.messagesPerHour));

  const beerDaysAverage = average(beerDays.map((entry) => entry.messagesPerHour));

  const ratedDays = completedDays.filter((entry) => entry.day.workRating !== null);

  const averageRating = average(
    ratedDays.flatMap((entry) => (entry.day.workRating === null ? [] : [entry.day.workRating]))
  );

  const averageDailyHours = average(
    completedDays.filter((entry) => entry.hours > 0).map((entry) => entry.hours)
  );

  const maximumRate = Math.max(1, ...daysWithMeasuredRate.map((entry) => entry.messagesPerHour));

  const rateDifference =
    alcoholFreeAverage !== null && beerDaysAverage !== null
      ? alcoholFreeAverage - beerDaysAverage
      : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-4 py-3.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-100">CHB Intelligence</h2>

            <span className="rounded-full border border-amber-800 bg-amber-950/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">
              Eksperymentalne
            </span>
          </div>

          <p className="mt-0.5 text-xs text-zinc-500">
            Wstępne obserwacje na podstawie danych aktywnego tygodnia
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
          <Lightbulb aria-hidden="true" className="size-4" />
        </div>
      </div>

      {completedDays.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-semibold text-zinc-300">Za mało danych do analizy</p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Uzupełnij wiadomości i bloki czasu dla przynajmniej jednego dnia.
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-zinc-700 bg-zinc-950/45 p-3.5">
              <div className="flex items-center gap-2">
                <Trophy aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Najlepszy dzień
                </p>
              </div>

              <p className="mt-2 text-lg font-bold text-zinc-100">
                {bestDay ? formatShortIsoDate(bestDay.day.date) : '—'}
              </p>

              <div className="mt-1">
                <MessagesPerHourIndicator value={bestDay?.messagesPerHour ?? null} compact />
              </div>
            </article>

            <article className="rounded-xl border border-zinc-700 bg-zinc-950/45 p-3.5">
              <div className="flex items-center gap-2">
                <Star aria-hidden="true" className="size-4 text-zinc-500" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Średnia ocena
                </p>
              </div>

              <p className="mt-2 text-lg font-bold text-zinc-100">
                {formatOptionalDecimal(averageRating)}
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">Na podstawie {ratedDays.length} dni</p>
            </article>

            <article className="rounded-xl border border-zinc-700 bg-zinc-950/45 p-3.5">
              <div className="flex items-center gap-2">
                <Gauge aria-hidden="true" className="size-4 text-zinc-500" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Średni dzień pracy
                </p>
              </div>

              <p className="mt-2 text-lg font-bold text-zinc-100">
                {averageDailyHours === null ? '—' : `${formatHours(averageDailyHours)} h`}
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">Dni z zapisanym czasem</p>
            </article>

            <article className="rounded-xl border border-zinc-700 bg-zinc-950/45 p-3.5">
              <div className="flex items-center gap-2">
                <Beer aria-hidden="true" className="size-4 text-zinc-500" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Różnica obserwowana
                </p>
              </div>

              <p
                className={`mt-2 text-lg font-bold ${
                  rateDifference === null
                    ? 'text-zinc-500'
                    : rateDifference >= 0
                      ? 'text-emerald-400'
                      : 'text-red-400'
                }`}
              >
                {rateDifference === null
                  ? '—'
                  : `${rateDifference >= 0 ? '+' : ''}${formatDecimal(rateDifference)}/h`}
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">Bez piw względem dni z piwami</p>
            </article>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)]">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-300">Wydajność według dnia</h3>

                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    Zatrzymane i płatne wiadomości na godzinę
                  </p>
                </div>

                <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
                  {daysWithMeasuredRate.length} dni
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {[...daysWithMeasuredRate].reverse().map((entry) => {
                  const barPercentage = Math.max(2, (entry.messagesPerHour / maximumRate) * 100);

                  return (
                    <div
                      key={entry.day.id}
                      className="grid grid-cols-[3.25rem_minmax(0,1fr)_4rem] items-center gap-2"
                    >
                      <span className="text-[10px] font-semibold text-zinc-500">
                        {formatShortIsoDate(entry.day.date)}
                      </span>

                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-[var(--app-accent)]"
                          style={{
                            width: `${barPercentage}%`,
                          }}
                        />
                      </div>

                      <MessagesPerHourIndicator
                        value={entry.messagesPerHour}
                        compact
                        className="justify-end text-[10px]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3.5">
              <h3 className="text-xs font-semibold text-zinc-300">Piwa a tempo</h3>

              <p className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                Wyniki są orientacyjne. Przy małej liczbie dni mogą być niestabilne i nie oznaczają
                związku przyczynowego.
              </p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2.5">
                  <span className="text-xs font-medium text-zinc-500">Dni bez piw</span>

                  <span className="text-sm font-bold text-emerald-400">
                    {formatOptionalDecimal(alcoholFreeAverage)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2.5">
                  <span className="text-xs font-medium text-zinc-500">Dni z piwami</span>

                  <span className="text-sm font-bold text-red-400">
                    {formatOptionalDecimal(beerDaysAverage)}
                  </span>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                    Próba
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-400">
                    {alcoholFreeDays.length} dni bez piw
                    {' · '}
                    {beerDays.length} dni z piwami
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
