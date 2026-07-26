import { CalendarDays, Database, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import WorkDayEditor from '@/modules/work/components/WorkDayEditor';
import WorkDaysTable from '@/modules/work/components/WorkDaysTable';
import WorkHistory from '@/modules/work/components/WorkHistory';
import WorkProgressCard from '@/modules/work/components/WorkProgressCard';
import WorkSummaryGrid from '@/modules/work/components/WorkSummaryGrid';
import WorkWeekManager from '@/modules/work/components/WorkWeekManager';
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

        <p className="mt-1 text-sm text-zinc-500">Otwieranie lokalnej bazy danych.</p>
      </div>
    </div>
  );
}

function WorkPageError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
      <h1 className="text-lg font-semibold text-red-200">Nie udało się wczytać danych</h1>

      <p className="mt-2 text-sm leading-6 text-red-300/80">{message}</p>
    </div>
  );
}

export default function WorkPage() {
  const {
    week,
    weeks,
    isLoading,
    isSaving,
    error,
    updateWeek,
    resetWeek,
    selectWeek,
    createWeek,
    deleteWeek,
  } = useCurrentWorkWeek();

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDayId(null);
  }, [week?.id]);

  if (isLoading) {
    return <WorkPageLoading />;
  }

  if (!week) {
    return <WorkPageError message={error ?? 'W bazie danych nie znaleziono tygodnia pracy.'} />;
  }

  const activeWeek = week;

  const summary = calculateWorkWeekSummary(activeWeek);

  const progress = calculateWorkProgress(activeWeek, summary.totalMessages);

  const selectedDay = activeWeek.days.find((day) => day.id === selectedDayId) ?? null;

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
      `Czy wyczyścić dane tygodnia ${activeWeek.weekNumber} roku ${activeWeek.year}? Wiadomości, bloki, piwa, oceny i zatrzymane wiadomości zostaną usunięte.`
    );

    if (!shouldReset) {
      return;
    }

    setSelectedDayId(null);
    void resetWeek();
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Praca"
        description="Rejestr wiadomości, czasu pracy, zarobków i tygodniowych celów."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300">
            <CalendarDays aria-hidden="true" className="size-4 text-zinc-500" />

            <span>
              Tydzień {activeWeek.weekNumber}, {activeWeek.year}
            </span>
          </div>
        }
      />

      <WorkWeekManager
        activeWeek={activeWeek}
        weeks={weeks}
        isSaving={isSaving}
        onSelectWeek={selectWeek}
        onCreateWeek={createWeek}
        onDeleteWeek={deleteWeek}
      />

      {error && <div className="app-notice app-notice-error">{error}</div>}

      <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Aktywny tydzień
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">
              {formatIsoDate(activeWeek.startDate)}
              {' – '}
              {formatIsoDate(activeWeek.endDate)}
            </h2>

            <p className="mt-1.5 text-sm text-zinc-500">
              Stawka za wiadomość:{' '}
              <span className="font-semibold text-zinc-300">
                {formatCurrencyEur(summary.messageRateEur)}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/65 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Brutto
              </p>

              <p className="mt-1 text-lg font-bold text-zinc-100">
                {formatCurrencyEur(summary.grossEarningsEur)}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-950/65 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Status danych
              </p>

              <p
                className={`mt-1 text-sm font-bold ${
                  isSaving ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {isSaving ? 'Zapisywanie…' : 'Zapisano lokalnie'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-zinc-700 bg-zinc-950/25 px-4 py-2.5 text-xs text-zinc-500 sm:px-5">
          <Database aria-hidden="true" className="size-3.5 shrink-0" />
          Dane wszystkich tygodni są zapisywane lokalnie i synchronizowane z prywatną chmurą.
        </div>
      </section>

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,1fr)_minmax(18rem,1fr)]">
        <div className="min-w-0">
          <WorkDaysTable
            days={activeWeek.days}
            heldMessages={activeWeek.heldMessages}
            selectedDayId={selectedDayId}
            onEditDay={setSelectedDayId}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <WorkSummaryGrid summary={summary} goals={activeWeek.goals} />

          <WorkWeekSettings
            heldMessages={activeWeek.heldMessages}
            exchangeRateEurPln={activeWeek.exchangeRateEurPln}
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

        <div className="min-w-0">
          <WorkHistory
            weeks={weeks}
            activeWeekId={activeWeek.id}
            isSaving={isSaving}
            onSelectWeek={selectWeek}
            constrainedHeight
          />
        </div>
      </div>

      {selectedDay && (
        <WorkDayEditor
          day={selectedDay}
          onChange={updateDay}
          onClose={() => setSelectedDayId(null)}
        />
      )}

      <WorkProgressCard
        totalMessages={summary.totalMessages}
        progress={progress}
        goals={activeWeek.goals}
      />

      <FinancialPlanSummary
        items={activeWeek.financialPlan}
        summary={summary}
        exchangeRateEurPln={activeWeek.exchangeRateEurPln}
        onItemsChange={updateFinancialPlan}
      />
    </div>
  );
}
