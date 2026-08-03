import { HandCoins, History, WalletCards } from 'lucide-react';

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
  getDailyHeldMessagesTotal,
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
import DashboardGoalProgress from '@/modules/dashboard/components/DashboardGoalProgress';

const otherModules = [
  {
    title: 'Długi',
    value: '0,00 zł',
    description: 'Zobacz aktualne saldo',
    icon: HandCoins,
    to: '/debts',
  },
  {
    title: 'Portfel',
    value: '0,00 zł',
    description: 'Przejdź do portfela',
    icon: WalletCards,
    to: '/portfolio',
  },
];

function DashboardError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-800 bg-red-950/30 p-5">
      <h1 className="text-base font-semibold text-red-300">Nie udało się wczytać Dashboardu</h1>

      <p className="mt-2 text-sm leading-6 text-red-300">{message}</p>
    </div>
  );
}

function MissingTodayActions() {
  return (
    <section className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/65 px-6 py-8 text-center shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950">
        <History aria-hidden="true" className="size-5 text-zinc-500" />
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-200">Szybka edycja jest niedostępna</p>

      <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
        Dzisiejszy dzień nie znajduje się w aktywnym tygodniu. Utwórz lub wybierz właściwy tydzień w
        module Praca.
      </p>
    </section>
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
    await updateWeek((currentWeek) => {
      const updatedDays = currentWeek.days.map((day) =>
        day.id === updatedDay.id ? updatedDay : day
      );

      const updatedWeek = {
        ...currentWeek,
        days: updatedDays,
      };

      return {
        ...updatedWeek,
        heldMessages: getDailyHeldMessagesTotal(updatedWeek),
      };
    });
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
        sections={[
          { id: 'dashboard-today', label: 'Dzisiaj' },
          { id: 'dashboard-week', label: 'Tydzień' },
          { id: 'dashboard-goals', label: 'Cele' },
          { id: 'dashboard-finances', label: 'Finanse' },
        ]}
        action={
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isSaving
                ? 'border-amber-800 bg-amber-950/20 text-amber-300'
                : 'border-emerald-800 bg-emerald-950/20 text-emerald-300'
            }`}
          >
            {isSaving ? 'Zapisywanie…' : 'Dane aktualne'}
          </span>
        }
      />

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>
      )}

      <div
        id="dashboard-today"
        className="page-section-anchor grid items-start gap-4 xl:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.2fr)]"
      >
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
          <MissingTodayActions />
        )}
      </div>

      <div id="dashboard-week" className="page-section-anchor">
        <WeeklyWorkOverview week={week} summary={summary} progress={progress} />
      </div>

      <div id="dashboard-goals" className="page-section-anchor">
        <DashboardGoalProgress
          netEarningsPln={summary.netEarningsPln}
          totalHours={summary.totalHours}
        />
      </div>

      <div
        id="dashboard-finances"
        className="page-section-anchor grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]"
      >
        <CompactFinancialPlan items={week.financialPlan} summary={summary} />

        <section
          aria-labelledby="other-modules-title"
          className="rounded-xl border border-zinc-700 bg-zinc-900/65 shadow-sm"
        >
          <div className="border-b border-zinc-700 px-4 py-3">
            <h2 id="other-modules-title" className="text-sm font-semibold text-zinc-100">
              Pozostałe obszary
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">Kolejne moduły CHB</p>
          </div>

          <div className="grid gap-2 p-3 sm:grid-cols-3 xl:grid-cols-1">
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
          </div>
        </section>
      </div>
    </div>
  );
}
