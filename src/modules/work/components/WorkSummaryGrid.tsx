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

type SummaryMetricProps = {
  label: string;
  value: string;
  description: string;
  icon: typeof Mail;
  accent?: boolean;
};

function SummaryMetric({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}: SummaryMetricProps) {
  return (
    <article
      className={`rounded-xl border p-3.5 ${
        accent
          ? 'border-[var(--app-accent-border)] bg-[var(--app-accent-soft)]'
          : 'border-zinc-700 bg-zinc-950/45'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {label}
          </p>

          <p
            className={`mt-1.5 truncate text-lg font-bold tracking-tight ${
              accent ? 'text-[var(--app-accent)]' : 'text-zinc-100'
            }`}
          >
            {value}
          </p>

          <p className="mt-1 truncate text-[11px] text-zinc-500">{description}</p>
        </div>

        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
            accent
              ? 'border-[var(--app-accent-border)] bg-zinc-950/35 text-[var(--app-accent)]'
              : 'border-zinc-700 bg-zinc-900 text-zinc-500'
          }`}
        >
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </div>
      </div>
    </article>
  );
}

type GoalValueProps = {
  label: string;
  value: number | null;
  suffix?: string;
};

function GoalValue({ label, value, suffix = '' }: GoalValueProps) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>

      <p className="mt-1 text-base font-bold text-zinc-100">
        {value === null ? '—' : `${formatGoalValue(value)}${suffix}`}
      </p>
    </div>
  );
}

export default function WorkSummaryGrid({ summary, goals }: WorkSummaryGridProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Podsumowanie aktywnego tygodnia</h2>

          <p className="mt-0.5 text-xs text-zinc-500">Wyniki, zarobki i ustawione cele</p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
          <Target aria-hidden="true" className="size-4" />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
          <SummaryMetric
            label="Wiadomości"
            value={formatNumber(summary.totalMessages)}
            description={`${formatNumber(summary.totalHeldMessages)} zatrzymanych`}
            icon={Mail}
            accent
          />

          <SummaryMetric
            label="Czas pracy"
            value={`${formatHours(summary.totalHours)} h`}
            description={`${formatNumber(summary.totalMinutes)} minut`}
            icon={Clock3}
          />

          <SummaryMetric
            label="Średnia / h"
            value={formatDecimal(summary.averageMessagesPerHour)}
            description="Z całego tygodnia"
            icon={Gauge}
          />

          <SummaryMetric
            label="Wiadomości ÷ 40"
            value={formatDecimal(summary.messagesDividedByForty)}
            description="Wartość pomocnicza"
            icon={Percent}
          />

          <SummaryMetric
            label="Netto EUR"
            value={formatCurrencyEur(summary.netEarningsEur)}
            description={`Brutto ${formatCurrencyEur(summary.grossEarningsEur)}`}
            icon={MessageSquareMore}
          />

          <SummaryMetric
            label="Netto PLN"
            value={formatCurrencyPln(summary.netEarningsPln)}
            description={`Opłata ${formatCurrencyEur(summary.payoutFeeEur)}`}
            icon={Banknote}
          />
        </div>

        <div className="border-t border-zinc-700 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Target aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

            <p className="text-xs font-semibold text-zinc-300">Cele pracy</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <GoalValue label="Dzienny" value={goals.dailyMessagesTarget} />

            <GoalValue label="Godziny dziennie" value={goals.dailyHoursTarget} suffix=" h" />

            <GoalValue label="Tydzień 7 dni" value={goals.weeklyMessagesTarget} />

            <GoalValue label="Tydzień 5 dni" value={goals.weeklyMessagesTarget5Days} />
          </div>
        </div>
      </div>
    </section>
  );
}
