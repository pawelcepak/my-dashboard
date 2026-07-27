import { NAVIGATION_ITEM_IDS, type NavigationItemId } from '@/app/layout/navigation';

export const TABLE_DENSITIES = ['standard', 'compact', 'very-compact'] as const;

export type TableDensity = (typeof TABLE_DENSITIES)[number];

export const ACCENT_THEMES = ['crimson', 'blue', 'emerald', 'amber', 'violet'] as const;

export type AccentTheme = (typeof ACCENT_THEMES)[number];

export const NAVIGATION_TAB_COLORS = [
  'crimson',
  'blue',
  'emerald',
  'amber',
  'violet',
  'cyan',
  'orange',
  'pink',
  'zinc',
] as const;

export type NavigationTabColor = (typeof NAVIGATION_TAB_COLORS)[number];

export type NavigationTabColors = Record<NavigationItemId, NavigationTabColor>;

export interface AppPreferences {
  tableDensity: TableDensity;
  accentTheme: AccentTheme;
  navigationOrder: NavigationItemId[];
  navigationTabColors: NavigationTabColors;
}

export const DEFAULT_NAVIGATION_TAB_COLORS: NavigationTabColors = {
  dashboard: 'crimson',
  work: 'crimson',
  expenses: 'crimson',
  debts: 'crimson',
  portfolio: 'crimson',
  statistics: 'crimson',
  settings: 'crimson',
};

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  tableDensity: 'very-compact',
  accentTheme: 'crimson',
  navigationOrder: [...NAVIGATION_ITEM_IDS],
  navigationTabColors: DEFAULT_NAVIGATION_TAB_COLORS,
};

export type AppPreferenceKey = keyof AppPreferences;
