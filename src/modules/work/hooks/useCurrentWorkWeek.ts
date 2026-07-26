import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { database } from '@/database/database';
import { workWeekService } from '@/modules/work/services/workWeekService';
import type { WorkWeek, WorkWeekCreateOptions } from '@/modules/work/types/work.types';

type WorkWeekQueryResult = {
  activeWeek: WorkWeek | undefined;
  weeks: WorkWeek[];
};

type UseCurrentWorkWeekResult = {
  week: WorkWeek | undefined;
  weeks: WorkWeek[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateWeek: (updater: (week: WorkWeek) => WorkWeek) => Promise<void>;
  resetWeek: () => Promise<void>;
  selectWeek: (workWeekId: string) => Promise<void>;
  createWeek: (options: WorkWeekCreateOptions) => Promise<WorkWeek | undefined>;
  deleteWeek: (workWeekId: string) => Promise<void>;
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

  const queryResult = useLiveQuery(async (): Promise<WorkWeekQueryResult> => {
    const weeks = await database.workWeeks.orderBy('startDate').reverse().toArray();

    const activeSetting = await database.appSettings.get('activeWorkWeekId');

    const activeWeek =
      weeks.find((candidateWeek) => candidateWeek.id === activeSetting?.value) ?? weeks[0];

    return {
      activeWeek,
      weeks,
    };
  }, []);

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

  const week = queryResult?.activeWeek;
  const weeks = queryResult?.weeks ?? [];

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

  const selectWeek = useCallback(async (workWeekId: string): Promise<void> => {
    setIsSaving(true);

    try {
      await workWeekService.setActiveWeek(workWeekId);
      setError(null);
    } catch (selectionError) {
      setError(getErrorMessage(selectionError));
      throw selectionError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const createWeek = useCallback(
    async (options: WorkWeekCreateOptions): Promise<WorkWeek | undefined> => {
      setIsSaving(true);

      try {
        const newWeek = await workWeekService.createWeek(options);

        setError(null);

        return newWeek;
      } catch (creationError) {
        setError(getErrorMessage(creationError));
        throw creationError;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const deleteWeek = useCallback(async (workWeekId: string): Promise<void> => {
    setIsSaving(true);

    try {
      await workWeekService.deleteWeek(workWeekId);
      setError(null);
    } catch (deletionError) {
      setError(getErrorMessage(deletionError));
      throw deletionError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    week,
    weeks,
    isLoading: isInitializing || queryResult === undefined,
    isSaving,
    error,
    updateWeek,
    resetWeek,
    selectWeek,
    createWeek,
    deleteWeek,
  };
}
