import type {
  PortfolioAccount,
  PortfolioTransaction,
} from '@/modules/portfolio/types/portfolio.types';
import {
  createPortfolioLedger,
  formatCurrencyPln,
} from '@/modules/portfolio/utils/portfolioCalculations';
import { getPortfolioChartScale } from '@/modules/portfolio/utils/portfolioChartScale';

type PortfolioBalanceChartProps = {
  account: PortfolioAccount;
  transactions: PortfolioTransaction[];
};

export default function PortfolioBalanceChart({
  account,
  transactions,
}: PortfolioBalanceChartProps) {
  const ledger = createPortfolioLedger(account, transactions);
  const points = [
    { date: account.initialBalanceDate, balance: account.initialBalance },
    ...ledger.map((row) => ({ date: row.transaction.date, balance: row.balanceAfter })),
  ];

  if (points.length < 2) {
    return (
      <section className="app-panel p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Historia salda</h2>
        <p className="mt-4 text-sm text-zinc-500">
          Dodaj pierwszą transakcję, aby zobaczyć wykres.
        </p>
      </section>
    );
  }

  const balances = points.map((point) => point.balance);
  const actualMinimum = Math.min(...balances);
  const actualMaximum = Math.max(...balances);
  const scale = getPortfolioChartScale(actualMaximum);
  const width = 900;
  const height = 260;
  const padding = { top: 14, right: 18, bottom: 24, left: 68 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xForIndex = (index: number) =>
    padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
  const yForBalance = (balance: number) => {
    const clamped = Math.max(0, Math.min(scale.maximum, balance));
    return padding.top + (1 - clamped / scale.maximum) * plotHeight;
  };
  const chartPoints = points
    .map((point, index) => `${xForIndex(index)},${yForBalance(point.balance)}`)
    .join(' ');

  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Historia salda</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Skala 0–{formatCurrencyPln(scale.maximum)} · główne linie co{' '}
          {formatCurrencyPln(scale.majorStep)} · pomocnicze co {formatCurrencyPln(scale.minorStep)}
        </p>
      </div>

      <div className="p-3">
        <svg
          role="img"
          aria-label="Wykres historii salda portfela"
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto h-auto w-full max-w-6xl"
        >
          {scale.minorTicks.map((tick) => {
            const y = yForBalance(tick);
            return (
              <line
                key={`minor-${tick}`}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                className="stroke-zinc-800"
                strokeWidth="0.6"
              />
            );
          })}

          {scale.majorTicks.map((tick) => {
            const y = yForBalance(tick);
            return (
              <g key={`major-${tick}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  className="stroke-zinc-700"
                  strokeWidth={tick === 0 ? 1.4 : 1}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-zinc-500 text-[9px]"
                >
                  {new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(tick)} zł
                </text>
              </g>
            );
          })}

          <polyline
            points={chartPoints}
            fill="none"
            stroke="var(--app-accent)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-1 flex justify-between gap-3 text-[10px] text-zinc-500">
          <span>{points[0]?.date}</span>
          <span>
            Min. {formatCurrencyPln(actualMinimum)} · Maks. {formatCurrencyPln(actualMaximum)}
          </span>
          <span>{points.at(-1)?.date}</span>
        </div>
      </div>
    </section>
  );
}
