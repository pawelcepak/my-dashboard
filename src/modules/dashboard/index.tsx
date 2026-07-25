import { BriefcaseBusiness, CreditCard, HandCoins, History, WalletCards } from 'lucide-react';

import DashboardLoading from '@/modules/dashboard/components/DashboardLoading';
import QuickWorkActions from '@/modules/dashboard/components/QuickWorkActions';
import TodayWorkSummary from '@/modules/dashboard/components/TodayWorkSummary';
import WeeklyWorkOverview from '@/modules/dashboard/components/WeeklyWorkOverview';
import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import { useCurrentWorkWeek } from '@/modules/work/hooks/useCurrentWorkWeek';
import type { FinancialPlanItem, WorkDay, WorkWeekGoals } from '@/modules/work/types/work.types';
import {
  calculateWorkProgress,
  calculateWorkWeekSummary,
  formatCurrencyPln,
  formatHours,
  formatNumber,
} from '@/modules/work/utils/workCalculations';
import {
  capitalizeFirstLetter,
  findWorkDayByDate,
  formatLongLocalDate,
  getLocalIsoDate,
  isDateInsideWorkWeek,
} from '@/modules/work/utils/workDate';
import MetricCard from '@/shared/components/MetricCard';
import PageHeader from '@/shared/components/PageHeader';
import SectionCard from '@/shared/components/SectionCard';

const emptyDashboardMetrics = [
  {
    title: 'Wydatki',
    value: '0,00 zł',
    description: 'Moduł zostanie dodany w kolejnych wersjach',
    icon: CreditCard,
    to: '/expenses',
  },
  {
    title: 'Długi',
    value: '0,00 zł',
    description: 'Moduł zostanie dodany w kolejnych wersjach',
    icon: HandCoins,
    to: '/debts',
  },
  {
    title: 'Portfel',
    value: '0,00 zł',
    description: 'Moduł zostanie dodany w kolejnych wersjach',
    icon: WalletCards,
    to: '/portfolio',
  },
];

function DashboardError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
      <h1 className="text-lg font-semibold text-red-200">Nie udało się wczytać Dashboardu</h1>

      <p className="mt-2 text-sm leading-6 text-red-300/80">{message}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { week, isLoading, isSaving, error, updateWeek } = useCurrentWorkWeek();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!week) {
    return (
      <DashboardError
        message={error ?? 'W lokalnej bazie nie znaleziono aktywnego tygodnia pracy.'}
      />
    );
  }

  const todayIsoDate = getLocalIsoDate();
  const todayWorkDay = findWorkDayByDate(week, todayIsoDate);

  const formattedTodayDate = capitalizeFirstLetter(formatLongLocalDate(todayIsoDate));

  const summary = calculateWorkWeekSummary(week);

  const progress = calculateWorkProgress(week, summary.totalMessages);

  const workMetric = {
    title: 'Praca',
    value: `${formatHours(summary.totalHours)} godz.`,
    description: `${formatNumber(summary.totalMessages)} wiadomości · ${formatCurrencyPln(
      summary.netEarningsPln
    )}`,
    icon: BriefcaseBusiness,
    to: '/work',
  };

  async function updateTodayDay(updatedDay: WorkDay) {
    await updateWeek((currentWeek) => ({
      ...currentWeek,
      days: currentWeek.days.map((day) => (day.id === updatedDay.id ? updatedDay : day)),
    }));
  }

  async function updateGoals(goals: WorkWeekGoals) {
    await updateWeek((currentWeek) => ({
      ...currentWeek,
      goals,
    }));
  }

  function updateFinancialPlan(items: FinancialPlanItem[]) {
    void updateWeek((currentWeek) => ({
      ...currentWeek,
      financialPlan: items,
    }));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Codzienne podsumowanie pracy, celów i finansów."
        action={
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400">
            {isSaving ? 'Zapisywanie…' : 'Dane lokalne aktualne'}
          </span>
        }
      />

      {error && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section
        aria-label="Najważniejsze podsumowania"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          title={workMetric.title}
          value={workMetric.value}
          description={workMetric.description}
          icon={workMetric.icon}
          to={workMetric.to}
        />

        {emptyDashboardMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            to={metric.to}
          />
        ))}
      </section>

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <TodayWorkSummary
          dateLabel={formattedTodayDate}
          day={todayWorkDay}
          isInsideCurrentWeek={isDateInsideWorkWeek(week, todayIsoDate)}
        />

        {todayWorkDay ? (
          <QuickWorkActions
            day={todayWorkDay}
            week={week}
            isSaving={isSaving}
            onUpdateDay={updateTodayDay}
            onUpdateGoals={updateGoals}
          />
        ) : (
          <SectionCard title="Szybkie akcje" description="Edycja danych bieżącego dnia">
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 px-6 py-10 text-center">
              <History aria-hidden="true" className="size-6 text-zinc-600" />

              <p className="mt-4 text-sm font-medium text-zinc-300">Szybkie akcje są niedostępne</p>

              <p className="mt-1 max-w-md text-sm leading-6 text-zinc-500">
                Aktywny tydzień nie zawiera rekordu odpowiadającego dzisiejszej dacie.
              </p>
            </div>
          </SectionCard>
        )}
      </div>

      <WeeklyWorkOverview week={week} summary={summary} progress={progress} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.65fr)]">
        <FinancialPlanSummary
          items={week.financialPlan}
          summary={summary}
          exchangeRateEurPln={week.exchangeRateEurPln}
          onItemsChange={updateFinancialPlan}
        />

        <SectionCard
          title="Ostatnia aktywność"
          description="Historia operacji zostanie dodana później"
        >
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
              <History aria-hidden="true" className="size-5" />
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-300">
              Rejestr aktywności nie jest jeszcze dostępny
            </p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
              W kolejnych wersjach pojawią się tutaj ostatnie zmiany wprowadzone w aplikacji.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
