import { LoaderCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import CloudStatusIndicator from '@/app/cloud/CloudStatusIndicator';
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
  const { signOut } = useAuth();

  const { week, isLoading } = useCurrentWorkWeek();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const formattedDate = capitalizeFirstLetter(getFormattedDate());

  const weekLabel =
    !isLoading && week
      ? `Tydzień ${week.weekNumber} (${formatShortIsoDate(week.startDate)}–${formatShortIsoDate(
          week.endDate
        )})`
      : 'Wczytywanie tygodnia…';

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      console.error('Nie udało się wylogować.', error);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-700 bg-zinc-950/96 backdrop-blur-xl">
      <div className="mx-auto flex min-h-14 w-full max-w-[1920px] items-center justify-between gap-3 px-3 py-2 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label="Przejdź do Dashboardu"
            title="Przejdź do Dashboardu"
            className="group flex h-9 shrink-0 items-center rounded-lg border border-transparent px-2 text-base font-bold tracking-wide text-zinc-100 transition hover:border-[var(--app-accent-border)] hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]"
          >
            CHB
          </Link>

          <div className="hidden h-5 w-px shrink-0 bg-zinc-700 sm:block" />

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[var(--app-accent)] sm:text-sm">
              {weekLabel}
            </p>

            <p className="mt-0.5 hidden truncate text-xs font-medium text-zinc-500 md:block">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CloudStatusIndicator />

          <ThemeToggle />

          <button
            type="button"
            disabled={isSigningOut}
            onClick={() => {
              void handleSignOut();
            }}
            aria-label="Wyloguj się"
            title="Wyloguj się"
            className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-500 transition hover:border-red-900/70 hover:bg-red-950/30 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSigningOut ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <LogOut aria-hidden="true" className="size-4" strokeWidth={1.9} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
