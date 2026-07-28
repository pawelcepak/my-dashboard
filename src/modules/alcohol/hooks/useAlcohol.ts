import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { database } from '@/database/database';
import { ALCOHOL_SETTINGS_ID, alcoholService } from '@/modules/alcohol/services/alcoholService';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Nie udało się obsłużyć modułu Alkohol.';
}

export function useAlcohol() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useLiveQuery(async () => {
    const [workWeeks, overrides, manualExpenses, settings, portfolioTransactions, portfolioTags] =
      await Promise.all([
        database.workWeeks.toArray(),
        database.alcoholDayOverrides.toArray(),
        database.alcoholMonthlyExpenses.toArray(),
        database.alcoholSettings.get(ALCOHOL_SETTINGS_ID),
        database.portfolioTransactions.toArray(),
        database.portfolioTags.toArray(),
      ]);

    return {
      workWeeks,
      overrides,
      manualExpenses,
      settings,
      portfolioTransactions,
      portfolioTags: portfolioTags.sort((first, second) =>
        first.name.localeCompare(second.name, 'pl-PL')
      ),
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        await alcoholService.initialize();
      } catch (initializationError) {
        if (active) {
          setError(getErrorMessage(initializationError));
        }
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  const runAction = useCallback(async (action: () => Promise<void>) => {
    setIsSaving(true);
    setError(null);

    try {
      await action();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
      throw actionError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    data,
    isLoading: isInitializing || data === undefined,
    isSaving,
    error,
    toggleDay: (date: string, automaticDrinking: boolean) =>
      runAction(() => alcoholService.toggleDay(date, automaticDrinking)),
    clearOverride: (date: string) => runAction(() => alcoholService.clearOverride(date)),
    updateExpenseTagIds: (tagIds: string[]) =>
      runAction(() => alcoholService.updateExpenseTagIds(tagIds)),
  };
}
