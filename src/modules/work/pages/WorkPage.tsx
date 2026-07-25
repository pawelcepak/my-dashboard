import { useState } from 'react';
import { CalendarDays, Info } from 'lucide-react';

import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import WorkDayEditor from '@/modules/work/components/WorkDayEditor';
import WorkDaysTable from '@/modules/work/components/WorkDaysTable';
import WorkProgressCard from '@/modules/work/components/WorkProgressCard';
import WorkSummaryGrid from '@/modules/work/components/WorkSummaryGrid';
import WorkWeekSettings from '@/modules/work/components/WorkWeekSettings';
import { currentWorkWeek } from '@/modules/work/data/workMockData';
import type { FinancialPlanItem, WorkDay, WorkWeek } from '@/modules/work/types/work.types';
import {
  calculateWorkProgress,
  calculateWorkWeekSummary,
  formatCurrencyEur,
  formatIsoDate,
} from '@/modules/work/utils/workCalculations';
import PageHeader from '@/shared/components/PageHeader';

function createInitialWeek(): WorkWeek {
  return structuredClone(currentWorkWeek);
}

export default function WorkPage() {
  const [week, setWeek] = useState<WorkWeek>(createInitialWeek);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const summary = calculateWorkWeekSummary(week);
  const progress = calculateWorkProgress(week, summary.totalMessages);

  const selectedDay = week.days.find((day) => day.id === selectedDayId) ?? null;

  function updateDay(updatedDay: WorkDay) {
    setWeek((currentWeek) => ({
      ...currentWeek,
      days: currentWeek.days.map((day) => (day.id === updatedDay.id ? updatedDay : day)),
    }));
  }

  function updateFinancialPlan(items: FinancialPlanItem[]) {
    setWeek((currentWeek) => ({
      ...currentWeek,
      financialPlan: items,
    }));
  }

  function resetExampleData() {
    setWeek(createInitialWeek());
    setSelectedDayId(null);
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

      <div className="flex items-start gap-3 rounded-xl border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-400" />

        <p className="leading-6">
          Edycja działa, ale dane nie są jeszcze zapisywane na dysku. Odświeżenie strony przywróci
          dane przykładowe. Trwały zapis zostanie dodany w następnym sprincie.
        </p>
      </div>

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
          onHeldMessagesChange={(heldMessages) =>
            setWeek((currentWeek) => ({
              ...currentWeek,
              heldMessages,
            }))
          }
          onExchangeRateChange={(exchangeRateEurPln) =>
            setWeek((currentWeek) => ({
              ...currentWeek,
              exchangeRateEurPln,
            }))
          }
          onReset={resetExampleData}
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
