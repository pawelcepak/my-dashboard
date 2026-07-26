import { Target } from 'lucide-react';

import type { WorkProgress } from '@/modules/work/types/work.types';
import { formatNumber } from '@/modules/work/utils/workCalculations';

type WorkProgressCardProps = {
  totalMessages: number;
  progress: WorkProgress;
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

export default function WorkProgressCard({ totalMessages, progress }: WorkProgressCardProps) {
  const styles = statusStyles[progress.status];

  const target = progress.nextThreshold ?? totalMessages;

  const progressPercentage = target > 0 ? Math.min(100, (totalMessages / target) * 100) : 100;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Postęp tygodnia</h2>

          <p className="mt-1 text-sm text-zinc-500">Progi wpływające na stawkę za wiadomość</p>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Aktualny wynik</p>

            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">
              {formatNumber(totalMessages)}
            </p>
          </div>

          <div className="flex size-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400">
            <Target aria-hidden="true" className="size-6" />
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all ${styles.bar}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {progress.nextThreshold !== null ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Następny próg</p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {formatNumber(progress.nextThreshold)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Brakuje</p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {formatNumber(progress.messagesMissing)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Dziennie</p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {progress.remainingDays > 0
                  ? `${formatNumber(progress.requiredMessagesPerDay)} przez ${progress.remainingDays} dni`
                  : 'Brak pozostałych dni'}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm font-medium text-emerald-400">
            Najwyższy próg został osiągnięty.
          </p>
        )}
      </div>
    </section>
  );
}
