import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ThemeContext } from '@/app/theme/themeContext';
import type { Theme } from '@/app/theme/theme.types';
import {
  APP_SETTINGS_CHANGED_EVENT,
  appSettingsService,
} from '@/modules/settings/services/appSettingsService';
import {
  DEFAULT_APP_PREFERENCES,
  type AccentTheme,
} from '@/modules/settings/types/appSettings.types';

const THEME_STORAGE_KEY = 'my-dashboard-theme';

type ThemeProviderProps = {
  children: ReactNode;
};

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function getInitialTheme(): Theme {
  const documentTheme = document.documentElement.dataset.theme ?? null;

  if (isTheme(documentTheme)) {
    return documentTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

function applyAccentTheme(accentTheme: AccentTheme): void {
  document.documentElement.dataset.accent = accentTheme;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let isActive = true;

    async function loadAccentTheme() {
      try {
        const preferences = await appSettingsService.getPreferences();

        if (isActive) {
          applyAccentTheme(preferences.accentTheme);
        }
      } catch {
        if (isActive) {
          applyAccentTheme(DEFAULT_APP_PREFERENCES.accentTheme);
        }
      }
    }

    function handleSettingsChanged() {
      void loadAccentTheme();
    }

    void loadAccentTheme();

    window.addEventListener(APP_SETTINGS_CHANGED_EVENT, handleSettingsChanged);

    return () => {
      isActive = false;

      window.removeEventListener(APP_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
    };
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
