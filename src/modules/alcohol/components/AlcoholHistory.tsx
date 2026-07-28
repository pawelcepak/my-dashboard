import type { AlcoholMonthSummary } from '@/modules/alcohol/types/alcohol.types';
import { getMonthLabel } from '@/modules/alcohol/utils/alcoholCalculations';
import { formatCurrencyPln } from '@/modules/portfolio/utils/portfolioCalculations';

type AlcoholHistoryProps = {
  months: AlcoholMonthSummary[];
};

export default function AlcoholHistory({ months }: AlcoholHistoryProps) {
  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Historia miesięczna</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Dni z Work lub ręcznych korekt; koszty historyczne albo z Portfela
        </p>
      </div>

      <div className="max-h-[31rem] overflow-auto">
        <table className="w-full min-w-[620px] border-collapse text-xs">
          <thead className="sticky top-0 bg-zinc-950 text-[9px] uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="border-b border-zinc-700 px-3 py-2 text-left">Miesiąc</th>
              <th className="border-b border-zinc-700 px-3 py-2 text-right">Dni picia</th>
              <th className="border-b border-zinc-700 px-3 py-2 text-right">Piwa</th>
              <th className="border-b border-zinc-700 px-3 py-2 text-right">Wydatki</th>
              <th className="border-b border-zinc-700 px-3 py-2 text-right">Źródło kosztów</th>
            </tr>
          </thead>
          <tbody>
            {[...months].reverse().map((month) => (
              <tr key={month.month} className="border-b border-zinc-700/70 last:border-b-0">
                <td className="px-3 py-2 font-semibold capitalize text-zinc-300">
                  {getMonthLabel(month.month)}
                </td>
                <td className="px-3 py-2 text-right text-zinc-200">{month.drinkingDays}</td>
                <td className="px-3 py-2 text-right text-zinc-400">{month.beers || '—'}</td>
                <td className="px-3 py-2 text-right font-semibold text-zinc-200">
                  {formatCurrencyPln(month.expense)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold uppercase text-zinc-500">
                    {month.expenseSource === 'portfolio' ? 'Portfel' : 'Ręczne'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
