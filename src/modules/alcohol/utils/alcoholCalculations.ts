import type {
  AlcoholDayOverride,
  AlcoholDayStatus,
  AlcoholMonthSummary,
  AlcoholMonthlyExpense,
  AlcoholOverview,
  AlcoholSettings,
} from '@/modules/alcohol/types/alcohol.types';
import type { PortfolioTransaction } from '@/modules/portfolio/types/portfolio.types';
import type { WorkWeek } from '@/modules/work/types/work.types';

export function toMonthKey(value: string): string {
  return value.slice(0, 7);
}

export function getMonthLabel(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);

  return new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, monthNumber - 1, 1));
}

export function getAutomaticAlcoholDays(workWeeks: WorkWeek[]) {
  const days = new Map<string, number>();

  for (const week of workWeeks) {
    for (const day of week.days) {
      days.set(day.date, day.beers);
    }
  }

  return days;
}

export function createAlcoholDayStatuses(
  workWeeks: WorkWeek[],
  overrides: AlcoholDayOverride[]
): Map<string, AlcoholDayStatus> {
  const beersByDate = getAutomaticAlcoholDays(workWeeks);
  const overridesByDate = new Map(overrides.map((override) => [override.date, override]));

  const dates = new Set([...beersByDate.keys(), ...overridesByDate.keys()]);

  return new Map(
    [...dates].map((date) => {
      const beers = beersByDate.get(date) ?? 0;
      const automaticDrinking = beers > 0;
      const overrideState = overridesByDate.get(date)?.state ?? null;
      const drinking =
        overrideState === 'drinking' ? true : overrideState === 'sober' ? false : automaticDrinking;

      return [
        date,
        {
          date,
          beers,
          automaticDrinking,
          drinking,
          overrideState,
        },
      ];
    })
  );
}

function getPortfolioExpensesByMonth(
  transactions: PortfolioTransaction[],
  settings: AlcoholSettings
): Map<string, number> {
  const selectedTags = new Set(settings.expenseTagIds);
  const totals = new Map<string, number>();

  for (const transaction of transactions) {
    if (
      transaction.type !== 'expense' ||
      !transaction.tagId ||
      !selectedTags.has(transaction.tagId)
    ) {
      continue;
    }

    const month = toMonthKey(transaction.date);
    totals.set(month, (totals.get(month) ?? 0) + transaction.amount);
  }

  return totals;
}

export function createAlcoholMonthSummaries(
  workWeeks: WorkWeek[],
  overrides: AlcoholDayOverride[],
  manualExpenses: AlcoholMonthlyExpense[],
  portfolioTransactions: PortfolioTransaction[],
  settings: AlcoholSettings
): AlcoholMonthSummary[] {
  const statuses = createAlcoholDayStatuses(workWeeks, overrides);
  const manualByMonth = new Map(manualExpenses.map((expense) => [expense.month, expense.amount]));
  const portfolioByMonth = getPortfolioExpensesByMonth(portfolioTransactions, settings);

  const months = new Set<string>([
    ...[...statuses.keys()].map(toMonthKey),
    ...manualByMonth.keys(),
    ...portfolioByMonth.keys(),
  ]);

  return [...months].sort().map((month) => {
    const monthStatuses = [...statuses.values()].filter(
      (status) => toMonthKey(status.date) === month
    );

    const usePortfolio = month >= settings.portfolioExpenseStartMonth;

    return {
      month,
      drinkingDays: monthStatuses.filter((status) => status.drinking).length,
      beers: monthStatuses.reduce((total, status) => total + status.beers, 0),
      expense: usePortfolio ? (portfolioByMonth.get(month) ?? 0) : (manualByMonth.get(month) ?? 0),
      expenseSource: usePortfolio ? 'portfolio' : 'manual',
    };
  });
}

function getDateRange(firstDate: string, lastDate: string): string[] {
  const result: string[] = [];
  const cursor = new Date(`${firstDate}T12:00:00`);
  const end = new Date(`${lastDate}T12:00:00`);

  while (cursor <= end) {
    result.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

export function calculateAlcoholOverview(
  statuses: Map<string, AlcoholDayStatus>,
  months: AlcoholMonthSummary[]
): AlcoholOverview {
  const drinkingDates = [...statuses.values()]
    .filter((status) => status.drinking)
    .map((status) => status.date)
    .sort();

  let longestDrinkingStreak = 0;
  let longestBreak = 0;
  let currentDrinkingStreak = 0;
  let currentBreak = 0;

  if (drinkingDates.length > 0) {
    const drinkingSet = new Set(drinkingDates);
    const allDates = getDateRange(drinkingDates[0], drinkingDates[drinkingDates.length - 1]);

    for (const currentDate of allDates) {
      if (drinkingSet.has(currentDate)) {
        currentDrinkingStreak += 1;
        currentBreak = 0;
        longestDrinkingStreak = Math.max(longestDrinkingStreak, currentDrinkingStreak);
      } else {
        currentBreak += 1;
        currentDrinkingStreak = 0;
        longestBreak = Math.max(longestBreak, currentBreak);
      }
    }
  }

  return {
    totalDrinkingDays: drinkingDates.length,
    totalBeers: months.reduce((total, month) => total + month.beers, 0),
    totalExpense: months.reduce((total, month) => total + month.expense, 0),
    averageDrinkingDaysPerMonth: months.length > 0 ? drinkingDates.length / months.length : 0,
    longestDrinkingStreak,
    longestBreak,
  };
}
