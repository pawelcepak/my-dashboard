import { Database } from 'lucide-react';

import ThemeToggle from '@/app/layout/ThemeToggle';

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
  const formattedDate = capitalizeFirstLetter(getFormattedDate());

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-zinc-700 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <p className="shrink-0 text-base font-bold tracking-wide text-zinc-100">CHB</p>

          <div className="h-5 w-px shrink-0 bg-zinc-700" />

          <p className="truncate text-sm font-medium text-zinc-400">{formattedDate}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div
            title="Dane zapisywane lokalnie"
            className="hidden h-9 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-xs font-medium text-zinc-500 sm:flex"
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
