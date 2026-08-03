import { Database } from 'lucide-react';

import type { WorkWeek, WorkWeekSummary } from '@/modules/work/types/work.types';
import {
  formatCurrencyEur,
  formatCurrencyPln,
  formatIsoDate,
} from '@/modules/work/utils/workCalculations';

type WorkActiveWeekContainerProps = {
  week: WorkWeek;
  summary: WorkWeekSummary;
  isSaving: boolean;
};

export default function WorkActiveWeekContainer({
  week,
  summary,
  isSaving,
}: WorkActiveWeekContainerProps) {
  const grossEarningsPln = summary.grossEarningsEur * week.exchangeRateEurPln;

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Aktywny tydzień
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">
            {formatIsoDate(week.startDate)}
            {' – '}
            {formatIsoDate(week.endDate)}
          </h2>

          <p className="mt-1.5 text-sm text-zinc-500">
            Stawka za płatną wiadomość:{' '}
            <span className="font-semibold text-zinc-300">
              {formatCurrencyEur(summary.messageRateEur)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/65">
          <div className="min-w-0 px-3 py-3 sm:px-4">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-[10px]">
              Status danych
            </p>

            <p
              className={`mt-1 truncate text-xs font-bold sm:text-sm ${
                isSaving ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {isSaving ? 'Zapisywanie…' : 'Zapisano lokalnie'}
            </p>
          </div>

          <div className="min-w-0 border-l border-zinc-700 px-3 py-3 sm:px-4">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-[10px]">
              Euro
            </p>

            <p className="mt-1 truncate text-sm font-bold text-zinc-100 sm:text-lg">
              {formatCurrencyEur(summary.grossEarningsEur)}
            </p>
          </div>

          <div className="min-w-0 border-l border-zinc-700 px-3 py-3 sm:px-4">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-[10px]">
              Złoty
            </p>

            <p className="mt-1 truncate text-sm font-bold text-zinc-100 sm:text-lg">
              {formatCurrencyPln(grossEarningsPln)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
