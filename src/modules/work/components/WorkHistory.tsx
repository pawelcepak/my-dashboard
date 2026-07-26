import { Banknote, Beer, Clock3, Gauge, Mail, Star, Target } from 'lucide-react';

import HistoryCard from '@/shared/components/history/HistoryCard';
import type { WorkWeek } from '@/modules/work/types/work.types';
import {
  calculateWorkWeekSummary,
  formatCurrencyPln,
  formatDecimal,
  formatHours,
  formatNumber,
  formatShortIsoDate,
} from '@/modules/work/utils/workCalculations';

type WorkHistoryProps = {
  weeks: WorkWeek[];
  activeWeekId: string;
  isSaving: boolean;
  onSelectWeek: (workWeekId: string) => Promise<void>;
};

function calculateAverageRating(week: WorkWeek): number | null {
  const ratings = week.days
    .map((day) => day.workRating)
    .filter((rating): rating is number => rating !== null);

  if (ratings.length === 0) {
    return null;
  }

  return ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
}

function calculateTotalBeers(week: WorkWeek): number {
  return week.days.reduce((total, day) => total + day.beers, 0);
}

function calculateGoalPercentage(week: WorkWeek, totalMessages: number): number | null {
  const target = week.goals.weeklyMessagesTarget;

  if (target === null || target <= 0) {
    return null;
  }

  return Math.min(100, (totalMessages / target) * 100);
}

function groupWeeksByYear(weeks: WorkWeek[]): Array<[number, WorkWeek[]]> {
  const groups = new Map<number, WorkWeek[]>();

  for (const week of weeks) {
    const yearWeeks = groups.get(week.year) ?? [];
    yearWeeks.push(week);
    groups.set(week.year, yearWeeks);
  }

  return [...groups.entries()]
    .sort(([firstYear], [secondYear]) => secondYear - firstYear)
    .map(([year, yearWeeks]) => [
      year,
      [...yearWeeks].sort((firstWeek, secondWeek) => secondWeek.weekNumber - firstWeek.weekNumber),
    ]);
}

export default function WorkHistory({
  weeks,
  activeWeekId,
  isSaving,
  onSelectWeek,
}: WorkHistoryProps) {
  const groupedWeeks = groupWeeksByYear(weeks);

  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-900/50">
      <div className="border-b border-zinc-700 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-zinc-100">Historia tygodni</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Wybierz tydzień, aby wyświetlić i edytować jego dane.
        </p>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {groupedWeeks.map(([year, yearWeeks]) => (
          <div key={year}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-zinc-200">{year}</h3>

              <div className="h-px flex-1 bg-zinc-700" />

              <span className="text-xs text-zinc-500">
                {yearWeeks.length} {yearWeeks.length === 1 ? 'tydzień' : 'tygodni'}
              </span>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {yearWeeks.map((week) => {
                const summary = calculateWorkWeekSummary(week);

                const averageRating = calculateAverageRating(week);

                const totalBeers = calculateTotalBeers(week);

                const goalPercentage = calculateGoalPercentage(week, summary.totalMessages);

                return (
                  <HistoryCard
                    key={week.id}
                    title={`Tydzień ${week.weekNumber}`}
                    subtitle={`${formatShortIsoDate(
                      week.startDate
                    )}–${formatShortIsoDate(week.endDate)}`}
                    isActive={week.id === activeWeekId}
                    onClick={() => {
                      if (!isSaving && week.id !== activeWeekId) {
                        void onSelectWeek(week.id);
                      }
                    }}
                    metrics={[
                      {
                        label: 'Wiadomości',
                        value: formatNumber(summary.totalMessages),
                        icon: Mail,
                      },
                      {
                        label: 'Godziny',
                        value: formatHours(summary.totalHours),
                        icon: Clock3,
                      },
                      {
                        label: 'Średnia/h',
                        value: formatDecimal(summary.averageMessagesPerHour),
                        icon: Gauge,
                      },
                      {
                        label: 'Netto',
                        value: formatCurrencyPln(summary.netEarningsPln),
                        icon: Banknote,
                      },
                      {
                        label: 'Ocena',
                        value: averageRating === null ? '—' : formatDecimal(averageRating),
                        icon: Star,
                      },
                      {
                        label: 'Piwa',
                        value: formatNumber(totalBeers),
                        icon: Beer,
                        valueClassName: totalBeers === 0 ? 'text-emerald-400' : 'text-red-400',
                      },
                      {
                        label: 'Cel',
                        value: goalPercentage === null ? '—' : `${formatDecimal(goalPercentage)}%`,
                        icon: Target,
                      },
                    ]}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
