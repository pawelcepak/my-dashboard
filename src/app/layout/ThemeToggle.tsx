import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/app/theme/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDarkTheme = theme === 'dark';

  const accessibleLabel = isDarkTheme ? 'Włącz jasny motyw' : 'Włącz ciemny motyw';

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      title={accessibleLabel}
      onClick={toggleTheme}
      className="group flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {isDarkTheme ? (
        <Sun
          aria-hidden="true"
          className="size-4 transition-transform group-hover:rotate-12"
          strokeWidth={1.9}
        />
      ) : (
        <Moon
          aria-hidden="true"
          className="size-4 transition-transform group-hover:-rotate-12"
          strokeWidth={1.9}
        />
      )}
    </button>
  );
}
