import { CalendarDays, Database, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import WorkDayEditor from '@/modules/work/components/WorkDayEditor';
import WorkDaysTable from '@/modules/work/components/WorkDaysTable';
import WorkProgressCard from '@/modules/work/components/WorkProgressCard';
import WorkSummaryGrid from '@/modules/work/components/WorkSummaryGrid';
import WorkWeekSettings from '@/modules/work/components/WorkWeekSettings';
import { useCurrentWorkWeek } from '@/modules/work/hooks/useCurrentWorkWeek';
import type { FinancialPlanItem, WorkDay } from '@/modules/work/types/work.types';
import {
  calculateWorkProgress,
  calculateWorkWeekSummary,
  formatCurrencyEur,
  formatIsoDate,
} from '@/modules/work/utils/workCalculations';
import PageHeader from '@/shared/components/PageHeader';

function WorkPageLoading() {
  return (
    <div className="flex min-h-[28rem] items-center justify-center">
      <div className="text-center">
        <LoaderCircle aria-hidden="true" className="mx-auto size-8 animate-spin text-zinc-500" />

        <p className="mt-4 text-sm font-medium text-zinc-300">Wczytywanie danych pracy</p>

        <p className="mt-1 text-sm text-zinc-600">Otwieranie lokalnej bazy danych.</p>
      </div>
    </div>
  );
}

function WorkPageError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
      <h1 className="text-lg font-semibold text-red-200">Nie udało się wczytać danych</h1>

      <p className="mt-2 text-sm leading-6 text-red-300/80">{message}</p>

      <p className="mt-4 text-sm text-zinc-500">
        Odśwież stronę. Jeżeli problem będzie się powtarzał, sprawdzimy bazę IndexedDB w narzędziach
        przeglądarki.
      </p>
    </div>
  );
}

export default function WorkPage() {
  const { week, isLoading, isSaving, error, updateWeek, resetWeek } = useCurrentWorkWeek();

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  if (isLoading) {
    return <WorkPageLoading />;
  }

  if (!week) {
    return (
      <WorkPageError message={error ?? 'W bazie danych nie znaleziono bieżącego tygodnia pracy.'} />
    );
  }

  const summary = calculateWorkWeekSummary(week);
  const progress = calculateWorkProgress(week, summary.totalMessages);

  const selectedDay = week.days.find((day) => day.id === selectedDayId) ?? null;

  function updateDay(updatedDay: WorkDay) {
    void updateWeek((currentWeek) => ({
      ...currentWeek,
      days: currentWeek.days.map((day) => (day.id === updatedDay.id ? updatedDay : day)),
    }));
  }

  function updateFinancialPlan(items: FinancialPlanItem[]) {
    void updateWeek((currentWeek) => ({
      ...currentWeek,
      financialPlan: items,
    }));
  }

  function handleReset() {
    const shouldReset = window.confirm(
      'Czy na pewno przywrócić dane przykładowe? Obecne zmiany tego tygodnia zostaną zastąpione.'
    );

    if (!shouldReset) {
      return;
    }

    setSelectedDayId(null);
    void resetWeek();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Praca"
        description="Rejestr wiadomości, czasu pracy, zarobków i tygodniowych celów."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300">
            <CalendarDays aria-hidden="true" className="size-4 text-zinc-500" />

            <span>
              Tydzień {week.weekNumber}, {week.year}
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-emerald-900/50 bg-emerald-950/20 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 text-emerald-200">
          <Database aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-400" />

          <p className="leading-6">
            Dane są zapisywane automatycznie w lokalnej bazie przeglądarki i pozostaną po
            odświeżeniu strony.
          </p>
        </div>

        <span className="shrink-0 text-xs font-medium text-emerald-400">
          {isSaving ? 'Zapisywanie…' : 'Zapisano lokalnie'}
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Aktualny tydzień</p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
              {formatIsoDate(week.startDate)}
              {' – '}
              {formatIsoDate(week.endDate)}
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Stawka za zwykłą wiadomość:{' '}
              <span className="font-medium text-zinc-300">
                {formatCurrencyEur(summary.messageRateEur)}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-zinc-600">Zarobek brutto</p>

            <p className="mt-1 text-xl font-semibold text-zinc-100">
              {formatCurrencyEur(summary.grossEarningsEur)}
            </p>
          </div>
        </div>
      </div>

      <WorkSummaryGrid summary={summary} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <WorkProgressCard totalMessages={summary.totalMessages} progress={progress} />

        <WorkWeekSettings
          heldMessages={week.heldMessages}
          exchangeRateEurPln={week.exchangeRateEurPln}
          onHeldMessagesChange={(heldMessages) => {
            void updateWeek((currentWeek) => ({
              ...currentWeek,
              heldMessages,
            }));
          }}
          onExchangeRateChange={(exchangeRateEurPln) => {
            void updateWeek((currentWeek) => ({
              ...currentWeek,
              exchangeRateEurPln,
            }));
          }}
          onReset={handleReset}
        />
      </div>

      {selectedDay && (
        <WorkDayEditor
          day={selectedDay}
          onChange={updateDay}
          onClose={() => setSelectedDayId(null)}
        />
      )}

      <WorkDaysTable days={week.days} selectedDayId={selectedDayId} onEditDay={setSelectedDayId} />

      <FinancialPlanSummary
        items={week.financialPlan}
        summary={summary}
        exchangeRateEurPln={week.exchangeRateEurPln}
        onItemsChange={updateFinancialPlan}
      />
    </div>
  );
}
