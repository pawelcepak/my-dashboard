import { Clock3, Pencil } from 'lucide-react';

import type { WorkDay } from '@/modules/work/types/work.types';
import {
  formatWorkRating,
  getBeerPresentation,
  getWorkRatingPresentation,
} from '@/modules/work/utils/workPresentation';
import {
  formatDecimal,
  formatHours,
  formatNumber,
  formatShortIsoDate,
  getDayMessagesPerHour,
  getDayWorkedHours,
} from '@/modules/work/utils/workCalculations';

type WorkDaysTableProps = {
  days: WorkDay[];
  selectedDayId: string | null;
  onEditDay: (dayId: string) => void;
};

export default function WorkDaysTable({ days, selectedDayId, onEditDay }: WorkDaysTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-zinc-100">Dni tygodnia</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Wybierz dzień, aby zmienić wiadomości, ocenę albo bloki pracy.
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-600">
              <th className="px-5 py-3 font-medium sm:px-6">Data</th>

              <th className="px-4 py-3 font-medium">Piwa</th>
              <th className="px-4 py-3 font-medium">Ocena</th>
              <th className="px-4 py-3 font-medium">Wiadomości</th>
              <th className="px-4 py-3 font-medium">Godziny</th>
              <th className="px-4 py-3 font-medium">Średnia/h</th>
              <th className="px-4 py-3 font-medium">Bloki</th>

              <th className="px-5 py-3 text-right font-medium sm:px-6">Akcja</th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => {
              const workedHours = getDayWorkedHours(day);
              const messagesPerHour = getDayMessagesPerHour(day);
              const isSelected = selectedDayId === day.id;

              const ratingPresentation = getWorkRatingPresentation(day.workRating);

              const beerPresentation = getBeerPresentation(day.beers);

              return (
                <tr
                  key={day.id}
                  className={`border-b border-zinc-800/70 last:border-b-0 ${
                    isSelected ? 'bg-zinc-800/70' : 'hover:bg-zinc-900'
                  }`}
                >
                  <td className="px-5 py-4 text-sm font-medium text-zinc-200 sm:px-6">
                    {formatShortIsoDate(day.date)}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex min-w-10 justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${beerPresentation.className}`}
                    >
                      {day.beers}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <span
                      title={ratingPresentation.label}
                      className={`inline-flex min-w-12 justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${ratingPresentation.className}`}
                    >
                      {formatWorkRating(day.workRating)}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-zinc-200">
                    {formatNumber(day.messages)}
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-400">{formatHours(workedHours)}</td>

                  <td className="px-4 py-4 text-sm text-zinc-400">
                    {workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-400">{day.sessions.length}</td>

                  <td className="px-5 py-4 text-right sm:px-6">
                    <button
                      type="button"
                      onClick={() => onEditDay(day.id)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-700 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      Edytuj
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-zinc-800 md:hidden">
        {days.map((day) => {
          const workedHours = getDayWorkedHours(day);
          const messagesPerHour = getDayMessagesPerHour(day);
          const isSelected = selectedDayId === day.id;

          const ratingPresentation = getWorkRatingPresentation(day.workRating);

          const beerPresentation = getBeerPresentation(day.beers);

          return (
            <article key={day.id} className={isSelected ? 'bg-zinc-800/60 p-5' : 'p-5'}>
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-zinc-200">{formatShortIsoDate(day.date)}</p>

                <span className="text-sm font-medium text-zinc-300">
                  {formatNumber(day.messages)} wiadomości
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-zinc-600">Piwa</dt>

                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${beerPresentation.className}`}
                    >
                      {day.beers === 0 ? '0 · bez alkoholu' : `${day.beers} · alkohol`}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-600">Ocena pracy</dt>

                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${ratingPresentation.className}`}
                    >
                      {formatWorkRating(day.workRating)}
                      {day.workRating !== null ? ` · ${ratingPresentation.label}` : ''}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-600">Czas</dt>

                  <dd className="mt-1 flex items-center gap-1.5 text-zinc-300">
                    <Clock3 aria-hidden="true" className="size-4 text-zinc-500" />
                    {formatHours(workedHours)} godz.
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-600">Średnia/h</dt>

                  <dd className="mt-1 text-zinc-300">
                    {workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
                  </dd>
                </div>
              </dl>

              {day.sessions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {day.sessions.map((session) => (
                    <span
                      key={session.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-400"
                    >
                      {session.startTime}–{session.endTime}
                    </span>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => onEditDay(day.id)}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-100"
              >
                <Pencil aria-hidden="true" className="size-4" />
                Edytuj dzień
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
