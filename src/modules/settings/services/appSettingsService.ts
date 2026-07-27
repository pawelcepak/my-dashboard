import { NAVIGATION_ITEM_IDS, type NavigationItemId } from '@/app/layout/navigation';
import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import {
  ACCENT_THEMES,
  DEFAULT_APP_PREFERENCES,
  DEFAULT_NAVIGATION_TAB_COLORS,
  NAVIGATION_TAB_COLORS,
  TABLE_DENSITIES,
  type AccentTheme,
  type AppPreferenceKey,
  type AppPreferences,
  type NavigationTabColor,
  type NavigationTabColors,
  type TableDensity,
} from '@/modules/settings/types/appSettings.types';
import type { AppSetting } from '@/modules/work/types/work.types';

export const APP_SETTINGS_CHANGED_EVENT = 'chb:app-settings-changed';

type AppSettingsChangedDetail = {
  preferences: AppPreferences;
};

function isTableDensity(value: unknown): value is TableDensity {
  return typeof value === 'string' && TABLE_DENSITIES.some((density) => density === value);
}

function isAccentTheme(value: unknown): value is AccentTheme {
  return typeof value === 'string' && ACCENT_THEMES.some((theme) => theme === value);
}

function isNavigationItemId(value: unknown): value is NavigationItemId {
  return typeof value === 'string' && NAVIGATION_ITEM_IDS.some((itemId) => itemId === value);
}

function isNavigationTabColor(value: unknown): value is NavigationTabColor {
  return typeof value === 'string' && NAVIGATION_TAB_COLORS.some((color) => color === value);
}

function parseJson(value: string | undefined): unknown {
  if (value === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function normalizeNavigationOrder(value: unknown): NavigationItemId[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_APP_PREFERENCES.navigationOrder];
  }

  const uniqueOrder = value.filter(
    (itemId, index): itemId is NavigationItemId =>
      isNavigationItemId(itemId) && value.indexOf(itemId) === index
  );

  const includedIds = new Set(uniqueOrder);

  return [...uniqueOrder, ...NAVIGATION_ITEM_IDS.filter((itemId) => !includedIds.has(itemId))];
}

function normalizeNavigationTabColors(value: unknown): NavigationTabColors {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { ...DEFAULT_NAVIGATION_TAB_COLORS };
  }

  const source = value as Record<string, unknown>;

  return Object.fromEntries(
    NAVIGATION_ITEM_IDS.map((itemId) => [
      itemId,
      isNavigationTabColor(source[itemId]) ? source[itemId] : DEFAULT_NAVIGATION_TAB_COLORS[itemId],
    ])
  ) as NavigationTabColors;
}

function normalizePreferenceValue<Key extends AppPreferenceKey>(
  key: Key,
  storedValue: string | undefined
): AppPreferences[Key] {
  if (key === 'tableDensity') {
    return (
      isTableDensity(storedValue) ? storedValue : DEFAULT_APP_PREFERENCES.tableDensity
    ) as AppPreferences[Key];
  }

  if (key === 'accentTheme') {
    return (
      isAccentTheme(storedValue) ? storedValue : DEFAULT_APP_PREFERENCES.accentTheme
    ) as AppPreferences[Key];
  }

  if (key === 'navigationOrder') {
    return normalizeNavigationOrder(parseJson(storedValue)) as AppPreferences[Key];
  }

  if (key === 'navigationTabColors') {
    return normalizeNavigationTabColors(parseJson(storedValue)) as AppPreferences[Key];
  }

  throw new Error(`Nieobsługiwane ustawienie aplikacji: ${String(key)}.`);
}

function serializePreferenceValue<Key extends AppPreferenceKey>(
  key: Key,
  value: AppPreferences[Key]
): string {
  if (key === 'navigationOrder') {
    return JSON.stringify(normalizeNavigationOrder(value));
  }

  if (key === 'navigationTabColors') {
    return JSON.stringify(normalizeNavigationTabColors(value));
  }

  return String(value);
}

function dispatchPreferencesChanged(preferences: AppPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AppSettingsChangedDetail>(APP_SETTINGS_CHANGED_EVENT, {
      detail: { preferences },
    })
  );
}

async function getPreference<Key extends AppPreferenceKey>(key: Key): Promise<AppPreferences[Key]> {
  const setting = await database.appSettings.get(key);

  return normalizePreferenceValue(key, setting?.value);
}

async function getPreferences(): Promise<AppPreferences> {
  const [tableDensity, accentTheme, navigationOrder, navigationTabColors] = await Promise.all([
    getPreference('tableDensity'),
    getPreference('accentTheme'),
    getPreference('navigationOrder'),
    getPreference('navigationTabColors'),
  ]);

  return {
    tableDensity,
    accentTheme,
    navigationOrder,
    navigationTabColors,
  };
}

async function savePreference<Key extends AppPreferenceKey>(
  key: Key,
  value: AppPreferences[Key]
): Promise<AppPreferences> {
  const serializedValue = serializePreferenceValue(key, value);
  const currentSetting = await database.appSettings.get(key);

  if (currentSetting?.value === serializedValue) {
    return getPreferences();
  }

  const setting: AppSetting = {
    key,
    value: serializedValue,
    updatedAt: new Date().toISOString(),
  };

  await database.appSettings.put(setting);

  const preferences = await getPreferences();

  cloudDirtyTracker.markDirty();
  dispatchPreferencesChanged(preferences);

  return preferences;
}

async function savePreferences(nextPreferences: AppPreferences): Promise<AppPreferences> {
  const normalizedPreferences: AppPreferences = {
    tableDensity: isTableDensity(nextPreferences.tableDensity)
      ? nextPreferences.tableDensity
      : DEFAULT_APP_PREFERENCES.tableDensity,
    accentTheme: isAccentTheme(nextPreferences.accentTheme)
      ? nextPreferences.accentTheme
      : DEFAULT_APP_PREFERENCES.accentTheme,
    navigationOrder: normalizeNavigationOrder(nextPreferences.navigationOrder),
    navigationTabColors: normalizeNavigationTabColors(nextPreferences.navigationTabColors),
  };

  const timestamp = new Date().toISOString();

  const settings: AppSetting[] = [
    {
      key: 'tableDensity',
      value: serializePreferenceValue('tableDensity', normalizedPreferences.tableDensity),
      updatedAt: timestamp,
    },
    {
      key: 'accentTheme',
      value: serializePreferenceValue('accentTheme', normalizedPreferences.accentTheme),
      updatedAt: timestamp,
    },
    {
      key: 'navigationOrder',
      value: serializePreferenceValue('navigationOrder', normalizedPreferences.navigationOrder),
      updatedAt: timestamp,
    },
    {
      key: 'navigationTabColors',
      value: serializePreferenceValue(
        'navigationTabColors',
        normalizedPreferences.navigationTabColors
      ),
      updatedAt: timestamp,
    },
  ];

  await database.appSettings.bulkPut(settings);

  cloudDirtyTracker.markDirty();
  dispatchPreferencesChanged(normalizedPreferences);

  return normalizedPreferences;
}

async function resetPreferences(): Promise<AppPreferences> {
  return savePreferences(DEFAULT_APP_PREFERENCES);
}

export const appSettingsService = {
  getPreference,
  getPreferences,
  savePreference,
  savePreferences,
  resetPreferences,
};
