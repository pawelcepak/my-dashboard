import { LoaderCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import AlcoholCalendar from '@/modules/alcohol/components/AlcoholCalendar';
import AlcoholHistory from '@/modules/alcohol/components/AlcoholHistory';
import AlcoholSettingsPanel from '@/modules/alcohol/components/AlcoholSettingsPanel';
import AlcoholSummary from '@/modules/alcohol/components/AlcoholSummary';
import { useAlcohol } from '@/modules/alcohol/hooks/useAlcohol';
import {
  calculateAlcoholOverview,
  createAlcoholDayStatuses,
  createAlcoholMonthSummaries,
} from '@/modules/alcohol/utils/alcoholCalculations';
import PageHeader from '@/shared/components/PageHeader';

function getCurrentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function AlcoholPage() {
  const { data, isLoading, isSaving, error, toggleDay, clearOverride, updateExpenseTagIds } =
    useAlcohol();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const computed = useMemo(() => {
    if (!data?.settings) {
      return null;
    }

    const statuses = createAlcoholDayStatuses(data.workWeeks, data.overrides);

    const months = createAlcoholMonthSummaries(
      data.workWeeks,
      data.overrides,
      data.manualExpenses,
      data.portfolioTransactions,
      data.settings
    );

    return {
      statuses,
      months,
      overview: calculateAlcoholOverview(statuses, months),
    };
  }, [data]);

  if (isLoading || !data?.settings || !computed) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-8 animate-spin text-zinc-500" />
          <p className="mt-4 text-sm font-medium text-zinc-300">Wczytywanie statystyk alkoholu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Alkohol"
        description="Dni picia z Work, koszty z Portfela i ręczne korekty historyczne."
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

      <AlcoholSummary overview={computed.overview} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(24rem,0.85fr)_minmax(28rem,1.15fr)]">
        <AlcoholCalendar
          month={selectedMonth}
          statuses={computed.statuses}
          isSaving={isSaving}
          onMonthChange={setSelectedMonth}
          onToggleDay={toggleDay}
          onClearOverride={clearOverride}
        />

        <AlcoholHistory months={computed.months} />
      </div>

      <AlcoholSettingsPanel
        tags={data.portfolioTags}
        selectedTagIds={data.settings.expenseTagIds}
        isSaving={isSaving}
        onChange={updateExpenseTagIds}
      />
    </div>
  );
}
