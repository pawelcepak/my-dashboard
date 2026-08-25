import { getMessageRate, formatNumber } from '@/modules/work/utils/workCalculations';

type HeaderWeeklyProgressProps = {
  totalMessages: number;
};

const MAXIMUM_THRESHOLD = 1976;

function getThresholdPosition(value: number): number {
  return Math.min(100, Math.max(0, (value / MAXIMUM_THRESHOLD) * 100));
}

export default function HeaderWeeklyProgress({ totalMessages }: HeaderWeeklyProgressProps) {
  const progressPercentage = getThresholdPosition(totalMessages);
  const currentRate = getMessageRate(totalMessages);

  return (
    <div
      className="header-week-progress"
      title={`Postęp tygodnia: ${formatNumber(totalMessages)} wiadomości · ${currentRate
        .toFixed(4)
        .replace('.', ',')} €`}
    >
      <div className="header-week-progress-meta">
        <span className="header-week-progress-label">Postęp tygodnia</span>
        <span className="header-week-progress-result">{formatNumber(totalMessages)}</span>
        <span className="header-week-progress-rate">
          {currentRate.toFixed(4).replace('.', ',')} €
        </span>
      </div>

      <div className="header-week-progress-track" aria-hidden="true">
        <div className="header-week-progress-fill" style={{ width: `${progressPercentage}%` }} />

        <span
          className="header-week-progress-threshold"
          style={{ left: `${getThresholdPosition(776)}%` }}
        />
        <span
          className="header-week-progress-threshold"
          style={{ left: `${getThresholdPosition(1576)}%` }}
        />
      </div>

      <div className="header-week-progress-scale" aria-hidden="true">
        <span>0</span>
        <span>776</span>
        <span>1576</span>
        <span>1976</span>
      </div>
    </div>
  );
}
