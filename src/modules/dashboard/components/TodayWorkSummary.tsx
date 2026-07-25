import { Beer, Clock3, Gauge, Mail, MessageSquareText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { WorkDay } from '@/modules/work/types/work.types';
import {
  formatDecimal,
  formatHours,
  formatNumber,
  getDayMessagesPerHour,
  getDayWorkedHours,
} from '@/modules/work/utils/workCalculations';
import {
  formatWorkRating,
  getBeerPresentation,
  getWorkRatingPresentation,
} from '@/modules/work/utils/workPresentation';

type TodayWorkSummaryProps = {
  dateLabel: string;
  day: WorkDay | undefined;
  isInsideCurrentWeek: boolean;
};

type SummaryMetricProps = {
  label: string;
  value: string;
  icon: typeof Mail;
  valueClassName?: string;
};

function SummaryMetric({
  label,
  value,
  icon: Icon,
  valueClassName = 'text-zinc-100',
}: SummaryMetricProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon aria-hidden="true" className="size-4" />

        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>

      <p className={`mt-3 text-xl font-semibold tracking-tight ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function TodayWorkSummary({
  dateLabel,
  day,
  isInsideCurrentWeek,
}: TodayWorkSummaryProps) {
  if (!day) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-zinc-100">Dzisiaj</h2>

          <p className="mt-1 text-sm text-zinc-500">{dateLabel}</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 px-6 py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
              <MessageSquareText aria-hidden="true" className="size-5" />
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-300">
              {isInsideCurrentWeek
                ? 'Brak rekordu dla dzisiejszego dnia'
                : 'Dzisiejsza data nie należy do aktywnego tygodnia'}
            </p>

            <p className="mt-1 max-w-md text-sm leading-6 text-zinc-500">
              {isInsideCurrentWeek
                ? 'Rekord dnia zostanie utworzony wraz z mechanizmem tworzenia i zarządzania tygodniami.'
                : 'Po utworzeniu nowego aktywnego tygodnia Dashboard automatycznie odnajdzie właściwy dzień.'}
            </p>

            <Link
              to="/work"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-700 hover:text-zinc-100"
            >
              Otwórz moduł Praca
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const workedHours = getDayWorkedHours(day);
  const messagesPerHour = getDayMessagesPerHour(day);

  const beerPresentation = getBeerPresentation(day.beers);
  const ratingPresentation = getWorkRatingPresentation(day.workRating);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex flex-col gap-3 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Dzisiaj</h2>

          <p className="mt-1 text-sm text-zinc-500">{dateLabel}</p>
        </div>

        <Link
          to="/work"
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
        >
          Pełne szczegóły
        </Link>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryMetric label="Wiadomości" value={formatNumber(day.messages)} icon={Mail} />

          <SummaryMetric
            label="Czas pracy"
            value={`${formatHours(workedHours)} godz.`}
            icon={Clock3}
          />

          <SummaryMetric
            label="Średnia na godzinę"
            value={workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
            icon={Gauge}
          />

          <SummaryMetric
            label="Ocena pracy"
            value={formatWorkRating(day.workRating)}
            icon={Star}
            valueClassName={
              ratingPresentation.className.includes('emerald')
                ? 'text-emerald-300'
                : ratingPresentation.className.includes('lime')
                  ? 'text-lime-300'
                  : ratingPresentation.className.includes('sky')
                    ? 'text-sky-300'
                    : ratingPresentation.className.includes('blue')
                      ? 'text-blue-300'
                      : ratingPresentation.className.includes('amber')
                        ? 'text-amber-300'
                        : ratingPresentation.className.includes('red')
                          ? 'text-red-300'
                          : 'text-zinc-400'
            }
          />

          <SummaryMetric
            label="Piwa"
            value={String(day.beers)}
            icon={Beer}
            valueClassName={day.beers === 0 ? 'text-emerald-300' : 'text-red-300'}
          />

          <SummaryMetric
            label="Bloki pracy"
            value={String(day.sessions.length)}
            icon={MessageSquareText}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${ratingPresentation.className}`}
          >
            Ocena: {ratingPresentation.label}
          </span>

          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${beerPresentation.className}`}
          >
            {day.beers === 0 ? 'Dzień bez alkoholu' : `${day.beers} piw`}
          </span>
        </div>

        {day.sessions.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Dzisiejsze bloki
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {day.sessions.map((session) => (
                <span
                  key={session.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400"
                >
                  {session.startTime}–{session.endTime}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
