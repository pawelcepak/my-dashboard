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
};

function InlineMetric({ label, value, icon: Icon }: InlineMetricProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-zinc-600" />

      <div>
        <p className="text-[10px] uppercase tracking-wide text-zinc-600">{label}</p>

        <p className="text-sm font-semibold text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

function getGoalPercentage(current: number, target: number | null) {
  if (target === null || target <= 0) {
    return null;
  }

  return Math.min(100, (current / target) * 100);
}

export default function WeeklyWorkOverview({ week, summary, progress }: WeeklyWorkOverviewProps) {
  const goalPercentage = getGoalPercentage(summary.totalMessages, week.goals.weeklyMessagesTarget);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
        <div className="flex min-w-40 items-center justify-between gap-3 lg:block">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Tydzień {week.weekNumber}</h2>

            <p className="mt-0.5 text-xs text-zinc-500">{week.year}</p>
          </div>

          <Link
            to="/work"
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-100"
          >
            Szczegóły
          </Link>
        </div>

        <div className="hidden h-10 w-px bg-zinc-800 lg:block" />

        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          <InlineMetric
            label="Wiadomości"
            value={formatNumber(summary.totalMessages)}
            icon={Mail}
          />

          <InlineMetric label="Godziny" value={formatHours(summary.totalHours)} icon={Clock3} />

          <InlineMetric
            label="Średnia/h"
            value={formatDecimal(summary.averageMessagesPerHour)}
            icon={Gauge}
          />

          <InlineMetric
            label="Netto"
            value={formatCurrencyPln(summary.netEarningsPln)}
            icon={Banknote}
          />
        </div>

        <div className="hidden h-10 w-px bg-zinc-800 xl:block" />

        <div className="min-w-64 flex-1 xl:max-w-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target aria-hidden="true" className="size-4 text-zinc-600" />

              <p className="text-xs text-zinc-500">
                Cel:{' '}
                {week.goals.weeklyMessagesTarget === null
                  ? 'brak'
                  : `${formatNumber(summary.totalMessages)} / ${formatNumber(
                      week.goals.weeklyMessagesTarget
                    )}`}
              </p>
            </div>

            {goalPercentage !== null && (
              <p className="text-xs font-semibold text-zinc-300">
                {formatDecimal(goalPercentage)}%
              </p>
            )}
          </div>

          {goalPercentage !== null && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          )}

          <p className="mt-2 text-[11px] text-zinc-600">
            Następny próg:{' '}
            {progress.nextThreshold === null ? 'osiągnięty' : formatNumber(progress.nextThreshold)}
            {' · '}
            Brakuje: {formatNumber(progress.messagesMissing)}
          </p>
        </div>
      </div>
    </section>
  );
}
