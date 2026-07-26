import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/app/theme/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDarkTheme = theme === 'dark';

  const label = isDarkTheme ? 'Włącz jasny motyw' : 'Włącz ciemny motyw';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="group relative flex size-9 items-center justify-center overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 shadow-sm transition hover:border-[var(--app-accent-border)] hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
      />

      {isDarkTheme ? (
        <Sun
          aria-hidden="true"
          className="relative size-4 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
          strokeWidth={2}
        />
      ) : (
        <Moon
          aria-hidden="true"
          className="relative size-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110"
          strokeWidth={2}
        />
      )}
    </button>
  );
}
