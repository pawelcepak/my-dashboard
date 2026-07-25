import { CalendarDays } from 'lucide-react';

import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import WorkDaysTable from '@/modules/work/components/WorkDaysTable';
import WorkProgressCard from '@/modules/work/components/WorkProgressCard';
import WorkSummaryGrid from '@/modules/work/components/WorkSummaryGrid';
import { currentWorkWeek } from '@/modules/work/data/workMockData';
import {
  calculateWorkProgress,
  calculateWorkWeekSummary,
  formatCurrencyEur,
  formatIsoDate,
} from '@/modules/work/utils/workCalculations';
import PageHeader from '@/shared/components/PageHeader';
import SectionCard from '@/shared/components/SectionCard';

export default function WorkPage() {
  const summary = calculateWorkWeekSummary(currentWorkWeek);

  const progress = calculateWorkProgress(currentWorkWeek, summary.totalMessages);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Praca"
        description="Rejestr wiadomości, czasu pracy, zarobków i tygodniowych celów."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300">
            <CalendarDays aria-hidden="true" className="size-4 text-zinc-500" />

            <span>
              Tydzień {currentWorkWeek.weekNumber}, {currentWorkWeek.year}
            </span>
          </div>
        }
      />

      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Aktualny tydzień</p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
              {formatIsoDate(currentWorkWeek.startDate)}
              {' – '}
              {formatIsoDate(currentWorkWeek.endDate)}
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.6fr)]">
        <WorkProgressCard totalMessages={summary.totalMessages} progress={progress} />

        <FinancialPlanSummary
          items={currentWorkWeek.financialPlan}
          summary={summary}
          exchangeRateEurPln={currentWorkWeek.exchangeRateEurPln}
        />
      </div>

      <WorkDaysTable days={currentWorkWeek.days} />

      <SectionCard
        title="Następny etap"
        description="Funkcje planowane w kolejnych sprintach modułu Praca"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            'Dodawanie i edycja dni',
            'Zarządzanie blokami pracy',
            'Historia tygodni',
            'Lokalny zapis danych',
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-400"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
