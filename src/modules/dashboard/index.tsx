import { CreditCard, HandCoins, History, WalletCards } from 'lucide-react';

import CompactFinancialPlan from '@/modules/dashboard/components/CompactFinancialPlan';
import DashboardLoading from '@/modules/dashboard/components/DashboardLoading';
import QuickWorkActions from '@/modules/dashboard/components/QuickWorkActions';
import TodayWorkSummary from '@/modules/dashboard/components/TodayWorkSummary';
import WeeklyWorkOverview from '@/modules/dashboard/components/WeeklyWorkOverview';
import { useCurrentWorkWeek } from '@/modules/work/hooks/useCurrentWorkWeek';
import type { WorkDay, WorkWeekGoals } from '@/modules/work/types/work.types';
import {
  calculateWorkProgress,
  calculateWorkWeekSummary,
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

const otherModules = [
  {
    title: 'Wydatki',
    value: '0,00 zł',
    description: 'Moduł w przygotowaniu',
    icon: CreditCard,
    to: '/expenses',
  },
  {
    title: 'Długi',
    value: '0,00 zł',
    description: 'Moduł w przygotowaniu',
    icon: HandCoins,
    to: '/debts',
  },
  {
    title: 'Portfel',
    value: '0,00 zł',
    description: 'Moduł w przygotowaniu',
    icon: WalletCards,
    to: '/portfolio',
  },
];

function DashboardError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-5">
      <h1 className="text-base font-semibold text-red-200">Nie udało się wczytać Dashboardu</h1>

      <p className="mt-2 text-sm text-red-300/80">{message}</p>
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
      <DashboardError message={error ?? 'W lokalnej bazie nie znaleziono aktywnego tygodnia.'} />
    );
  }

  const todayIsoDate = getLocalIsoDate();
  const todayWorkDay = findWorkDayByDate(week, todayIsoDate);
  const todayLabel = capitalizeFirstLetter(formatLongLocalDate(todayIsoDate));

  const summary = calculateWorkWeekSummary(week);
  const progress = calculateWorkProgress(week, summary.totalMessages);

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

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Bieżący dzień, tydzień i najważniejsze szybkie działania."
        action={
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-500">
            {isSaving ? 'Zapisywanie…' : 'Dane aktualne'}
          </span>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-2.5 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)]">
        <TodayWorkSummary
          dateLabel={todayLabel}
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
          <SectionCard title="Szybkie akcje" description="Brak dzisiejszego rekordu">
            <div className="flex min-h-32 flex-col items-center justify-center text-center">
              <History aria-hidden="true" className="size-5 text-zinc-600" />

              <p className="mt-3 text-sm text-zinc-400">Utwórz nowy aktywny tydzień.</p>
            </div>
          </SectionCard>
        )}
      </div>

      <WeeklyWorkOverview week={week} summary={summary} progress={progress} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(21rem,0.75fr)]">
        <CompactFinancialPlan items={week.financialPlan} summary={summary} />

        <section aria-label="Pozostałe moduły" className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {otherModules.map((metric) => (
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
      </div>
    </div>
  );
}
