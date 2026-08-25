import { useMemo } from 'react';

import { usePortfolio } from '@/modules/portfolio/hooks/usePortfolio';
import { createPortfolioLedger } from '@/modules/portfolio/utils/portfolioCalculations';
import { getPortfolioChartScale } from '@/modules/portfolio/utils/portfolioChartScale';

export default function HeaderPortfolioBalance() {
  const { account, transactions, isLoading } = usePortfolio();

  const chart = useMemo(() => {
    if (!account) return null;
    const ledger = createPortfolioLedger(account, transactions);
    const balances = [account.initialBalance, ...ledger.map((row) => row.balanceAfter)];
    if (balances.length < 2) return null;

    const scale = getPortfolioChartScale(Math.max(...balances));
    const width = 560;
    const height = 46;
    const left = 4;
    const right = 4;
    const top = 4;
    const bottom = 5;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const points = balances
      .map((balance, index) => {
        const x = left + (index / Math.max(1, balances.length - 1)) * plotWidth;
        const clamped = Math.max(0, Math.min(scale.maximum, balance));
        const y = top + (1 - clamped / scale.maximum) * plotHeight;
        return `${x},${y}`;
      })
      .join(' ');

    return {
      width,
      height,
      points,
      current: balances.at(-1) ?? account.initialBalance,
      maximum: scale.maximum,
    };
  }, [account, transactions]);

  if (isLoading || !chart)
    return <div className="header-portfolio-chart header-portfolio-chart-empty" />;

  return (
    <div
      className="header-portfolio-chart"
      title={`Portfel: ${chart.current.toFixed(2).replace('.', ',')} zł`}
    >
      <div className="header-portfolio-chart-meta">
        <span>Portfel</span>
        <strong>{chart.current.toFixed(2).replace('.', ',')} zł</strong>
        <span>0–{chart.maximum.toLocaleString('pl-PL')} zł</span>
      </div>
      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        preserveAspectRatio="none"
        aria-label="Skrócony wykres historii salda"
      >
        <line
          x1="4"
          y1={chart.height - 5}
          x2={chart.width - 4}
          y2={chart.height - 5}
          className="stroke-zinc-700"
          strokeWidth="1"
        />
        <polyline
          points={chart.points}
          fill="none"
          stroke="var(--app-accent)"
          strokeWidth="2.2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
