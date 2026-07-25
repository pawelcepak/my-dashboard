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

type WeeklyMetricProps = {
  label: string;
  value: string;
  description: string;
  icon: typeof Mail;
};

function WeeklyMetric({ label, value, description, icon: Icon }: WeeklyMetricProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>

          <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">{value}</p>

          <p className="mt-1 text-xs leading-5 text-zinc-600">{description}</p>
        </div>

        <Icon aria-hidden="true" className="size-5 shrink-0 text-zinc-600" />
      </div>
    </div>
  );
}

function calculateGoalPercentage(currentValue: number, target: number | null): number | null {
  if (target === null || target <= 0) {
    return null;
  }

  return Math.min(100, (currentValue / target) * 100);
}

export default function WeeklyWorkOverview({ week, summary, progress }: WeeklyWorkOverviewProps) {
  const weeklyGoalPercentage = calculateGoalPercentage(
    summary.totalMessages,
    week.goals.weeklyMessagesTarget
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex flex-col gap-3 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Bieżący tydzień</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Tydzień {week.weekNumber}, {week.year}
          </p>
        </div>

        <Link
          to="/work"
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
        >
          Otwórz moduł Praca
        </Link>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <WeeklyMetric
            label="Wiadomości"
            value={formatNumber(summary.totalMessages)}
            description={`${summary.totalHeldMessages} zatrzymanych`}
            icon={Mail}
          />

          <WeeklyMetric
            label="Czas pracy"
            value={`${formatHours(summary.totalHours)} godz.`}
            description={`${summary.totalMinutes} minut`}
            icon={Clock3}
          />

          <WeeklyMetric
            label="Średnia"
            value={formatDecimal(summary.averageMessagesPerHour)}
            description="Wiadomości na godzinę"
            icon={Gauge}
          />

          <WeeklyMetric
            label="Zarobek netto"
            value={formatCurrencyPln(summary.netEarningsPln)}
            description="Po odjęciu opłaty za wypłatę"
            icon={Banknote}
          />
        </div>

        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
                <Target aria-hidden="true" className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-300">Cel tygodniowy</p>

                <p className="mt-1 text-sm text-zinc-500">
                  {week.goals.weeklyMessagesTarget === null
                    ? 'Nie ustawiono celu tygodniowego'
                    : `${formatNumber(summary.totalMessages)} z ${formatNumber(
                        week.goals.weeklyMessagesTarget
                      )} wiadomości`}
                </p>
              </div>
            </div>

            {weeklyGoalPercentage !== null && (
              <p className="text-sm font-semibold text-zinc-200">
                {formatDecimal(weeklyGoalPercentage)}%
              </p>
            )}
          </div>

          {weeklyGoalPercentage !== null && (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${weeklyGoalPercentage}%` }}
              />
            </div>
          )}

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Następny próg</p>

              <p className="mt-1 font-medium text-zinc-300">
                {progress.nextThreshold === null
                  ? 'Osiągnięto maksimum'
                  : formatNumber(progress.nextThreshold)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Brakuje</p>

              <p className="mt-1 font-medium text-zinc-300">
                {formatNumber(progress.messagesMissing)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Potrzebne dziennie</p>

              <p className="mt-1 font-medium text-zinc-300">
                {progress.remainingDays > 0
                  ? `${formatNumber(
                      progress.requiredMessagesPerDay
                    )} przez ${progress.remainingDays} dni`
                  : 'Brak pozostałych dni'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
