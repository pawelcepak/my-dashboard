import { CalendarClock, Clock3, Moon, Star, Sun, Trophy } from 'lucide-react';

import type { WorkTimeAnalytics } from '@/modules/work/types/work.types';
import {
  formatWorkTimeMinutes,
  WORK_TIME_ANALYTICS_START_DATE,
} from '@/modules/work/utils/workTimeAnalytics';
import { formatIsoDate } from '@/modules/work/utils/workCalculations';
import CollapsiblePanel from '@/shared/components/CollapsiblePanel';

type WorkTimeAnalyticsPanelProps = {
  analytics: WorkTimeAnalytics;
  weekStartDate: string;
};

type MetricProps = {
  label: string;
  value: string;
  description: string;
  icon: typeof Clock3;
};

function Metric({ label, value, description, icon: Icon }: MetricProps) {
  return (
    <article className="rounded-xl border border-zinc-700 bg-zinc-950/45 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {label}
          </p>

          <p className="mt-1.5 text-base font-bold text-zinc-100">{value}</p>

          <p className="mt-1 text-[10px] text-zinc-500">{description}</p>
        </div>

        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-500">
          <Icon className="size-4" />
        </div>
      </div>
    </article>
  );
}

export default function WorkTimeAnalyticsPanel({
  analytics,
  weekStartDate,
}: WorkTimeAnalyticsPanelProps) {
  const enabled = weekStartDate >= WORK_TIME_ANALYTICS_START_DATE;

  const averageScore =
    analytics.averageStandardHoursScore === null
      ? '—'
      : analytics.averageStandardHoursScore.toFixed(2).replace('.', ',');

  return (
    <CollapsiblePanel
      storageKey="work-time-analytics"
      title="Analiza godzin pracy"
      icon={<CalendarClock className="size-4" />}
      summary={
        enabled ? (
          <>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
              Standardowe · średnia
            </p>

            <p className="mt-0.5 text-xs font-bold text-zinc-300">
              {formatWorkTimeMinutes(analytics.totalStandardMinutes)}
              {' · '}
              {averageScore}
            </p>
          </>
        ) : (
          <p className="text-xs font-semibold text-zinc-500">Od 2026-W31</p>
        )
      }
      defaultOpen={false}
    >
      {!enabled ? (
        <div className="p-4 text-sm leading-6 text-zinc-500">
          Ocena standardowych godzin jest liczona od tygodnia 2026-W31, czyli od{' '}
          {formatIsoDate(WORK_TIME_ANALYTICS_START_DATE)}.
        </div>
      ) : (
        <div className="space-y-3 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Metric
              label="Standardowe godziny"
              value={formatWorkTimeMinutes(analytics.totalStandardMinutes)}
              description="Pn–Pt, 06:20–15:00"
              icon={Sun}
            />

            <Metric
              label="Dodatkowe godziny"
              value={formatWorkTimeMinutes(analytics.totalAdditionalMinutes)}
              description="Pn–Pt poza standardem"
              icon={Moon}
            />

            <Metric
              label="Weekendowe"
              value={formatWorkTimeMinutes(analytics.totalWeekendMinutes)}
              description="Sobota i niedziela"
              icon={Clock3}
            />

            <Metric
              label="Średnia ocena"
              value={averageScore}
              description={`${analytics.ratedDayCount} ocenionych dni`}
              icon={Star}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
              <p className="text-[9px] uppercase tracking-wide text-zinc-500">Dni z oceną 5</p>

              <p className="mt-1 text-base font-bold text-zinc-100">
                {analytics.scoreFiveDayCount}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
              <p className="text-[9px] uppercase tracking-wide text-zinc-500">Dni z oceną 6</p>

              <p className="mt-1 text-base font-bold text-zinc-100">{analytics.scoreSixDayCount}</p>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-zinc-500">
                <Trophy className="size-3" />
                Najlepszy dzień
              </div>

              <p className="mt-1 text-sm font-bold text-zinc-100">
                {analytics.bestDay
                  ? `${formatIsoDate(
                      analytics.bestDay.date
                    )} · ${analytics.bestDay.standardHoursScore}`
                  : '—'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-700">
            <table className="w-full min-w-[520px] border-collapse text-xs">
              <thead className="bg-zinc-950/60 text-[9px] uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-2 py-2 text-left">Dzień</th>
                  <th className="px-2 py-2 text-right">Standardowe</th>
                  <th className="px-2 py-2 text-right">Dodatkowe</th>
                  <th className="px-2 py-2 text-right">Weekendowe</th>
                  <th className="px-2 py-2 text-right">Ocena</th>
                </tr>
              </thead>

              <tbody>
                {analytics.days.map((day) => (
                  <tr key={day.date} className="border-t border-zinc-700/70">
                    <td className="px-2 py-2 font-medium text-zinc-300">
                      {formatIsoDate(day.date)}
                    </td>

                    <td className="px-2 py-2 text-right text-zinc-400">
                      {formatWorkTimeMinutes(day.standardMinutes)}
                    </td>

                    <td className="px-2 py-2 text-right text-zinc-400">
                      {formatWorkTimeMinutes(day.additionalMinutes)}
                    </td>

                    <td className="px-2 py-2 text-right text-zinc-400">
                      {formatWorkTimeMinutes(day.weekendMinutes)}
                    </td>

                    <td className="px-2 py-2 text-right font-bold text-zinc-100">
                      {day.standardHoursScore ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] leading-5 text-zinc-600">
            Progi: 1 = 0–59 min, 2 = 60–179 min, 3 = 180–299 min, 4 = 300–359 min, 5 = 360–419 min,
            6 = co najmniej 420 min.
          </p>
        </div>
      )}
    </CollapsiblePanel>
  );
}
