import { Clock3, MessageSquareMore, Pencil } from 'lucide-react';

import MessagesPerHourIndicator from '@/modules/work/components/MessagesPerHourIndicator';
import type { WorkDay } from '@/modules/work/types/work.types';
import {
  formatHours,
  formatNumber,
  formatShortIsoDate,
  getDayMessagesPerHour,
  getDayWorkedHours,
} from '@/modules/work/utils/workCalculations';
import {
  formatWorkRating,
  getBeerPresentation,
  getWorkRatingPresentation,
} from '@/modules/work/utils/workPresentation';

type WorkDaysTableProps = {
  days: WorkDay[];
  heldMessages: number;
  selectedDayId: string | null;
  onEditDay: (dayId: string) => void;
};

export default function WorkDaysTable({
  days,
  heldMessages,
  selectedDayId,
  onEditDay,
}: WorkDaysTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex flex-col gap-3 border-b border-zinc-700 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-100">Historia aktywnego tygodnia</h2>

          <p className="mt-0.5 text-xs text-zinc-500">Siedem dni pracy w kompaktowym układzie.</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/55 px-3 py-2">
          <MessageSquareMore
            aria-hidden="true"
            className="size-4 text-[var(--app-accent)]"
            strokeWidth={1.9}
          />

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">
              Zatrzymane — tydzień
            </p>

            <p className="text-sm font-bold text-[var(--app-accent)]">
              {formatNumber(heldMessages)}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] table-auto border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-950/30 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">
              <th className="w-[7.5rem] whitespace-nowrap px-3 py-2.5 font-bold">Data</th>

              <th className="w-[4.5rem] whitespace-nowrap px-2 py-2.5 text-center font-bold">
                Piwa
              </th>

              <th className="w-[5rem] whitespace-nowrap px-2 py-2.5 text-center font-bold">
                Ocena
              </th>

              <th className="w-[7rem] whitespace-nowrap px-2 py-2.5 text-right font-bold">
                Wiadomości
              </th>

              <th className="w-[5.5rem] whitespace-nowrap px-2 py-2.5 text-right font-bold">
                Godziny
              </th>

              <th className="w-[6.5rem] whitespace-nowrap px-2 py-2.5 text-right font-bold">
                Średnia/h
              </th>

              <th className="w-[4rem] whitespace-nowrap px-2 py-2.5 text-center font-bold">
                Bloki
              </th>

              <th className="w-[3.5rem] px-3 py-2.5 text-right font-bold">
                <span className="sr-only">Akcja</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => {
              const workedHours = getDayWorkedHours(day);

              const messagesPerHour = workedHours > 0 ? getDayMessagesPerHour(day) : null;

              const isSelected = selectedDayId === day.id;

              const ratingPresentation = getWorkRatingPresentation(day.workRating);

              const beerPresentation = getBeerPresentation(day.beers);

              return (
                <tr
                  key={day.id}
                  className={`border-b border-zinc-700/70 transition last:border-b-0 ${
                    isSelected ? 'bg-[var(--app-accent-soft)]' : 'hover:bg-zinc-950/35'
                  }`}
                >
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold text-zinc-200">
                    {formatShortIsoDate(day.date)}
                  </td>

                  <td className="px-2 py-2.5 text-center">
                    <span
                      title={beerPresentation.label}
                      className={`inline-flex min-w-8 justify-center rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${beerPresentation.className}`}
                    >
                      {day.beers}
                    </span>
                  </td>

                  <td className="px-2 py-2.5 text-center">
                    <span
                      title={ratingPresentation.label}
                      className={`inline-flex min-w-10 justify-center rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${ratingPresentation.className}`}
                    >
                      {formatWorkRating(day.workRating)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-xs font-bold text-[var(--app-accent)]">
                    {formatNumber(day.messages)}
                  </td>

                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-xs font-semibold text-zinc-300">
                    {formatHours(workedHours)}
                  </td>

                  <td className="whitespace-nowrap px-2 py-2.5 text-right">
                    <MessagesPerHourIndicator
                      value={messagesPerHour}
                      compact
                      className="justify-end text-xs"
                    />
                  </td>

                  <td className="px-2 py-2.5 text-center text-xs font-bold text-zinc-300">
                    {day.sessions.length}
                  </td>

                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      aria-label={`Edytuj dzień ${formatShortIsoDate(day.date)}`}
                      title={`Edytuj dzień ${formatShortIsoDate(day.date)}`}
                      onClick={() => onEditDay(day.id)}
                      className={`inline-flex size-8 items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] ${
                        isSelected
                          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]'
                          : 'border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <Pencil aria-hidden="true" className="size-3.5" strokeWidth={1.9} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-zinc-700 md:hidden">
        {days.map((day) => {
          const workedHours = getDayWorkedHours(day);

          const messagesPerHour = workedHours > 0 ? getDayMessagesPerHour(day) : null;

          const isSelected = selectedDayId === day.id;

          const ratingPresentation = getWorkRatingPresentation(day.workRating);

          const beerPresentation = getBeerPresentation(day.beers);

          return (
            <article
              key={day.id}
              className={`p-4 ${isSelected ? 'bg-[var(--app-accent-soft)]' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-zinc-100">
                    {formatShortIsoDate(day.date)}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-[var(--app-accent)]">
                    {formatNumber(day.messages)} wiadomości
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`Edytuj dzień ${formatShortIsoDate(day.date)}`}
                  title={`Edytuj dzień ${formatShortIsoDate(day.date)}`}
                  onClick={() => onEditDay(day.id)}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition ${
                    isSelected
                      ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Pencil aria-hidden="true" className="size-4" strokeWidth={1.9} />
                </button>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-zinc-700 bg-zinc-950/35 px-2.5 py-2">
                  <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Piwa
                  </dt>

                  <dd className="mt-1">
                    <span
                      className={`inline-flex min-w-8 justify-center rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${beerPresentation.className}`}
                    >
                      {day.beers}
                    </span>
                  </dd>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-950/35 px-2.5 py-2">
                  <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Ocena
                  </dt>

                  <dd className="mt-1">
                    <span
                      title={ratingPresentation.label}
                      className={`inline-flex min-w-10 justify-center rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${ratingPresentation.className}`}
                    >
                      {formatWorkRating(day.workRating)}
                    </span>
                  </dd>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-950/35 px-2.5 py-2">
                  <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Czas
                  </dt>

                  <dd className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <Clock3 aria-hidden="true" className="size-3.5 text-zinc-500" />
                    {formatHours(workedHours)} h
                  </dd>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-950/35 px-2.5 py-2">
                  <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Średnia/h
                  </dt>

                  <dd className="mt-1">
                    <MessagesPerHourIndicator value={messagesPerHour} compact className="text-xs" />
                  </dd>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-950/35 px-2.5 py-2">
                  <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Bloki
                  </dt>

                  <dd className="mt-1 text-xs font-bold text-zinc-300">{day.sessions.length}</dd>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-950/35 px-2.5 py-2">
                  <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Zatrzymane
                  </dt>

                  <dd className="mt-1 text-xs font-bold text-[var(--app-accent)]">
                    Tydzień: {formatNumber(heldMessages)}
                  </dd>
                </div>
              </dl>

              {day.sessions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {day.sessions.map((session) => (
                    <span
                      key={session.id}
                      className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] font-medium text-zinc-400"
                    >
                      {session.startTime}–{session.endTime}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
