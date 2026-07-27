export const TABLE_DENSITIES = ['standard', 'compact', 'very-compact'] as const;

export type TableDensity = (typeof TABLE_DENSITIES)[number];

export const ACCENT_THEMES = ['crimson', 'blue', 'emerald', 'amber', 'violet'] as const;

export type AccentTheme = (typeof ACCENT_THEMES)[number];

export interface AppPreferences {
  tableDensity: TableDensity;

  accentTheme: AccentTheme;
}

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  tableDensity: 'very-compact',

  accentTheme: 'crimson',
};

export type AppPreferenceKey = keyof AppPreferences;
