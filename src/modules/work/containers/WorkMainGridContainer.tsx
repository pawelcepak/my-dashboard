import { useEffect, useState } from 'react';

import WorkDayEditor from '@/modules/work/components/WorkDayEditor';
import WorkDaysTable from '@/modules/work/components/WorkDaysTable';
import WorkHistory from '@/modules/work/components/WorkHistory';
import WorkSummaryGrid from '@/modules/work/components/WorkSummaryGrid';
import WorkWeekSettings from '@/modules/work/components/WorkWeekSettings';
import type { WorkDay, WorkWeek, WorkWeekSummary } from '@/modules/work/types/work.types';
import { getDailyHeldMessagesTotal } from '@/modules/work/utils/workCalculations';

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
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDayId(null);
  }, [activeWeek.id]);

  const selectedDay = activeWeek.days.find((day) => day.id === selectedDayId) ?? null;

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

        /*
         * Pole tygodniowe pozostaje aktualizowane dla zgodności
         * ze starszymi danymi, backupami i wersjami aplikacji.
         *
         * Głównym źródłem prawdy są wartości zapisane w dniach.
         */
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
      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,1fr)_minmax(18rem,1fr)]">
        <div className="min-w-0">
          <WorkDaysTable
            days={activeWeek.days}
            isSaving={isSaving}
            onUpdateDay={updateDay}
            onEditSessions={setSelectedDayId}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <WorkSummaryGrid summary={summary} goals={activeWeek.goals} />

          <WorkWeekSettings
            heldMessages={summary.totalHeldMessages}
            exchangeRateEurPln={activeWeek.exchangeRateEurPln}
            onHeldMessagesChange={() => {
              /*
               * Zatrzymane wiadomości są obecnie edytowane
               * wyłącznie w poszczególnych dniach.
               *
               * Prop pozostaje tymczasowo wymagany przez istniejący
               * komponent WorkWeekSettings.
               */
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
    </>
  );
}
