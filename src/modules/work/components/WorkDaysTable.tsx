import { Clock3 } from 'lucide-react';

import type { WorkDay } from '@/modules/work/types/work.types';
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
};

export default function WorkDaysTable({ days }: WorkDaysTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-zinc-100">Dni tygodnia</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Wiadomości, czas pracy oraz dodatkowe statystyki
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-600">
              <th className="px-5 py-3 font-medium sm:px-6">Data</th>
              <th className="px-4 py-3 font-medium">Piwa</th>
              <th className="px-4 py-3 font-medium">Ocena</th>
              <th className="px-4 py-3 font-medium">Wiadomości</th>
              <th className="px-4 py-3 font-medium">Godziny</th>
              <th className="px-4 py-3 font-medium">Średnia/h</th>
              <th className="px-4 py-3 font-medium">Bloki</th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => {
              const workedHours = getDayWorkedHours(day);
              const messagesPerHour = getDayMessagesPerHour(day);

              return (
                <tr
                  key={day.id}
                  className="border-b border-zinc-800/70 last:border-b-0 hover:bg-zinc-900"
                >
                  <td className="px-5 py-4 text-sm font-medium text-zinc-200 sm:px-6">
                    {formatShortIsoDate(day.date)}
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-400">{day.beers}</td>

                  <td className="px-4 py-4 text-sm text-zinc-400">{day.workRating ?? '—'}</td>

                  <td className="px-4 py-4 text-sm font-medium text-zinc-200">
                    {formatNumber(day.messages)}
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-400">{formatHours(workedHours)}</td>

                  <td className="px-4 py-4 text-sm text-zinc-400">
                    {workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-400">{day.sessions.length}</td>
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

          return (
            <article key={day.id} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-zinc-200">{formatShortIsoDate(day.date)}</p>

                <span className="text-sm font-medium text-zinc-300">
                  {formatNumber(day.messages)} wiadomości
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-zinc-600">Piwa</dt>

                  <dd className="mt-1 text-zinc-300">{day.beers}</dd>
                </div>

                <div>
                  <dt className="text-zinc-600">Ocena pracy</dt>

                  <dd className="mt-1 text-zinc-300">{day.workRating ?? '—'}</dd>
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
