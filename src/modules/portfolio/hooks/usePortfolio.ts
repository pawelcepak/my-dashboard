import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { database } from '@/database/database';
import {
  DEFAULT_PORTFOLIO_ACCOUNT_ID,
  portfolioService,
} from '@/modules/portfolio/services/portfolioService';
import type {
  PortfolioCsvRow,
  PortfolioTagInput,
  PortfolioTransactionInput,
} from '@/modules/portfolio/types/portfolio.types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Wystąpił nieznany błąd modułu Portfel.';
}

export function usePortfolio() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useLiveQuery(async () => {
    const [account, transactions, tags] = await Promise.all([
      database.portfolioAccounts.get(DEFAULT_PORTFOLIO_ACCOUNT_ID),
      database.portfolioTransactions.toArray(),
      database.portfolioTags.toArray(),
    ]);

    return {
      account,
      transactions,
      tags: [...tags].sort((first, second) => first.name.localeCompare(second.name, 'pl-PL')),
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        await portfolioService.initialize();

        if (active) {
          setError(null);
        }
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

  const runAction = useCallback(async <T>(action: () => Promise<T>): Promise<T> => {
    setIsSaving(true);
    setError(null);

    try {
      return await action();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
      throw actionError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    account: data?.account,
    transactions: data?.transactions ?? [],
    tags: data?.tags ?? [],
    isLoading: isInitializing || data === undefined,
    isSaving,
    error,
    createTransaction: (input: PortfolioTransactionInput) =>
      runAction(() => portfolioService.createTransaction(input)),
    updateTransaction: (transactionId: string, input: PortfolioTransactionInput) =>
      runAction(() => portfolioService.updateTransaction(transactionId, input)),
    deleteTransaction: (transactionId: string) =>
      runAction(() => portfolioService.deleteTransaction(transactionId)),
    createTag: (input: PortfolioTagInput) => runAction(() => portfolioService.createTag(input)),
    updateTag: (tagId: string, input: PortfolioTagInput) =>
      runAction(() => portfolioService.updateTag(tagId, input)),
    deleteTag: (tagId: string) => runAction(() => portfolioService.deleteTag(tagId)),
    updateAccount: (initialBalance: number, initialBalanceDate: string) =>
      runAction(() => portfolioService.updateAccount(initialBalance, initialBalanceDate)),
    importCsvRows: (rows: PortfolioCsvRow[]) =>
      runAction(() => portfolioService.importCsvRows(rows)),
  };
}
