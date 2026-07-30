import { LoaderCircle, LogOut } from 'lucide-react';
import { useState } from 'react';

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
  return value.length === 0 ? value : value.charAt(0).toLocaleUpperCase('pl-PL') + value.slice(1);
}

export default function Header() {
  const { signOut } = useAuth();
  const { week, isLoading } = useCurrentWorkWeek();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const weekLabel =
    !isLoading && week
      ? `${formatShortIsoDate(week.startDate)}–${formatShortIsoDate(week.endDate)} (W${week.weekNumber})`
      : 'Wczytywanie okresu…';

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
    <header className="sticky top-0 z-30 border-b border-zinc-700/80 bg-zinc-950/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-14 w-full max-w-[1800px] items-center gap-3 px-3 py-2 sm:px-4 lg:px-5 xl:px-6">
        <div className="min-w-0 shrink-0">
          <p className="truncate text-xs font-semibold text-zinc-300 sm:text-sm">{weekLabel}</p>
          <p className="mt-0.5 hidden truncate text-[11px] text-zinc-500 lg:block">
            {capitalizeFirstLetter(getFormattedDate())}
          </p>
        </div>

        <div id="page-section-nav-slot" className="min-w-0 flex-1" />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <CloudStatusIndicator />
          <ThemeToggle />
          <button
            type="button"
            disabled={isSigningOut}
            onClick={() => void handleSignOut()}
            aria-label="Wyloguj się"
            title="Wyloguj się"
            className="app-icon-button hover:border-red-900/70 hover:bg-red-950/30 hover:text-red-400"
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
