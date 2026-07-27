import { Clock3, PiggyBank, type LucideIcon } from 'lucide-react';

import {
  formatCurrencyPln,
  formatDecimal,
  formatHours,
} from '@/modules/work/utils/workCalculations';

type DashboardGoalProgressProps = {
  netEarningsPln: number;
  totalHours: number;
};

type GoalProgressProps = {
  label: string;
  current: number;
  target: number;
  icon: LucideIcon;
  formatValue: (value: number) => string;
};

const WEEKLY_NET_TARGET_PLN = 945;
const WEEKLY_HOURS_TARGET = 40;

function GoalProgress({ label, current, target, icon: Icon, formatValue }: GoalProgressProps) {
  const percentage = (current / target) * 100;

  const visiblePercentage = Math.min(100, Math.max(0, percentage));

  const remaining = Math.max(0, target - current);

  const excess = Math.max(0, current - target);

  const isCompleted = current >= target;

  return (
    <article
      className={`rounded-xl border p-3.5 ${
        isCompleted
          ? 'border-emerald-800 bg-emerald-950/20'
          : 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
              isCompleted
                ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                : 'border-[var(--app-accent-border)] bg-zinc-950/35 text-[var(--app-accent)]'
            }`}
          >
            <Icon aria-hidden="true" className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {label}
            </p>

            <p className="mt-1 truncate text-sm font-bold text-zinc-100">
              {formatValue(current)} / {formatValue(target)}
            </p>
          </div>
        </div>

        <p
          className={`shrink-0 text-base font-bold ${
            isCompleted ? 'text-emerald-400' : 'text-[var(--app-accent)]'
          }`}
        >
          {formatDecimal(percentage)}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            isCompleted ? 'bg-emerald-500' : 'bg-[var(--app-accent)]'
          }`}
          style={{
            width: `${visiblePercentage}%`,
          }}
        />
      </div>

      <p
        className={`mt-2 text-[11px] font-medium ${
          isCompleted ? 'text-emerald-400' : 'text-zinc-500'
        }`}
      >
        {isCompleted
          ? excess > 0
            ? `Nadwyżka: ${formatValue(excess)}`
            : 'Cel osiągnięty'
          : `Pozostało: ${formatValue(remaining)}`}
      </p>
    </article>
  );
}

export default function DashboardGoalProgress({
  netEarningsPln,
  totalHours,
}: DashboardGoalProgressProps) {
  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Główne cele tygodnia</h2>

        <p className="mt-0.5 text-xs text-zinc-500">Stałe cele finansowe i czasowe</p>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2">
        <GoalProgress
          label="Cel finansowy"
          current={netEarningsPln}
          target={WEEKLY_NET_TARGET_PLN}
          icon={PiggyBank}
          formatValue={formatCurrencyPln}
        />

        <GoalProgress
          label="Cel godzinowy"
          current={totalHours}
          target={WEEKLY_HOURS_TARGET}
          icon={Clock3}
          formatValue={(value) => `${formatHours(value)} h`}
        />
      </div>
    </section>
  );
}
