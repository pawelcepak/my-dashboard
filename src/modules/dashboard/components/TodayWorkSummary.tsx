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

type MainMetricProps = {
  label: string;
  value: string;
  icon: typeof Mail;
  accent?: boolean;
};

function MainMetric({ label, value, icon: Icon, accent = false }: MainMetricProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        accent
          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
          : 'border-zinc-700 bg-zinc-950/55'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          aria-hidden="true"
          className={`size-4 ${accent ? 'text-[var(--app-accent)]' : 'text-zinc-500'}`}
        />

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 text-2xl font-bold tracking-tight ${
          accent ? 'text-[var(--app-accent)]' : 'text-zinc-100'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

type SecondaryMetricProps = {
  label: string;
  value: string;
  icon: typeof Mail;
  valueClassName?: string;
};

function SecondaryMetric({
  label,
  value,
  icon: Icon,
  valueClassName = 'text-zinc-200',
}: SecondaryMetricProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />

        <span className="truncate text-xs font-medium text-zinc-500">{label}</span>
      </div>

      <span className={`shrink-0 text-sm font-bold ${valueClassName}`}>{value}</span>
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
      <section className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Dzisiaj</h2>

            <p className="mt-0.5 text-xs text-zinc-500">{dateLabel}</p>
          </div>

          <Link
            to="/work"
            className="text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110"
          >
            Otwórz Pracę
          </Link>
        </div>

        <div className="flex min-h-52 flex-col items-center justify-center px-5 py-7 text-center">
          <MessageSquareText aria-hidden="true" className="size-6 text-zinc-500" />

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            {isInsideCurrentWeek
              ? 'Brak rekordu dzisiejszego dnia'
              : 'Dzień poza aktywnym tygodniem'}
          </p>

          <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">
            Wybierz tydzień zawierający dzisiejszą datę.
          </p>
        </div>
      </section>
    );
  }

  const workedHours = getDayWorkedHours(day);
  const messagesPerHour = getDayMessagesPerHour(day);

  const ratingPresentation = getWorkRatingPresentation(day.workRating);

  const beerPresentation = getBeerPresentation(day.beers);

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Dzisiaj</h2>

          <p className="mt-0.5 text-xs font-medium text-zinc-500">{dateLabel}</p>
        </div>

        <Link
          to="/work"
          className="text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110"
        >
          Szczegóły
        </Link>
      </div>

      <div className="p-4">
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          <MainMetric label="Wiadomości" value={formatNumber(day.messages)} icon={Mail} accent />

          <MainMetric label="Czas pracy" value={`${formatHours(workedHours)} h`} icon={Clock3} />

          <MainMetric
            label="Średnia / h"
            value={workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
            icon={Gauge}
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Star aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />

            <span className="truncate text-xs font-medium text-zinc-500">Ocena</span>
          </div>

          <span className="shrink-0 text-sm font-bold" style={{ color: ratingPresentation.color }}>
            {formatWorkRating(day.workRating)}
          </span>
        </div>

        <SecondaryMetric
          label="Piwa"
          value={String(day.beers)}
          icon={Beer}
          valueClassName={day.beers === 0 ? 'text-emerald-300' : 'text-red-300'}
        />

        <SecondaryMetric
          label="Bloki"
          value={String(day.sessions.length)}
          icon={MessageSquareText}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${ratingPresentation.className}`}
        >
          {ratingPresentation.label}
        </span>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${beerPresentation.className}`}
        >
          {day.beers === 0 ? 'Bez alkoholu' : `${day.beers} piw`}
        </span>
      </div>

      {day.sessions.length > 0 && (
        <div className="mt-3 border-t border-zinc-700 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Bloki pracy
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {day.sessions.map((session) => (
              <span
                key={session.id}
                className="rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-[11px] font-medium text-zinc-400"
              >
                {session.startTime}–{session.endTime}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
