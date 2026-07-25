import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { database } from '@/database/database';
import { workWeekService } from '@/modules/work/services/workWeekService';
import type { WorkWeek } from '@/modules/work/types/work.types';

type UseCurrentWorkWeekResult = {
  week: WorkWeek | undefined;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateWeek: (updater: (week: WorkWeek) => WorkWeek) => Promise<void>;
  resetWeek: () => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Wystąpił nieznany błąd podczas obsługi danych.';
}

export function useCurrentWorkWeek(): UseCurrentWorkWeekResult {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const week = useLiveQuery(() => database.workWeeks.orderBy('startDate').last(), []);

  useEffect(() => {
    let isMounted = true;

    async function initializeDatabase() {
      try {
        await workWeekService.initialize();

        if (isMounted) {
          setError(null);
        }
      } catch (initializationError) {
        if (isMounted) {
          setError(getErrorMessage(initializationError));
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    void initializeDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateWeek = useCallback(
    async (updater: (currentWeek: WorkWeek) => WorkWeek): Promise<void> => {
      if (!week) {
        return;
      }

      setIsSaving(true);

      try {
        await workWeekService.updateWeek(week.id, updater);
        setError(null);
      } catch (updateError) {
        setError(getErrorMessage(updateError));
        throw updateError;
      } finally {
        setIsSaving(false);
      }
    },
    [week]
  );

  const resetWeek = useCallback(async (): Promise<void> => {
    if (!week) {
      return;
    }

    setIsSaving(true);

    try {
      await workWeekService.resetWeek(week.id);
      setError(null);
    } catch (resetError) {
      setError(getErrorMessage(resetError));
      throw resetError;
    } finally {
      setIsSaving(false);
    }
  }, [week]);

  return {
    week,
    isLoading: isInitializing || week === undefined,
    isSaving,
    error,
    updateWeek,
    resetWeek,
  };
}
