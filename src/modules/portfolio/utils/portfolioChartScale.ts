export type PortfolioChartScale = {
  maximum: number;
  majorStep: number;
  minorStep: number;
  majorTicks: number[];
  minorTicks: number[];
};

function rangeTicks(maximum: number, step: number): number[] {
  const ticks: number[] = [];
  for (let value = 0; value <= maximum + step / 2; value += step) {
    ticks.push(Math.round(value * 100) / 100);
  }
  return ticks;
}

export function getPortfolioChartScale(maxBalance: number): PortfolioChartScale {
  const value = Math.max(0, maxBalance);
  let majorStep: number;
  let minorStep: number;

  if (value <= 1000) {
    majorStep = 50;
    minorStep = 10;
  } else if (value <= 5000) {
    majorStep = 250;
    minorStep = 50;
  } else if (value <= 10000) {
    majorStep = 500;
    minorStep = 100;
  } else if (value <= 25000) {
    majorStep = 1000;
    minorStep = 250;
  } else if (value <= 50000) {
    majorStep = 2500;
    minorStep = 500;
  } else if (value <= 100000) {
    majorStep = 5000;
    minorStep = 1000;
  } else {
    const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, value)));
    majorStep = magnitude / 2;
    minorStep = majorStep / 5;
  }

  const maximum = Math.max(majorStep, Math.ceil(value / majorStep) * majorStep);
  const majorTicks = rangeTicks(maximum, majorStep);
  const majorSet = new Set(majorTicks.map((tick) => tick.toFixed(6)));
  const minorTicks = rangeTicks(maximum, minorStep).filter(
    (tick) => !majorSet.has(tick.toFixed(6))
  );

  return { maximum, majorStep, minorStep, majorTicks, minorTicks };
}
