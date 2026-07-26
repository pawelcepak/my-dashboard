import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type HistoryCardMetric = {
  label: string;
  value: string;
  icon?: LucideIcon;
  valueClassName?: string;
  valueColor?: string;
  accent?: boolean;
};

type HistoryCardProps = {
  title: string;
  subtitle: string;
  metrics: HistoryCardMetric[];
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
};

export default function HistoryCard({
  title,
  subtitle,
  metrics,
  isActive = false,
  isDisabled = false,
  onClick,
}: HistoryCardProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border text-left shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] disabled:cursor-wait disabled:opacity-60 ${
        isActive
          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
          : 'border-zinc-700 bg-zinc-900/60 hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900'
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 transition ${
          isActive ? 'bg-[var(--app-accent)]' : 'bg-transparent group-hover:bg-zinc-600'
        }`}
      />

      <div className="flex items-start justify-between gap-4 border-b border-zinc-700/80 px-4 py-3.5 pl-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`truncate text-base font-bold ${
                isActive ? 'text-[var(--app-accent)]' : 'text-zinc-100'
              }`}
            >
              {title}
            </p>

            {isActive && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--app-accent-border)] bg-zinc-950/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--app-accent)]">
                <CheckCircle2 aria-hidden="true" className="size-3" />
                Aktywny
              </span>
            )}
          </div>

          <p className="mt-1 text-xs font-medium text-zinc-500">{subtitle}</p>
        </div>

        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition ${
            isActive
              ? 'border-[var(--app-accent-border)] bg-zinc-950/35 text-[var(--app-accent)]'
              : 'border-zinc-700 bg-zinc-950 text-zinc-500 group-hover:border-zinc-600 group-hover:text-zinc-300'
          }`}
        >
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-zinc-700/70 sm:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className={`min-w-0 bg-zinc-900/95 px-3 py-3 ${
                metric.accent ? 'bg-[var(--app-accent-soft)]' : ''
              }`}
            >
              <dt className="flex min-w-0 items-center gap-1.5">
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className={`size-3.5 shrink-0 ${
                      metric.accent ? 'text-[var(--app-accent)]' : 'text-zinc-500'
                    }`}
                    strokeWidth={1.8}
                  />
                )}

                <span className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                  {metric.label}
                </span>
              </dt>

              <dd
                className={`mt-1.5 truncate text-sm font-bold ${
                  metric.valueClassName ??
                  (metric.accent ? 'text-[var(--app-accent)]' : 'text-zinc-200')
                }`}
                style={
                  metric.valueColor
                    ? {
                        color: metric.valueColor,
                      }
                    : undefined
                }
              >
                {metric.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </button>
  );
}
