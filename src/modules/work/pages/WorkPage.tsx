import { CalendarDays, LoaderCircle } from 'lucide-react';

import WorkWeekManager from '@/modules/work/components/WorkWeekManager';
import WorkActiveWeekContainer from '@/modules/work/containers/WorkActiveWeekContainer';
import WorkFinancialContainer from '@/modules/work/containers/WorkFinancialContainer';
import WorkMainGridContainer from '@/modules/work/containers/WorkMainGridContainer';
import { useCurrentWorkWeek } from '@/modules/work/hooks/useCurrentWorkWeek';
import {
  calculateWorkProgress,
  calculateWorkWeekSummary,
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

  if (isLoading) {
    return <WorkPageLoading />;
  }

  if (!week) {
    return <WorkPageError message={error ?? 'W bazie danych nie znaleziono tygodnia pracy.'} />;
  }

  const activeWeek = week;

  const summary = calculateWorkWeekSummary(activeWeek);

  const progress = calculateWorkProgress(activeWeek, summary.totalMessages);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Praca"
        description="Rejestr wiadomości, czasu pracy, zarobków i tygodniowych celów."
        action={
          <div className="w-full sm:w-[38rem]">
            <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-300">
              <CalendarDays aria-hidden="true" className="size-4 text-zinc-500" />

              <span>
                Tydzień {activeWeek.weekNumber}, {activeWeek.year}
              </span>
            </div>

            <WorkWeekManager
              activeWeek={activeWeek}
              weeks={weeks}
              isSaving={isSaving}
              onSelectWeek={selectWeek}
              onCreateWeek={createWeek}
              onDeleteWeek={deleteWeek}
            />
          </div>
        }
      />

      {error && <div className="app-notice app-notice-error">{error}</div>}

      <WorkActiveWeekContainer week={activeWeek} summary={summary} isSaving={isSaving} />

      <WorkMainGridContainer
        activeWeek={activeWeek}
        weeks={weeks}
        summary={summary}
        isSaving={isSaving}
        updateWeek={updateWeek}
        resetWeek={resetWeek}
        selectWeek={selectWeek}
      />

      <WorkFinancialContainer
        activeWeek={activeWeek}
        summary={summary}
        progress={progress}
        updateWeek={updateWeek}
      />
    </div>
  );
}
