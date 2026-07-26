import { Database } from 'lucide-react';

import ThemeToggle from '@/app/layout/ThemeToggle';
import { useCurrentWorkWeek } from '@/modules/work/hooks/useCurrentWorkWeek';
import { formatShortIsoDate } from '@/modules/work/utils/workCalculations';

function getFormattedDate(): string {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

function capitalizeFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase('pl-PL') + value.slice(1);
}

export default function Header() {
  const { week, isLoading } = useCurrentWorkWeek();

  const formattedDate = capitalizeFirstLetter(getFormattedDate());

  const weekLabel =
    !isLoading && week
      ? `Tydzień ${week.weekNumber} (${formatShortIsoDate(
          week.startDate
        )}–${formatShortIsoDate(week.endDate)})`
      : 'Wczytywanie tygodnia…';

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-zinc-700 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <p className="shrink-0 text-base font-bold tracking-wide text-zinc-100">CHB</p>

          <div className="hidden h-5 w-px shrink-0 bg-zinc-700 sm:block" />

          <p className="hidden truncate text-sm font-semibold text-[var(--app-accent)] sm:block">
            {weekLabel}
          </p>

          <div className="hidden h-5 w-px shrink-0 bg-zinc-700 lg:block" />

          <p className="hidden truncate text-sm font-medium text-zinc-400 lg:block">
            {formattedDate}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <p className="max-w-40 truncate text-xs font-medium text-zinc-400 sm:hidden">
            {weekLabel}
          </p>

          <div
            title="Dane zapisywane lokalnie"
            className="hidden h-9 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-xs font-medium text-zinc-500 md:flex"
          >
            <Database aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            Lokalnie
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
