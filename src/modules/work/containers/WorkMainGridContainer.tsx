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
import CollapsiblePanel from '@/shared/components/CollapsiblePanel';

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
      const updatedWeek: WorkWeek = { ...currentWeek, days: updatedDays };

      return { ...updatedWeek, heldMessages: getDailyHeldMessagesTotal(updatedWeek) };
    });
  }

  function handleReset() {
    const shouldReset = window.confirm(
      `Czy wyczyścić dane tygodnia ${activeWeek.weekNumber} roku ${activeWeek.year}? Wiadomości, bloki, piwa, oceny, odpowiedzi i zatrzymane wiadomości zostaną usunięte.`
    );

    if (!shouldReset) return;

    setSelectedDayId(null);
    void resetWeek();
  }

  return (
    <>
      <div className="work-dashboard-grid">
        <div className="min-w-0 space-y-3">
          <div
            id="work-days"
            className="page-section-anchor [&_.work-spreadsheet-table]:!min-w-[58rem] [&_.work-col-date]:!w-[11%] [&_.work-col-beers]:!w-[7%] [&_.work-col-rating]:!w-[8%] [&_.work-col-held]:!w-[11%] [&_.work-col-messages]:!w-[10%] [&_.work-col-responses]:!w-[11%] [&_.work-col-response-rate]:!w-[10%] [&_.work-col-hours]:!w-[15%] [&_.work-col-average]:!w-[17%]"
          >
            <WorkDaysTable
              days={activeWeek.days}
              isSaving={isSaving}
              tableDensity={preferences.tableDensity}
              onUpdateDay={updateDay}
              onEditSessions={setSelectedDayId}
            />
          </div>

          <div id="work-week-settings" className="page-section-anchor">
            <WorkWeekSettings
              exchangeRateEurPln={activeWeek.exchangeRateEurPln}
              onExchangeRateChange={(exchangeRateEurPln) => {
                void updateWeek((currentWeek) => ({ ...currentWeek, exchangeRateEurPln }));
              }}
              onReset={handleReset}
            />
          </div>

          <div id="work-history" className="page-section-anchor">
            <WorkHistory
              weeks={weeks}
              activeWeekId={activeWeek.id}
              isSaving={isSaving}
              compact
              onSelectWeek={selectWeek}
            />
          </div>

          <div id="work-analysis" className="page-section-anchor">
            <CollapsiblePanel
              storageKey="work-chb-intelligence"
              title="CHB Intelligence"
              description="Dodatkowe analizy danych pracy"
              defaultOpen={false}
              contentClassName="p-3"
            >
              <WorkIntelligencePanel week={activeWeek} />
            </CollapsiblePanel>
          </div>
        </div>

        <aside className="min-w-0 space-y-3">
          <div id="work-summary" className="page-section-anchor">
            <WorkSummaryGrid summary={summary} goals={activeWeek.goals} />
          </div>

          <div id="work-time-analysis" className="page-section-anchor">
            <WorkTimeAnalyticsPanel analytics={timeAnalytics} weekStartDate={activeWeek.startDate} />
          </div>
        </aside>
      </div>

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
