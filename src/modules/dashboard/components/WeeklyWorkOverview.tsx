import { Banknote, Clock3, Gauge, Mail, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { WorkProgress, WorkWeek, WorkWeekSummary } from '@/modules/work/types/work.types';
import {
  formatCurrencyPln,
  formatDecimal,
  formatHours,
  formatNumber,
} from '@/modules/work/utils/workCalculations';

type WeeklyWorkOverviewProps = {
  week: WorkWeek;
  summary: WorkWeekSummary;
  progress: WorkProgress;
};

type InlineMetricProps = {
  label: string;
  value: string;
  icon: typeof Mail;
  accent?: boolean;
};

function InlineMetric({ label, value, icon: Icon, accent = false }: InlineMetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
          accent
            ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]'
            : 'border-zinc-700 bg-zinc-950 text-zinc-500'
        }`}
      >
        <Icon aria-hidden="true" className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </p>

        <p
          className={`truncate text-base font-bold ${
            accent ? 'text-[var(--app-accent)]' : 'text-zinc-100'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function getGoalPercentage(current: number, target: number | null): number | null {
  if (target === null || target <= 0) {
    return null;
  }

  return Math.min(100, (current / target) * 100);
}

export default function WeeklyWorkOverview({ week, summary, progress }: WeeklyWorkOverviewProps) {
  const goalPercentage = getGoalPercentage(summary.totalMessages, week.goals.weeklyMessagesTarget);

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="grid gap-4 p-4 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(18rem,0.75fr)] lg:items-center">
        <div className="flex items-center justify-between gap-3 lg:block">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Aktywny okres
            </p>

            <h2 className="mt-1 text-lg font-bold text-zinc-100">Tydzień {week.weekNumber}</h2>

            <p className="text-xs font-medium text-zinc-500">Rok {week.year}</p>
          </div>

          <Link
            to="/work"
            className="text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110"
          >
            Szczegóły
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 border-zinc-700 sm:grid-cols-4 lg:border-x lg:px-5">
          <InlineMetric
            label="Wiadomości"
            value={formatNumber(summary.totalMessages)}
            icon={Mail}
            accent
          />

          <InlineMetric label="Godziny" value={formatHours(summary.totalHours)} icon={Clock3} />

          <InlineMetric
            label="Średnia / h"
            value={formatDecimal(summary.averageMessagesPerHour)}
            icon={Gauge}
          />

          <InlineMetric
            label="Netto"
            value={formatCurrencyPln(summary.netEarningsPln)}
            icon={Banknote}
          />
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Target aria-hidden="true" className="size-4 shrink-0 text-[var(--app-accent)]" />

              <p className="truncate text-xs font-semibold text-zinc-300">Cel tygodniowy</p>
            </div>

            {goalPercentage !== null && (
              <p className="shrink-0 text-sm font-bold text-[var(--app-accent)]">
                {formatDecimal(goalPercentage)}%
              </p>
            )}
          </div>

          <p className="mt-2 text-xs font-medium text-zinc-500">
            {week.goals.weeklyMessagesTarget === null
              ? 'Nie ustawiono celu'
              : `${formatNumber(summary.totalMessages)} / ${formatNumber(
                  week.goals.weeklyMessagesTarget
                )} wiadomości`}
          </p>

          {goalPercentage !== null && (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-[var(--app-accent)] transition-all"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-zinc-500">
            <span>
              Próg:{' '}
              {progress.nextThreshold === null
                ? 'osiągnięty'
                : formatNumber(progress.nextThreshold)}
            </span>

            <span>Brakuje: {formatNumber(progress.messagesMissing)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
