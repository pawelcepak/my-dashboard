import { CalendarDays, Target } from 'lucide-react';

import type { WorkProgress, WorkWeekGoals } from '@/modules/work/types/work.types';
import {
  formatDecimal,
  formatGoalValue,
  formatNumber,
} from '@/modules/work/utils/workCalculations';

type WorkProgressCardProps = {
  totalMessages: number;
  progress: WorkProgress;
  goals: WorkWeekGoals;
};

type GoalProgressProps = {
  label: string;
  target: number | null;
  totalMessages: number;
};

const statusStyles: Record<
  WorkProgress['status'],
  {
    badge: string;
    bar: string;
    label: string;
  }
> = {
  red: {
    badge: 'border-red-900/70 bg-red-950/50 text-red-300',
    bar: 'bg-red-500',
    label: 'Poniżej pierwszego progu',
  },
  yellow: {
    badge: 'border-amber-900/70 bg-amber-950/50 text-amber-300',
    bar: 'bg-amber-400',
    label: 'Pierwszy próg osiągnięty',
  },
  'light-green': {
    badge: 'border-lime-900/70 bg-lime-950/50 text-lime-300',
    bar: 'bg-lime-400',
    label: 'Drugi próg osiągnięty',
  },
  green: {
    badge: 'border-emerald-900/70 bg-emerald-950/50 text-emerald-300',
    bar: 'bg-emerald-500',
    label: 'Najwyższy próg osiągnięty',
  },
};

function GoalProgress({ label, target, totalMessages }: GoalProgressProps) {
  if (target === null || target <= 0) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-4">
        <div className="flex items-center gap-2">
          <CalendarDays aria-hidden="true" className="size-4 text-zinc-500" />

          <p className="text-xs font-semibold text-zinc-300">{label}</p>
        </div>

        <p className="mt-3 text-sm text-zinc-500">Cel nie został ustawiony.</p>
      </div>
    );
  }

  const remainingMessages = Math.max(0, target - totalMessages);

  const percentage = Math.min(100, (totalMessages / target) * 100);

  const isCompleted = totalMessages >= target;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isCompleted ? 'border-emerald-800 bg-emerald-950/20' : 'border-zinc-700 bg-zinc-950/40'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays
            aria-hidden="true"
            className={isCompleted ? 'size-4 text-emerald-400' : 'size-4 text-[var(--app-accent)]'}
          />

          <p className="text-xs font-semibold text-zinc-300">{label}</p>
        </div>

        <p
          className={`text-sm font-bold ${
            isCompleted ? 'text-emerald-300' : 'text-[var(--app-accent)]'
          }`}
        >
          {formatDecimal(percentage)}%
        </p>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Wynik
          </p>

          <p className="mt-1 text-base font-bold text-zinc-100">
            {formatNumber(totalMessages)}
            {' / '}
            {formatGoalValue(target)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {isCompleted ? 'Nadwyżka' : 'Pozostało'}
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              isCompleted ? 'text-emerald-300' : 'text-zinc-300'
            }`}
          >
            {isCompleted ? formatNumber(totalMessages - target) : formatNumber(remainingMessages)}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all ${
            isCompleted ? 'bg-emerald-500' : 'bg-[var(--app-accent)]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function WorkProgressCard({
  totalMessages,
  progress,
  goals,
}: WorkProgressCardProps) {
  const styles = statusStyles[progress.status];

  const thresholdTarget = progress.nextThreshold ?? totalMessages;

  const thresholdPercentage =
    thresholdTarget > 0 ? Math.min(100, (totalMessages / thresholdTarget) * 100) : 100;

  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-900/50">
      <div className="flex flex-col gap-4 border-b border-zinc-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Postęp tygodnia</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Cele wiadomości oraz progi wpływające na stawkę
          </p>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-2">
          <GoalProgress
            label="Cel tygodniowy — 7 dni"
            target={goals.weeklyMessagesTarget}
            totalMessages={totalMessages}
          />

          <GoalProgress
            label="Cel tygodniowy — 5 dni"
            target={goals.weeklyMessagesTarget5Days}
            totalMessages={totalMessages}
          />
        </div>

        <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-950/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-zinc-300">Próg stawki</p>

              <p className="mt-1 text-sm text-zinc-500">
                Aktualny wynik: {formatNumber(totalMessages)}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400">
              <Target aria-hidden="true" className="size-5" />
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all ${styles.bar}`}
              style={{
                width: `${thresholdPercentage}%`,
              }}
            />
          </div>

          {progress.nextThreshold !== null ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Następny próg
                </p>

                <p className="mt-1 text-sm font-bold text-zinc-200">
                  {formatNumber(progress.nextThreshold)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Brakuje
                </p>

                <p className="mt-1 text-sm font-bold text-zinc-200">
                  {formatNumber(progress.messagesMissing)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Tempo do progu
                </p>

                <p className="mt-1 text-sm font-bold text-zinc-200">
                  {progress.remainingDays > 0
                    ? `${formatNumber(
                        progress.requiredMessagesPerDay
                      )} × ${progress.remainingDays} dni`
                    : 'Brak pozostałych dni'}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold text-emerald-400">
              Najwyższy próg stawki został osiągnięty.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
