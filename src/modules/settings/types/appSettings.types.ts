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

export type WorkTableColumnWidths = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const DEFAULT_WORK_TABLE_COLUMN_WIDTHS: WorkTableColumnWidths = [
  11, 8, 9, 13, 11, 13, 11, 11, 13,
];

export interface AppPreferences {
  tableDensity: TableDensity;
  accentTheme: AccentTheme;
  navigationOrder: NavigationItemId[];
  navigationTabColors: NavigationTabColors;
  workTableColumnWidths: WorkTableColumnWidths;
}

export const DEFAULT_NAVIGATION_TAB_COLORS: NavigationTabColors = {
  dashboard: 'crimson',
  work: 'crimson',
  debts: 'crimson',
  portfolio: 'crimson',
  alcohol: 'crimson',
  settings: 'crimson',
};

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  tableDensity: 'very-compact',
  accentTheme: 'crimson',
  navigationOrder: [...NAVIGATION_ITEM_IDS],
  navigationTabColors: DEFAULT_NAVIGATION_TAB_COLORS,
  workTableColumnWidths: [...DEFAULT_WORK_TABLE_COLUMN_WIDTHS],
};

export type AppPreferenceKey = keyof AppPreferences;
