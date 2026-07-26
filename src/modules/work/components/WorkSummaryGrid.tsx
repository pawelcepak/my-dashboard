import { Banknote, Clock3, Gauge, Mail, MessageSquareMore, Percent, Target } from 'lucide-react';

import type { WorkWeekGoals, WorkWeekSummary } from '@/modules/work/types/work.types';
import {
  formatCurrencyEur,
  formatCurrencyPln,
  formatDecimal,
  formatGoalValue,
  formatHours,
  formatNumber,
} from '@/modules/work/utils/workCalculations';

type WorkSummaryGridProps = {
  summary: WorkWeekSummary;
  goals: WorkWeekGoals;
};

const iconClasses =
  'flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-400';

export default function WorkSummaryGrid({ summary, goals }: WorkSummaryGridProps) {
  const metrics = [
    {
      label: 'Wiadomości',
      value: formatNumber(summary.totalMessages),
      description: `${summary.totalHeldMessages} zatrzymanych`,
      icon: Mail,
    },
    {
      label: 'Czas pracy',
      value: `${formatHours(summary.totalHours)} godz.`,
      description: `${summary.totalMinutes} minut`,
      icon: Clock3,
    },
    {
      label: 'Wiadomości na godzinę',
      value: formatDecimal(summary.averageMessagesPerHour),
      description: 'Średnia z całego tygodnia',
      icon: Gauge,
    },
    {
      label: 'Wiadomości ÷ 40',
      value: formatDecimal(summary.messagesDividedByForty),
      description: 'Wartość pomocnicza',
      icon: Percent,
    },
    {
      label: 'Zarobek netto EUR',
      value: formatCurrencyEur(summary.netEarningsEur),
      description: `Brutto ${formatCurrencyEur(summary.grossEarningsEur)}`,
      icon: MessageSquareMore,
    },
    {
      label: 'Zarobek netto PLN',
      value: formatCurrencyPln(summary.netEarningsPln),
      description: `Po opłacie ${formatCurrencyEur(summary.payoutFeeEur)}`,
      icon: Banknote,
    },
  ];

  return (
    <section
      aria-label="Podsumowanie tygodnia"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article
            key={metric.label}
            className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-400">{metric.label}</p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
                  {metric.value}
                </p>

                <p className="mt-2 text-sm text-zinc-500">{metric.description}</p>
              </div>

              <div className={iconClasses}>
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
              </div>
            </div>
          </article>
        );
      })}

      <article className="rounded-2xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] p-5 sm:col-span-2 xl:col-span-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--app-accent)]">Cele wiadomości</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Dzienny
                </p>

                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {goals.dailyMessagesTarget === null
                    ? '—'
                    : formatGoalValue(goals.dailyMessagesTarget)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Tydzień 7 dni
                </p>

                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {goals.weeklyMessagesTarget === null
                    ? '—'
                    : formatGoalValue(goals.weeklyMessagesTarget)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Tydzień 5 dni
                </p>

                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {goals.weeklyMessagesTarget5Days === null
                    ? '—'
                    : formatGoalValue(goals.weeklyMessagesTarget5Days)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Godziny dziennie
                </p>

                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {goals.dailyHoursTarget === null
                    ? '—'
                    : `${formatGoalValue(goals.dailyHoursTarget)} h`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--app-accent-border)] bg-zinc-950/50 text-[var(--app-accent)]">
            <Target aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </div>
        </div>
      </article>
    </section>
  );
}
