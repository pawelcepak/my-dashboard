import type {
  PortfolioAccount,
  PortfolioTransaction,
} from '@/modules/portfolio/types/portfolio.types';
import {
  createPortfolioLedger,
  formatCurrencyPln,
} from '@/modules/portfolio/utils/portfolioCalculations';

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
    {
      date: account.initialBalanceDate,
      balance: account.initialBalance,
    },
    ...ledger.map((row) => ({
      date: row.transaction.date,
      balance: row.balanceAfter,
    })),
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
  const minimum = Math.min(...balances);
  const maximum = Math.max(...balances);
  const range = Math.max(1, maximum - minimum);

  const width = 720;
  const height = 140;
  const padding = 22;

  const chartPoints = points
    .map((point, index) => {
      const x = padding + (index / Math.max(1, points.length - 1)) * (width - padding * 2);

      const y = height - padding - ((point.balance - minimum) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="app-panel overflow-hidden">
      <div className="border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">Historia salda</h2>

        <p className="mt-0.5 text-xs text-zinc-500">
          Od {formatCurrencyPln(account.initialBalance)} w dniu {account.initialBalanceDate}
        </p>
      </div>

      <div className="p-3">
        <svg
          role="img"
          aria-label="Wykres historii salda portfela"
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto h-auto w-full max-w-5xl"
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            className="stroke-zinc-700"
            strokeWidth="1"
          />

          <polyline
            points={chartPoints}
            fill="none"
            stroke="var(--app-accent)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-2 flex justify-between gap-3 text-[10px] text-zinc-500">
          <span>{points[0]?.date}</span>
          <span>
            Min. {formatCurrencyPln(minimum)} · Maks. {formatCurrencyPln(maximum)}
          </span>
          <span>{points.at(-1)?.date}</span>
        </div>
      </div>
    </section>
  );
}
