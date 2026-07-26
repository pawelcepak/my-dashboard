import { ArrowDown, ArrowUp, Equal, Gauge, type LucideIcon } from 'lucide-react';

import { formatDecimal } from '@/modules/work/utils/workCalculations';
import {
  getMessagesPerHourPresentation,
  type MessagesPerHourTrend,
} from '@/modules/work/utils/workPresentation';

type MessagesPerHourIndicatorProps = {
  value: number | null;
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
};

const trendIcons: Record<MessagesPerHourTrend, LucideIcon> = {
  up: ArrowUp,
  neutral: Equal,
  down: ArrowDown,
  empty: Gauge,
};

export default function MessagesPerHourIndicator({
  value,
  compact = false,
  showLabel = false,
  className = '',
}: MessagesPerHourIndicatorProps) {
  const presentation = getMessagesPerHourPresentation(value);

  const TrendIcon = trendIcons[presentation.trend];

  const formattedValue =
    value === null || !Number.isFinite(value) || value <= 0 ? '—' : formatDecimal(value);

  if (compact) {
    return (
      <span
        title={presentation.label}
        className={`inline-flex min-w-0 items-center gap-1 font-bold ${presentation.textClassName} ${className}`}
      >
        <TrendIcon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.4} />

        <span className="truncate">{formattedValue}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 ${presentation.badgeClassName} ${className}`}
      title={presentation.label}
    >
      <TrendIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />

      <span className="font-bold">{formattedValue}</span>

      {showLabel && (
        <span className="hidden truncate text-[10px] font-semibold uppercase tracking-wide sm:inline">
          {presentation.shortLabel}
        </span>
      )}
    </div>
  );
}
