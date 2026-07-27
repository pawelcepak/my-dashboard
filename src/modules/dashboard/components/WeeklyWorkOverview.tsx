import { Banknote, Clock3, Mail, MessageSquareMore, PiggyBank, Target, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

import MessageRateThresholdBar from '@/modules/work/components/MessageRateThresholdBar';
import MessagesPerHourIndicator from '@/modules/work/components/MessagesPerHourIndicator';
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
  currentFormatter?: (value: number) => string;
  targetFormatter?: (value: number) => string;
  remainingFormatter?: (value: number) => string;
  completedLabel?: string;
  icon?: typeof Target;
  permanent?: boolean;
};

const WEEKLY_NET_TARGET_PLN = 945;
const WEEKLY_HOURS_TARGET = 40;

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

function InlineAverageMetric({ value }: { value: number }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        Średnia / h
      </p>

      <div className="mt-1">
        <MessagesPerHourIndicator value={value} compact />
      </div>
    </div>
  );
}

function CompactGoal({
  label,
  current,
  target,
  currentFormatter = formatNumber,
  targetFormatter = formatNumber,
  remainingFormatter = formatNumber,
  completedLabel = 'Cel osiągnięty',
  icon: Icon = Target,
  permanent = false,
}: CompactGoalProps) {
  if (target === null || target <= 0) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>

        <p className="mt-1 text-xs font-medium text-zinc-500">Brak celu</p>
      </div>
    );
  }

  const actualPercentage = (current / target) * 100;

  const barPercentage = Math.min(100, Math.max(0, actualPercentage));

  const isCompleted = current >= target;

  const difference = Math.abs(target - current);

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 transition ${
        isCompleted
          ? 'border-emerald-800 bg-emerald-950/20'
          : permanent
            ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
            : 'border-zinc-700 bg-zinc-950/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon
            aria-hidden="true"
            className={`size-3.5 shrink-0 ${
              isCompleted
                ? 'text-emerald-400'
                : permanent
                  ? 'text-[var(--app-accent)]'
                  : 'text-zinc-500'
            }`}
          />

          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            {label}
          </p>
        </div>

        <p
          className={`shrink-0 text-xs font-bold ${
            isCompleted ? 'text-emerald-400' : 'text-[var(--app-accent)]'
          }`}
        >
          {formatDecimal(actualPercentage)}%
        </p>
      </div>

      <p className="mt-1.5 truncate text-xs font-semibold text-zinc-200">
        {currentFormatter(current)} / {targetFormatter(target)}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            isCompleted ? 'bg-emerald-500' : 'bg-[var(--app-accent)]'
          }`}
          style={{
            width: `${barPercentage}%`,
          }}
        />
      </div>

      <p
        className={`mt-1.5 truncate text-[10px] font-medium ${
          isCompleted ? 'text-emerald-400' : 'text-zinc-500'
        }`}
      >
        {isCompleted
          ? current > target
            ? `Nadwyżka: ${remainingFormatter(difference)}`
            : completedLabel
          : `Pozostało: ${remainingFormatter(difference)}`}
      </p>
    </div>
  );
}

export default function WeeklyWorkOverview({ week, summary }: WeeklyWorkOverviewProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="grid gap-4 p-4 lg:grid-cols-[11rem_minmax(0,0.85fr)_minmax(24rem,1.15fr)] lg:items-center">
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

        <div className="grid grid-cols-2 gap-4 border-zinc-700 sm:grid-cols-5 lg:border-x lg:px-5">
          <InlineMetric
            label="Płatne"
            value={formatNumber(summary.totalMessages)}
            icon={Mail}
            accent
          />

          <InlineMetric
            label="Zatrzymane"
            value={formatNumber(summary.totalHeldMessages)}
            icon={MessageSquareMore}
          />

          <InlineMetric label="Godziny" value={formatHours(summary.totalHours)} icon={Clock3} />

          <InlineAverageMetric value={summary.averageMessagesPerHour} />

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
              label="945 zł netto"
              current={summary.netEarningsPln}
              target={WEEKLY_NET_TARGET_PLN}
              currentFormatter={formatCurrencyPln}
              targetFormatter={formatCurrencyPln}
              remainingFormatter={formatCurrencyPln}
              icon={PiggyBank}
              permanent
            />

            <CompactGoal
              label="40 godzin"
              current={summary.totalHours}
              target={WEEKLY_HOURS_TARGET}
              currentFormatter={(value) => `${formatHours(value)} h`}
              targetFormatter={(value) => `${formatHours(value)} h`}
              remainingFormatter={(value) => `${formatHours(value)} h`}
              icon={Timer}
              permanent
            />

            <CompactGoal
              label="Cel 7 dni"
              current={summary.totalMessages}
              target={week.goals.weeklyMessagesTarget}
            />

            <CompactGoal
              label="Cel 5 dni"
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
