import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import {
  ACCENT_THEMES,
  DEFAULT_APP_PREFERENCES,
  TABLE_DENSITIES,
  type AccentTheme,
  type AppPreferenceKey,
  type AppPreferences,
  type TableDensity,
} from '@/modules/settings/types/appSettings.types';
import type { AppSetting } from '@/modules/work/types/work.types';

export const APP_SETTINGS_CHANGED_EVENT = 'chb:app-settings-changed';

type AppSettingsChangedDetail = {
  preferences: AppPreferences;
};

function isTableDensity(value: string): value is TableDensity {
  return TABLE_DENSITIES.some((density) => density === value);
}

function isAccentTheme(value: string): value is AccentTheme {
  return ACCENT_THEMES.some((theme) => theme === value);
}

function normalizePreferenceValue<Key extends AppPreferenceKey>(
  key: Key,
  value: string | undefined
): AppPreferences[Key] {
  if (key === 'tableDensity') {
    return (
      value !== undefined && isTableDensity(value) ? value : DEFAULT_APP_PREFERENCES.tableDensity
    ) as AppPreferences[Key];
  }

  if (key === 'accentTheme') {
    return (
      value !== undefined && isAccentTheme(value) ? value : DEFAULT_APP_PREFERENCES.accentTheme
    ) as AppPreferences[Key];
  }

  /*
   * TypeScript powinien uniemożliwić dotarcie do tego miejsca.
   * Zabezpieczenie pozostaje na wypadek przyszłego rozszerzenia typu
   * bez dopisania odpowiedniej normalizacji.
   */
  throw new Error(`Nieobsługiwane ustawienie aplikacji: ${String(key)}.`);
}

function dispatchPreferencesChanged(preferences: AppPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AppSettingsChangedDetail>(APP_SETTINGS_CHANGED_EVENT, {
      detail: {
        preferences,
      },
    })
  );
}

async function getPreference<Key extends AppPreferenceKey>(key: Key): Promise<AppPreferences[Key]> {
  const setting = await database.appSettings.get(key);

  return normalizePreferenceValue(key, setting?.value);
}

async function getPreferences(): Promise<AppPreferences> {
  const [tableDensity, accentTheme] = await Promise.all([
    getPreference('tableDensity'),
    getPreference('accentTheme'),
  ]);

  return {
    tableDensity,
    accentTheme,
  };
}

async function savePreference<Key extends AppPreferenceKey>(
  key: Key,
  value: AppPreferences[Key]
): Promise<AppPreferences> {
  const normalizedValue = normalizePreferenceValue(key, String(value));

  const currentSetting = await database.appSettings.get(key);

  if (currentSetting?.value === normalizedValue) {
    return getPreferences();
  }

  const timestamp = new Date().toISOString();

  const setting: AppSetting = {
    key,
    value: normalizedValue,
    updatedAt: timestamp,
  };

  await database.appSettings.put(setting);

  const preferences = await getPreferences();

  cloudDirtyTracker.markDirty();

  dispatchPreferencesChanged(preferences);

  return preferences;
}

async function savePreferences(nextPreferences: AppPreferences): Promise<AppPreferences> {
  const normalizedPreferences: AppPreferences = {
    tableDensity: normalizePreferenceValue('tableDensity', nextPreferences.tableDensity),
    accentTheme: normalizePreferenceValue('accentTheme', nextPreferences.accentTheme),
  };

  const currentPreferences = await getPreferences();

  if (
    currentPreferences.tableDensity === normalizedPreferences.tableDensity &&
    currentPreferences.accentTheme === normalizedPreferences.accentTheme
  ) {
    return currentPreferences;
  }

  const timestamp = new Date().toISOString();

  const settings: AppSetting[] = [
    {
      key: 'tableDensity',
      value: normalizedPreferences.tableDensity,
      updatedAt: timestamp,
    },
    {
      key: 'accentTheme',
      value: normalizedPreferences.accentTheme,
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
