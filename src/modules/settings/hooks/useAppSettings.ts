import { useCallback, useEffect, useState } from 'react';

import {
  APP_SETTINGS_CHANGED_EVENT,
  appSettingsService,
} from '@/modules/settings/services/appSettingsService';
import {
  DEFAULT_APP_PREFERENCES,
  type AppPreferenceKey,
  type AppPreferences,
} from '@/modules/settings/types/appSettings.types';

type UseAppSettingsResult = {
  preferences: AppPreferences;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  savePreference: <Key extends AppPreferenceKey>(
    key: Key,
    value: AppPreferences[Key]
  ) => Promise<void>;
  resetPreferences: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Nie udało się obsłużyć ustawień aplikacji.';
}

export function useAppSettings(): UseAppSettingsResult {
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_APP_PREFERENCES);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refreshPreferences = useCallback(async () => {
    try {
      const storedPreferences = await appSettingsService.getPreferences();

      setPreferences(storedPreferences);
      setError(null);
    } catch (refreshError) {
      setError(getErrorMessage(refreshError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPreferences();
  }, [refreshPreferences]);

  useEffect(() => {
    function handleSettingsChanged() {
      void refreshPreferences();
    }

    function handleWindowFocus() {
      void refreshPreferences();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void refreshPreferences();
      }
    }

    window.addEventListener(APP_SETTINGS_CHANGED_EVENT, handleSettingsChanged);

    window.addEventListener('focus', handleWindowFocus);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener(APP_SETTINGS_CHANGED_EVENT, handleSettingsChanged);

      window.removeEventListener('focus', handleWindowFocus);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshPreferences]);

  const savePreference = useCallback(
    async <Key extends AppPreferenceKey>(key: Key, value: AppPreferences[Key]) => {
      setIsSaving(true);
      setError(null);

      try {
        const updatedPreferences = await appSettingsService.savePreference(key, value);

        setPreferences(updatedPreferences);
      } catch (saveError) {
        setError(getErrorMessage(saveError));

        throw saveError;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const resetPreferences = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const defaultPreferences = await appSettingsService.resetPreferences();

      setPreferences(defaultPreferences);
    } catch (resetError) {
      setError(getErrorMessage(resetError));

      throw resetError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    preferences,
    isLoading,
    isSaving,
    error,
    savePreference,
    resetPreferences,
    refreshPreferences,
  };
}
