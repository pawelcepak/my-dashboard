import { Banknote, Beer, CalendarDays, Clock3, Mail, Star, Target } from 'lucide-react';

import MessagesPerHourIndicator from '@/modules/work/components/MessagesPerHourIndicator';
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
import CollapsiblePanel from '@/shared/components/CollapsiblePanel';
import HistoryCard from '@/shared/components/history/HistoryCard';

type WorkHistoryProps = {
  weeks: WorkWeek[];
  activeWeekId: string;
  isSaving: boolean;
  constrainedHeight?: boolean;
  compact?: boolean;
  onSelectWeek: (workWeekId: string) => Promise<void>;
};

function calculateAverageRating(week: WorkWeek): number | null {
  const ratings = week.days
    .map((day) => day.workRating)
    .filter((rating): rating is number => rating !== null);

  if (ratings.length === 0) return null;

  return ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
}

function calculateTotalBeers(week: WorkWeek): number {
  return week.days.reduce((total, day) => total + day.beers, 0);
}

function calculateTotalSessions(week: WorkWeek): number {
  return week.days.reduce((total, day) => total + day.sessions.length, 0);
}

function calculateGoalPercentage(week: WorkWeek, totalMessages: number): number | null {
  const target = week.goals.weeklyMessagesTarget;

  if (target === null || target <= 0) return null;

  return Math.min(100, (totalMessages / target) * 100);
}

function groupWeeksByYear(weeks: WorkWeek[]): Array<[number, WorkWeek[]]> {
  const groups = new Map<number, WorkWeek[]>();

  for (const week of weeks) {
    groups.set(week.year, [...(groups.get(week.year) ?? []), week]);
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
  constrainedHeight = false,
  compact = false,
  onSelectWeek,
}: WorkHistoryProps) {
  const groupedWeeks = groupWeeksByYear(weeks);

  return (
    <CollapsiblePanel
      storageKey="work-week-history"
      title="Historia tygodni"
      description={
        compact
          ? 'Szybki wybór i najważniejsze wyniki'
          : 'Najważniejsze wyniki i szybki wybór tygodnia'
      }
      icon={<CalendarDays aria-hidden="true" className="size-4" />}
      summary={<p className="text-xs font-semibold text-zinc-400">{weeks.length}</p>}
      defaultOpen={false}
      className={constrainedHeight ? '2xl:flex 2xl:max-h-[50rem] 2xl:flex-col' : ''}
      contentClassName={constrainedHeight ? '2xl:min-h-0 2xl:flex-1 2xl:overflow-hidden' : ''}
    >
      <div
        className={`${compact ? 'space-y-3 p-2.5' : 'space-y-5 p-3.5 sm:p-4'} ${
          constrainedHeight
            ? '2xl:min-h-0 2xl:flex-1 2xl:overflow-y-auto 2xl:overscroll-contain'
            : ''
        }`}
      >
        {groupedWeeks.map(([year, yearWeeks]) => (
          <section key={year}>
            <div
              className={
                compact ? 'mb-1.5 flex items-center gap-2' : 'mb-2.5 flex items-center gap-3'
              }
            >
              <h3 className="text-[11px] font-bold text-zinc-300">{year}</h3>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>

            <div className={compact ? 'grid gap-1.5' : 'grid gap-2.5'}>
              {yearWeeks.map((week) => {
                const summary = calculateWorkWeekSummary(week);
                const averageRating = calculateAverageRating(week);
                const ratingPresentation = getWorkRatingPresentation(averageRating);
                const totalBeers = calculateTotalBeers(week);
                const totalSessions = calculateTotalSessions(week);
                const goalPercentage = calculateGoalPercentage(week, summary.totalMessages);
                const isActive = week.id === activeWeekId;

                if (compact) {
                  return (
                    <button
                      key={week.id}
                      type="button"
                      disabled={isSaving || isActive}
                      onClick={() => void onSelectWeek(week.id)}
                      className={`grid w-full grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,0.7fr))] items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                        isActive
                          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
                          : 'border-zinc-700 bg-zinc-950/25 hover:border-[var(--app-accent-border)] hover:bg-zinc-950/45'
                      } disabled:cursor-default`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] font-bold text-zinc-200">
                          W{week.weekNumber} · {formatShortIsoDate(week.startDate)}–
                          {formatShortIsoDate(week.endDate)}
                        </span>
                        <span className="mt-0.5 block text-[9px] text-zinc-500">
                          {isActive ? 'Aktywny tydzień' : 'Otwórz tydzień'}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[9px] uppercase text-zinc-500">Wiad.</span>
                        <span className="block text-xs font-bold text-zinc-200">
                          {formatNumber(summary.totalMessages)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[9px] uppercase text-zinc-500">Godz.</span>
                        <span className="block text-xs font-bold text-zinc-200">
                          {formatHours(summary.totalHours)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[9px] uppercase text-zinc-500">Netto</span>
                        <span className="block truncate text-xs font-bold text-zinc-200">
                          {formatCurrencyPln(summary.netEarningsPln)}
                        </span>
                      </span>
                    </button>
                  );
                }

                return (
                  <HistoryCard
                    key={week.id}
                    title={`Tydzień ${week.weekNumber}`}
                    subtitle={`${formatShortIsoDate(week.startDate)}–${formatShortIsoDate(week.endDate)}`}
                    isActive={isActive}
                    isDisabled={isSaving}
                    onClick={() => {
                      if (!isSaving && !isActive) void onSelectWeek(week.id);
                    }}
                    featuredMetrics={[
                      {
                        label: 'Wiadomości',
                        value: formatNumber(summary.totalMessages),
                        icon: Mail,
                        accent: true,
                      },
                      {
                        label: 'Średnia / h',
                        value: (
                          <MessagesPerHourIndicator
                            value={summary.totalHours > 0 ? summary.averageMessagesPerHour : null}
                            compact
                            className="text-base"
                          />
                        ),
                      },
                      {
                        label: 'Ocena',
                        value: formatWorkRating(averageRating),
                        icon: Star,
                        valueClassName: averageRating === null ? 'text-zinc-500' : undefined,
                        valueColor: averageRating === null ? undefined : ratingPresentation.color,
                      },
                      {
                        label: 'Netto',
                        value: formatCurrencyPln(summary.netEarningsPln),
                        icon: Banknote,
                      },
                    ]}
                    metrics={[
                      {
                        label: 'Godziny',
                        value: `${formatHours(summary.totalHours)} h`,
                        icon: Clock3,
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
                            : 'text-zinc-300',
                      },
                      { label: 'Bloki', value: formatNumber(totalSessions), icon: CalendarDays },
                    ]}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </CollapsiblePanel>
  );
}
