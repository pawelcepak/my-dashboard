import { useEffect, useState } from 'react';

import { useAppSettings } from '@/modules/settings/hooks/useAppSettings';
import WorkDayEditor from '@/modules/work/components/WorkDayEditor';
import WorkDaysTable from '@/modules/work/components/WorkDaysTable';
import WorkHistory from '@/modules/work/components/WorkHistory';
import WorkIntelligencePanel from '@/modules/work/components/WorkIntelligencePanel';
import WorkSummaryGrid from '@/modules/work/components/WorkSummaryGrid';
import WorkTimeAnalyticsPanel from '@/modules/work/components/WorkTimeAnalyticsPanel';
import WorkWeekSettings from '@/modules/work/components/WorkWeekSettings';
import type { WorkDay, WorkWeek, WorkWeekSummary } from '@/modules/work/types/work.types';
import { getDailyHeldMessagesTotal } from '@/modules/work/utils/workCalculations';
import { calculateWorkTimeAnalytics } from '@/modules/work/utils/workTimeAnalytics';

type WorkWeekUpdater = (week: WorkWeek) => WorkWeek;

type WorkMainGridContainerProps = {
  activeWeek: WorkWeek;
  weeks: WorkWeek[];
  summary: WorkWeekSummary;
  isSaving: boolean;
  updateWeek: (updater: WorkWeekUpdater) => Promise<void>;
  resetWeek: () => Promise<void>;
  selectWeek: (workWeekId: string) => Promise<void>;
};

export default function WorkMainGridContainer({
  activeWeek,
  weeks,
  summary,
  isSaving,
  updateWeek,
  resetWeek,
  selectWeek,
}: WorkMainGridContainerProps) {
  const { preferences } = useAppSettings();

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDayId(null);
  }, [activeWeek.id]);

  const selectedDay = activeWeek.days.find((day) => day.id === selectedDayId) ?? null;

  const timeAnalytics = calculateWorkTimeAnalytics(activeWeek, weeks);

  function updateDay(updatedDay: WorkDay) {
    void updateWeek((currentWeek) => {
      const updatedDays = currentWeek.days.map((day) =>
        day.id === updatedDay.id ? updatedDay : day
      );

      const updatedWeek: WorkWeek = {
        ...currentWeek,
        days: updatedDays,
      };

      return {
        ...updatedWeek,
        heldMessages: getDailyHeldMessagesTotal(updatedWeek),
      };
    });
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
    <>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.75fr)]">
        <div className="min-w-0">
          <WorkDaysTable
            days={activeWeek.days}
            isSaving={isSaving}
            tableDensity={preferences.tableDensity}
            onUpdateDay={updateDay}
            onEditSessions={setSelectedDayId}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <WorkSummaryGrid summary={summary} goals={activeWeek.goals} />

          <WorkTimeAnalyticsPanel analytics={timeAnalytics} weekStartDate={activeWeek.startDate} />

          <WorkWeekSettings
            exchangeRateEurPln={activeWeek.exchangeRateEurPln}
            onExchangeRateChange={(exchangeRateEurPln) => {
              void updateWeek((currentWeek) => ({
                ...currentWeek,
                exchangeRateEurPln,
              }));
            }}
            onReset={handleReset}
          />
        </div>
      </div>

      <WorkHistory
        weeks={weeks}
        activeWeekId={activeWeek.id}
        isSaving={isSaving}
        onSelectWeek={selectWeek}
      />

      <WorkIntelligencePanel week={activeWeek} />

      {selectedDay && (
        <WorkDayEditor
          day={selectedDay}
          onChange={updateDay}
          onClose={() => setSelectedDayId(null)}
        />
      )}
    </>
  );
}
