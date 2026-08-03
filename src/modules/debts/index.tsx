import { LoaderCircle } from 'lucide-react';
import { useMemo } from 'react';
import DebtActionsPanel from '@/modules/debts/components/DebtActionsPanel';
import DebtHistory from '@/modules/debts/components/DebtHistory';
import DebtsList from '@/modules/debts/components/DebtsList';
import DebtsSummary from '@/modules/debts/components/DebtsSummary';
import { useDebts } from '@/modules/debts/hooks/useDebts';
import {
  calculateDebtSummary,
  calculateDebtsSummary,
} from '@/modules/debts/utils/debtCalculations';
import PageHeader from '@/shared/components/PageHeader';

export default function DebtsPage() {
  const api = useDebts();
  const rows = useMemo(
    () =>
      api.debts
        .map((d) => calculateDebtSummary(d, api.events))
        .sort((a, b) => b.currentBalance - a.currentBalance),
    [api.debts, api.events]
  );
  const summary = useMemo(
    () => calculateDebtsSummary(api.debts, api.events),
    [api.debts, api.events]
  );
  if (api.isLoading)
    return (
      <div className="flex min-h-[28rem] items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-zinc-500" />
      </div>
    );
  return (
    <div className="space-y-4">
      <PageHeader
        title="Długi"
        sections={[
          { id: 'debts-summary', label: 'Podsumowanie' },
          { id: 'debts-list', label: 'Lista długów' },
          { id: 'debts-actions', label: 'Dodaj / spłata' },
          { id: 'debts-history', label: 'Historia' },
        ]}
        action={
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${api.isSaving ? 'border-amber-800 text-amber-300' : 'border-emerald-800 text-emerald-300'}`}
          >
            {api.isSaving ? 'Zapisywanie…' : 'Dane aktualne'}
          </span>
        }
      />
      {api.error && <div className="app-notice app-notice-error">{api.error}</div>}
      <div id="debts-summary" className="page-section-anchor">
        <DebtsSummary summary={summary} />
      </div>
      <div id="debts-list" className="page-section-anchor">
        <DebtsList
          debts={rows}
          events={api.events}
          isSaving={api.isSaving}
          onUpdate={api.updateDebt}
          onDelete={api.deleteDebt}
        />
      </div>
      <div id="debts-actions" className="page-section-anchor">
        <DebtActionsPanel
          debts={api.debts}
          events={api.events}
          isSaving={api.isSaving}
          onCreateDebt={api.createDebt}
          onPayment={api.addPayment}
          onBalanceUpdate={api.updateBalance}
        />
      </div>
      <div id="debts-history" className="page-section-anchor">
        <DebtHistory
          debts={api.debts}
          events={api.events}
          isSaving={api.isSaving}
          onDelete={api.deleteEvent}
        />
      </div>
    </div>
  );
}
