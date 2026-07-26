import { Banknote, Clock3, Gauge, Mail, MessageSquareMore, Percent } from 'lucide-react';

import type { WorkWeekSummary } from '@/modules/work/types/work.types';
import {
  formatCurrencyEur,
  formatCurrencyPln,
  formatDecimal,
  formatHours,
  formatNumber,
} from '@/modules/work/utils/workCalculations';

type WorkSummaryGridProps = {
  summary: WorkWeekSummary;
};

const iconClasses =
  'flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400';

export default function WorkSummaryGrid({ summary }: WorkSummaryGridProps) {
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
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
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
    </section>
  );
}
