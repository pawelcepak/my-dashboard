import { LoaderCircle } from 'lucide-react';

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

const WORK_SECTIONS = [
  { id: 'work-overview', label: 'Podsumowanie' },
  { id: 'work-days', label: 'Dni pracy' },
  { id: 'work-history', label: 'Historia' },
  { id: 'work-analysis', label: 'Analiza' },
  { id: 'work-finances', label: 'Finanse' },
];

function WorkPageLoading() {
  return (
    <div className="flex min-h-[28rem] items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="mx-auto size-8 animate-spin text-zinc-500" />
        <p className="mt-4 text-sm font-medium text-zinc-300">Wczytywanie danych pracy</p>
      </div>
    </div>
  );
}

function WorkPageError({ message }: { message: string }) {
  return <div className="app-notice app-notice-error">{message}</div>;
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
  if (isLoading) return <WorkPageLoading />;
  if (!week)
    return <WorkPageError message={error ?? 'W bazie danych nie znaleziono tygodnia pracy.'} />;

  const summary = calculateWorkWeekSummary(week);
  const progress = calculateWorkProgress(week, summary.totalMessages);

  return (
    <div className="space-y-3">
      <PageHeader
        title="Praca"
        sections={WORK_SECTIONS}
        action={
          <WorkWeekManager
            activeWeek={week}
            weeks={weeks}
            isSaving={isSaving}
            onSelectWeek={selectWeek}
            onCreateWeek={createWeek}
            onDeleteWeek={deleteWeek}
          />
        }
      />
      {error && <div className="app-notice app-notice-error">{error}</div>}
      <div id="work-overview" className="page-section-anchor">
        <WorkActiveWeekContainer week={week} summary={summary} isSaving={isSaving} />
      </div>
      <WorkMainGridContainer
        activeWeek={week}
        weeks={weeks}
        summary={summary}
        isSaving={isSaving}
        updateWeek={updateWeek}
        resetWeek={resetWeek}
        selectWeek={selectWeek}
      />
      <div id="work-finances" className="page-section-anchor">
        <WorkFinancialContainer
          activeWeek={week}
          summary={summary}
          progress={progress}
          updateWeek={updateWeek}
        />
      </div>
    </div>
  );
}
