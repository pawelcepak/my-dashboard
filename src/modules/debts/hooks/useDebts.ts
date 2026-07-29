import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { database } from '@/database/database';
import { debtService } from '@/modules/debts/services/debtService';
import type {
  DebtBalanceUpdateInput,
  DebtInput,
  DebtPaymentInput,
} from '@/modules/debts/types/debt.types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Wystąpił nieznany błąd modułu Długi.';
}

export function useDebts() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const data = useLiveQuery(async () => {
    const [debts, events] = await Promise.all([
      database.debts.toArray(),
      database.debtEvents.toArray(),
    ]);
    return {
      debts: [...debts].sort((a, b) => a.name.localeCompare(b.name, 'pl-PL')),
      events: [...events].sort((a, b) =>
        b.date === a.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)
      ),
    };
  }, []);

  useEffect(() => {
    let active = true;
    debtService
      .initialize()
      .catch((e) => active && setError(getErrorMessage(e)))
      .finally(() => active && setIsInitializing(false));
    return () => {
      active = false;
    };
  }, []);

  const runAction = useCallback(async <T>(action: () => Promise<T>): Promise<T> => {
    setIsSaving(true);
    setError(null);
    try {
      return await action();
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    debts: data?.debts ?? [],
    events: data?.events ?? [],
    isLoading: isInitializing || data === undefined,
    isSaving,
    error,
    createDebt: (input: DebtInput) => runAction(() => debtService.createDebt(input)),
    updateDebt: (id: string, input: DebtInput) =>
      runAction(() => debtService.updateDebt(id, input)),
    addPayment: (input: DebtPaymentInput) => runAction(() => debtService.addPayment(input)),
    updateBalance: (input: DebtBalanceUpdateInput) =>
      runAction(() => debtService.updateBalance(input)),
    deleteEvent: (id: string) => runAction(() => debtService.deleteEvent(id)),
    deleteDebt: (id: string) => runAction(() => debtService.deleteDebt(id)),
  };
}
