import type { LucideIcon } from 'lucide-react';

export type HistoryCardMetric = {
  label: string;
  value: string;
  icon?: LucideIcon;
  valueClassName?: string;
};

type HistoryCardProps = {
  title: string;
  subtitle: string;
  metrics: HistoryCardMetric[];
  isActive?: boolean;
  onClick: () => void;
};

export default function HistoryCard({
  title,
  subtitle,
  metrics,
  isActive = false,
  onClick,
}: HistoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        isActive
          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
          : 'border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-base font-semibold ${
              isActive ? 'text-[var(--app-accent)]' : 'text-zinc-100'
            }`}
          >
            {title}
          </p>

          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>

        {isActive && (
          <span className="rounded-full border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-accent)]">
            Aktywny
          </span>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                {Icon && <Icon aria-hidden="true" className="size-3.5 shrink-0" />}

                <span className="truncate">{metric.label}</span>
              </dt>

              <dd
                className={`mt-1 truncate text-sm font-semibold ${
                  metric.valueClassName ?? 'text-zinc-200'
                }`}
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
