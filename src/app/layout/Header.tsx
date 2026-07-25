import { Menu } from 'lucide-react';

type HeaderProps = {
  onMenuOpen: () => void;
};

function getFormattedDate(): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export default function Header({ onMenuOpen }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Otwórz menu"
          onClick={onMenuOpen}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-100 lg:hidden">My Dashboard</p>

          <p className="hidden text-sm text-zinc-400 sm:block lg:text-zinc-500">
            {getFormattedDate()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400">
          Lokalnie
        </span>
      </div>
    </header>
  );
}
