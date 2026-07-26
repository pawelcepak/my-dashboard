import { Banknote, Beer, CalendarDays, Clock3, Gauge, Mail, Star, Target } from 'lucide-react';

import type { WorkWeek } from '@/modules/work/types/work.types';
import {
  calculateWorkWeekSummary,
  formatCurrencyPln,
  formatDecimal,
  formatHours,
  formatNumber,
  formatShortIsoDate,
} from '@/modules/work/utils/workCalculations';
import { formatWorkRating, getWorkRatingPresentation } from '@/modules/work/utils/workPresentation';
import HistoryCard from '@/shared/components/history/HistoryCard';

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
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/50">
      <div className="flex flex-col gap-3 border-b border-zinc-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Historia tygodni</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Porównuj wyniki i wybieraj tygodnie do edycji.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2">
          <CalendarDays aria-hidden="true" className="size-4 text-zinc-500" />

          <p className="text-xs font-semibold text-zinc-400">
            {weeks.length}{' '}
            {weeks.length === 1
              ? 'zapisany tydzień'
              : weeks.length < 5
                ? 'zapisane tygodnie'
                : 'zapisanych tygodni'}
          </p>
        </div>
      </div>

      <div className="space-y-7 p-4 sm:p-6">
        {groupedWeeks.map(([year, yearWeeks]) => (
          <section key={year}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-sm font-bold text-zinc-200">{year}</h3>

              <div className="h-px flex-1 bg-zinc-700" />

              <span className="text-xs font-medium text-zinc-500">
                {yearWeeks.length}{' '}
                {yearWeeks.length === 1 ? 'tydzień' : yearWeeks.length < 5 ? 'tygodnie' : 'tygodni'}
              </span>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {yearWeeks.map((week) => {
                const summary = calculateWorkWeekSummary(week);

                const averageRating = calculateAverageRating(week);

                const ratingPresentation = getWorkRatingPresentation(averageRating);

                const totalBeers = calculateTotalBeers(week);

                const goalPercentage = calculateGoalPercentage(week, summary.totalMessages);

                const isActive = week.id === activeWeekId;

                return (
                  <HistoryCard
                    key={week.id}
                    title={`Tydzień ${week.weekNumber}`}
                    subtitle={`${formatShortIsoDate(week.startDate)}–${formatShortIsoDate(
                      week.endDate
                    )}`}
                    isActive={isActive}
                    isDisabled={isSaving}
                    onClick={() => {
                      if (!isSaving && !isActive) {
                        void onSelectWeek(week.id);
                      }
                    }}
                    metrics={[
                      {
                        label: 'Wiadomości',
                        value: formatNumber(summary.totalMessages),
                        icon: Mail,
                        accent: true,
                      },
                      {
                        label: 'Godziny',
                        value: `${formatHours(summary.totalHours)} h`,
                        icon: Clock3,
                      },
                      {
                        label: 'Średnia / h',
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
                        value: formatWorkRating(averageRating),
                        icon: Star,
                        valueClassName: averageRating === null ? 'text-zinc-500' : undefined,
                        valueColor: averageRating === null ? undefined : ratingPresentation.color,
                      },
                      {
                        label: 'Piwa',
                        value: formatNumber(totalBeers),
                        icon: Beer,
                        valueClassName: totalBeers === 0 ? 'text-emerald-400' : 'text-red-400',
                      },
                      {
                        label: 'Cel 7 dni',
                        value: goalPercentage === null ? '—' : `${formatDecimal(goalPercentage)}%`,
                        icon: Target,
                        valueClassName:
                          goalPercentage !== null && goalPercentage >= 100
                            ? 'text-emerald-400'
                            : 'text-zinc-200',
                      },
                      {
                        label: 'Bloki',
                        value: formatNumber(
                          week.days.reduce((total, day) => total + day.sessions.length, 0)
                        ),
                        icon: CalendarDays,
                      },
                    ]}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
