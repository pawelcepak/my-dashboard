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

type CompactMetricProps = {
  label: string;
  value: string;
  icon: typeof Mail;
  valueClassName?: string;
};

function CompactMetric({
  label,
  value,
  icon: Icon,
  valueClassName = 'text-zinc-100',
}: CompactMetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/55 px-3 py-2.5">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-zinc-600" />

      <div className="min-w-0">
        <p className="truncate text-[11px] uppercase tracking-wide text-zinc-600">{label}</p>

        <p className={`truncate text-sm font-semibold ${valueClassName}`}>{value}</p>
      </div>
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
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Dzisiaj</h2>

            <p className="mt-0.5 text-xs text-zinc-500">{dateLabel}</p>
          </div>

          <Link
            to="/work"
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-100"
          >
            Praca
          </Link>
        </div>

        <div className="flex min-h-36 flex-col items-center justify-center px-5 py-6 text-center">
          <MessageSquareText aria-hidden="true" className="size-5 text-zinc-600" />

          <p className="mt-3 text-sm font-medium text-zinc-300">
            {isInsideCurrentWeek
              ? 'Brak rekordu dzisiejszego dnia'
              : 'Dzień poza aktywnym tygodniem'}
          </p>

          <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-600">
            Nowy tydzień będzie można utworzyć w następnym etapie.
          </p>
        </div>
      </section>
    );
  }

  const workedHours = getDayWorkedHours(day);
  const messagesPerHour = getDayMessagesPerHour(day);
  const ratingPresentation = getWorkRatingPresentation(day.workRating);
  const beerPresentation = getBeerPresentation(day.beers);

  const ratingColor = ratingPresentation.className.includes('emerald')
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
              : 'text-zinc-400';

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Dzisiaj</h2>

          <p className="mt-0.5 text-xs text-zinc-500">{dateLabel}</p>
        </div>

        <Link
          to="/work"
          className="text-xs font-medium text-zinc-500 transition hover:text-zinc-100"
        >
          Szczegóły
        </Link>
      </div>

      <div className="p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <CompactMetric label="Wiadomości" value={formatNumber(day.messages)} icon={Mail} />

          <CompactMetric label="Czas" value={`${formatHours(workedHours)} h`} icon={Clock3} />

          <CompactMetric
            label="Średnia"
            value={workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
            icon={Gauge}
          />

          <CompactMetric
            label="Ocena"
            value={formatWorkRating(day.workRating)}
            icon={Star}
            valueClassName={ratingColor}
          />

          <CompactMetric
            label="Piwa"
            value={String(day.beers)}
            icon={Beer}
            valueClassName={day.beers === 0 ? 'text-emerald-300' : 'text-red-300'}
          />

          <CompactMetric
            label="Bloki"
            value={String(day.sessions.length)}
            icon={MessageSquareText}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${ratingPresentation.className}`}
          >
            {ratingPresentation.label}
          </span>

          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${beerPresentation.className}`}
          >
            {day.beers === 0 ? 'Bez alkoholu' : `${day.beers} piw`}
          </span>

          {day.sessions.map((session) => (
            <span
              key={session.id}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-500"
            >
              {session.startTime}–{session.endTime}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
