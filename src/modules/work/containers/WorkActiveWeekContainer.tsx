import { Database } from 'lucide-react';

import type { WorkWeek, WorkWeekSummary } from '@/modules/work/types/work.types';
import { formatCurrencyEur, formatIsoDate } from '@/modules/work/utils/workCalculations';

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

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/65 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              Brutto
            </p>

            <p className="mt-1 text-lg font-bold text-zinc-100">
              {formatCurrencyEur(summary.grossEarningsEur)}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-950/65 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              Status danych
            </p>

            <p
              className={`mt-1 text-sm font-bold ${
                isSaving ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {isSaving ? 'Zapisywanie…' : 'Zapisano lokalnie'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-700 bg-zinc-950/25 px-4 py-2.5 text-xs text-zinc-500 sm:px-5">
        <Database aria-hidden="true" className="size-3.5 shrink-0" />
        Dane wszystkich tygodni są zapisywane lokalnie i synchronizowane z prywatną chmurą.
      </div>
    </section>
  );
}
