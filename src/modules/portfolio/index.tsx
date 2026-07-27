import { LoaderCircle } from 'lucide-react';
import { useMemo } from 'react';

import PortfolioBalanceChart from '@/modules/portfolio/components/PortfolioBalanceChart';
import PortfolioCsvImportPanel from '@/modules/portfolio/components/PortfolioCsvImportPanel';
import PortfolioSettingsPanel from '@/modules/portfolio/components/PortfolioSettingsPanel';
import PortfolioStatisticsPanel from '@/modules/portfolio/components/PortfolioStatisticsPanel';
import PortfolioSummary from '@/modules/portfolio/components/PortfolioSummary';
import PortfolioTransactionForm from '@/modules/portfolio/components/PortfolioTransactionForm';
import PortfolioTransactionsTable from '@/modules/portfolio/components/PortfolioTransactionsTable';
import { usePortfolio } from '@/modules/portfolio/hooks/usePortfolio';
import type { PortfolioTag, PortfolioTransaction } from '@/modules/portfolio/types/portfolio.types';
import { calculatePortfolioSummary } from '@/modules/portfolio/utils/portfolioCalculations';
import PageHeader from '@/shared/components/PageHeader';

export default function PortfolioPage() {
  const {
    account,
    transactions,
    tags,
    isLoading,
    isSaving,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createTag,
    updateTag,
    deleteTag,
    updateAccount,
    importCsvRows,
  } = usePortfolio();

  const summary = useMemo(
    () => (account ? calculatePortfolioSummary(account, transactions) : null),
    [account, transactions]
  );

  if (isLoading || !account || !summary) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center">
        <div className="text-center">
          <LoaderCircle aria-hidden="true" className="mx-auto size-8 animate-spin text-zinc-500" />

          <p className="mt-4 text-sm font-medium text-zinc-300">Wczytywanie portfela</p>
        </div>
      </div>
    );
  }

  async function handleCreateTransaction(
    input: Parameters<typeof createTransaction>[0]
  ): Promise<void> {
    await createTransaction(input);
  }

  async function handleCreateTag(input: Parameters<typeof createTag>[0]): Promise<void> {
    await createTag(input);
  }

  async function handleDeleteTransaction(transaction: PortfolioTransaction) {
    const shouldDelete = window.confirm(
      `Czy usunąć transakcję z dnia ${transaction.date} na kwotę ${transaction.amount.toFixed(
        2
      )} zł?`
    );

    if (shouldDelete) {
      await deleteTransaction(transaction.id);
    }
  }

  async function handleDeleteTag(tag: PortfolioTag) {
    const shouldDelete = window.confirm(
      `Czy usunąć tag „${tag.name}”? Transakcje zachowają się jako „Bez tagu”.`
    );

    if (shouldDelete) {
      await deleteTag(tag.id);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Portfel"
        description="Przychody, wydatki, tagi, saldo i statystyki."
        action={
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isSaving
                ? 'border-amber-800 bg-amber-950/20 text-amber-300'
                : 'border-emerald-800 bg-emerald-950/20 text-emerald-300'
            }`}
          >
            {isSaving ? 'Zapisywanie…' : 'Dane aktualne'}
          </span>
        }
      />

      {error && <div className="app-notice app-notice-error">{error}</div>}

      <PortfolioSummary summary={summary} />

      <PortfolioTransactionForm tags={tags} isSaving={isSaving} onSave={handleCreateTransaction} />

      <PortfolioTransactionsTable
        account={account}
        transactions={transactions}
        tags={tags}
        isSaving={isSaving}
        onUpdate={updateTransaction}
        onDelete={handleDeleteTransaction}
      />

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(21rem,0.65fr)]">
        <PortfolioStatisticsPanel summary={summary} transactions={transactions} tags={tags} />

        <PortfolioCsvImportPanel isSaving={isSaving} onImport={importCsvRows} />
      </div>

      <PortfolioBalanceChart account={account} transactions={transactions} />

      <PortfolioSettingsPanel
        account={account}
        tags={tags}
        isSaving={isSaving}
        onUpdateAccount={updateAccount}
        onCreateTag={handleCreateTag}
        onUpdateTag={updateTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}
