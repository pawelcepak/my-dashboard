import { Banknote, Clock3, Gauge, Mail, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

import MessageRateThresholdBar from '@/modules/work/components/MessageRateThresholdBar';
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

type CompactGoalProps = {
  label: string;
  current: number;
  target: number | null;
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

function CompactGoal({ label, current, target }: CompactGoalProps) {
  if (target === null || target <= 0) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>

        <p className="mt-1 text-xs font-medium text-zinc-500">Brak celu</p>
      </div>
    );
  }

  const percentage = Math.min(100, (current / target) * 100);

  const isCompleted = current >= target;

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 ${
        isCompleted ? 'border-emerald-800 bg-emerald-950/20' : 'border-zinc-700 bg-zinc-950/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>

        <p
          className={`text-xs font-bold ${
            isCompleted ? 'text-emerald-400' : 'text-[var(--app-accent)]'
          }`}
        >
          {formatDecimal(percentage)}%
        </p>
      </div>

      <p className="mt-1 text-xs font-semibold text-zinc-300">
        {formatNumber(current)} / {formatNumber(target)}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            isCompleted ? 'bg-emerald-500' : 'bg-[var(--app-accent)]'
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function WeeklyWorkOverview({ week, summary }: WeeklyWorkOverviewProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="grid gap-4 p-4 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(20rem,0.8fr)] lg:items-center">
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

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Target aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

            <p className="text-xs font-semibold text-zinc-300">Cele tygodniowe</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <CompactGoal
              label="7 dni"
              current={summary.totalMessages}
              target={week.goals.weeklyMessagesTarget}
            />

            <CompactGoal
              label="5 dni"
              current={summary.totalMessages}
              target={week.goals.weeklyMessagesTarget5Days}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-700 p-4">
        <MessageRateThresholdBar totalMessages={summary.totalMessages} compact />
      </div>
    </section>
  );
}
