import { Check, Flag, TrendingUp } from 'lucide-react';

import {
  formatCurrencyEur,
  formatNumber,
  getMessageRate,
} from '@/modules/work/utils/workCalculations';

type MessageRateThresholdBarProps = {
  totalMessages: number;
  compact?: boolean;
};

type ThresholdDefinition = {
  value: number;
  rateEur: number;
  label: string;
};

const MAXIMUM_THRESHOLD = 1976;

const thresholds: ThresholdDefinition[] = [
  {
    value: 0,
    rateEur: 0.07,
    label: '0–775',
  },
  {
    value: 776,
    rateEur: 0.08,
    label: '776–1575',
  },
  {
    value: 1576,
    rateEur: 0.09,
    label: '1576–1975',
  },
  {
    value: 1976,
    rateEur: 0.1,
    label: '1976+',
  },
];

function getThresholdPosition(value: number): number {
  return Math.min(100, Math.max(0, (value / MAXIMUM_THRESHOLD) * 100));
}

function getNextThreshold(totalMessages: number): number | null {
  if (totalMessages < 776) {
    return 776;
  }

  if (totalMessages < 1576) {
    return 1576;
  }

  if (totalMessages < 1976) {
    return 1976;
  }

  return null;
}

export default function MessageRateThresholdBar({
  totalMessages,
  compact = false,
}: MessageRateThresholdBarProps) {
  const progressPercentage = getThresholdPosition(totalMessages);

  const currentRate = getMessageRate(totalMessages);

  const nextThreshold = getNextThreshold(totalMessages);

  const messagesMissing = nextThreshold === null ? 0 : Math.max(0, nextThreshold - totalMessages);

  const highestThresholdReached = totalMessages >= MAXIMUM_THRESHOLD;

  return (
    <div className={`rounded-xl border border-zinc-700 bg-zinc-950/45 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400">
            <TrendingUp aria-hidden="true" className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-200">Próg stawki za wiadomość</p>

            <p className="mt-0.5 text-xs text-zinc-500">
              Aktualna stawka:{' '}
              <span className="font-bold text-zinc-300">{formatCurrencyEur(currentRate)}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Aktualny wynik
          </p>

          <p className="mt-0.5 text-lg font-bold text-[var(--app-accent)]">
            {formatNumber(totalMessages)}
          </p>
        </div>
      </div>

      <div className={compact ? 'mt-4' : 'mt-5'}>
        <div className="relative pt-7">
          <div
            className="absolute top-0 z-20 -translate-x-1/2 transition-[left] duration-300"
            style={{
              left: `${progressPercentage}%`,
            }}
          >
            <div className="flex flex-col items-center">
              <span className="whitespace-nowrap rounded-md border border-[var(--app-accent-border)] bg-zinc-950 px-2 py-1 text-[10px] font-bold text-[var(--app-accent)] shadow-sm">
                {formatNumber(totalMessages)}
              </span>

              <span className="mt-0.5 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-[var(--app-accent)]" />
            </div>
          </div>

          <div className="relative h-4 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-[width] duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

            <div className="absolute inset-0 grid grid-cols-[776fr_800fr_400fr]">
              <div className="border-r border-zinc-950/60 bg-red-500/10" />

              <div className="border-r border-zinc-950/60 bg-amber-400/10" />

              <div className="bg-lime-400/10" />
            </div>

            {[776, 1576].map((threshold) => (
              <span
                key={threshold}
                aria-hidden="true"
                className="absolute inset-y-0 z-10 w-px bg-zinc-100/80"
                style={{
                  left: `${getThresholdPosition(threshold)}%`,
                }}
              />
            ))}
          </div>

          <div className="relative mt-2 h-9 text-[10px] font-semibold text-zinc-500">
            {thresholds.map((threshold, index) => {
              const isFirst = index === 0;
              const isLast = index === thresholds.length - 1;

              return (
                <div
                  key={threshold.value}
                  className={`absolute ${
                    isFirst
                      ? 'translate-x-0 text-left'
                      : isLast
                        ? '-translate-x-full text-right'
                        : '-translate-x-1/2 text-center'
                  }`}
                  style={{
                    left: `${getThresholdPosition(threshold.value)}%`,
                  }}
                >
                  <p className="text-zinc-400">{formatNumber(threshold.value)}</p>

                  <p className="mt-0.5 whitespace-nowrap text-zinc-500">
                    {threshold.rateEur.toFixed(4).replace('.', ',')} €
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {!compact && (
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {thresholds.map((threshold, index) => {
              const isReached = totalMessages >= threshold.value;

              const nextValue = thresholds[index + 1]?.value;

              const isCurrent = isReached && (nextValue === undefined || totalMessages < nextValue);

              return (
                <div
                  key={threshold.value}
                  className={`rounded-lg border px-3 py-2 ${
                    isCurrent
                      ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
                      : isReached
                        ? 'border-emerald-800 bg-emerald-950/20'
                        : 'border-zinc-700 bg-zinc-900/45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {threshold.label}
                    </p>

                    {isReached && (
                      <Check
                        aria-hidden="true"
                        className={`size-3.5 ${
                          isCurrent ? 'text-[var(--app-accent)]' : 'text-emerald-400'
                        }`}
                      />
                    )}
                  </div>

                  <p
                    className={`mt-1 text-xs font-bold ${
                      isCurrent ? 'text-[var(--app-accent)]' : 'text-zinc-300'
                    }`}
                  >
                    {threshold.rateEur.toFixed(4).replace('.', ',')} €
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div
          className={`mt-3 flex flex-col gap-2 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between ${
            highestThresholdReached
              ? 'border-emerald-800 bg-emerald-950/20'
              : 'border-zinc-700 bg-zinc-900/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Flag
              aria-hidden="true"
              className={`size-4 shrink-0 ${
                highestThresholdReached ? 'text-emerald-400' : 'text-zinc-500'
              }`}
            />

            <p
              className={`text-xs font-semibold ${
                highestThresholdReached ? 'text-emerald-300' : 'text-zinc-300'
              }`}
            >
              {highestThresholdReached
                ? 'Najwyższy próg stawki został osiągnięty'
                : `Do następnego progu brakuje ${formatNumber(messagesMissing)} wiadomości`}
            </p>
          </div>

          {!highestThresholdReached && nextThreshold !== null && (
            <p className="text-xs font-medium text-zinc-500">
              Następny próg:{' '}
              <span className="font-bold text-zinc-300">{formatNumber(nextThreshold)}</span>
            </p>
          )}

          {highestThresholdReached && (
            <p className="text-xs font-bold text-emerald-400">0,1000 €</p>
          )}
        </div>
      </div>
    </div>
  );
}
