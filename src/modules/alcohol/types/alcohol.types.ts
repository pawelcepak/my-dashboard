export type AlcoholDayOverrideState = 'drinking' | 'sober';

export type AlcoholDayOverride = {
  date: string;
  state: AlcoholDayOverrideState;
  source: 'manual' | 'historical-import';
  createdAt: string;
  updatedAt: string;
};

export type AlcoholMonthlyExpense = {
  month: string;
  amount: number;
  source: 'manual';
  createdAt: string;
  updatedAt: string;
};

export type AlcoholSettings = {
  id: 'alcohol-settings';
  expenseTagIds: string[];
  portfolioExpenseStartMonth: string;
  createdAt: string;
  updatedAt: string;
};

export type AlcoholDayStatus = {
  date: string;
  beers: number;
  automaticDrinking: boolean;
  drinking: boolean;
  overrideState: AlcoholDayOverrideState | null;
};

export type AlcoholMonthSummary = {
  month: string;
  drinkingDays: number;
  beers: number;
  expense: number;
  expenseSource: 'manual' | 'portfolio';
};

export type AlcoholOverview = {
  totalDrinkingDays: number;
  totalBeers: number;
  totalExpense: number;
  averageDrinkingDaysPerMonth: number;
  longestDrinkingStreak: number;
  longestBreak: number;
};
