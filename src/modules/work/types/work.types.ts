export type WorkSession = {
  id: string;
  startTime: string;
  endTime: string;
};

export type WorkDay = {
  id: string;
  date: string;
  beers: number;
  workRating: number | null;
  messages: number;
  sessions: WorkSession[];
};

export type FinancialPlanItem = {
  id: string;
  name: string;
  plannedAmountPln: number;
};

export type WorkWeekGoals = {
  dailyMessagesTarget: number | null;
  weeklyMessagesTarget: number | null;
  dailyHoursTarget: number | null;
};

export type WorkWeek = {
  id: string;
  year: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  heldMessages: number;
  exchangeRateEurPln: number;
  goals: WorkWeekGoals;
  days: WorkDay[];
  financialPlan: FinancialPlanItem[];
  createdAt: string;
  updatedAt: string;
};

export type WorkWeekCreateOptions = {
  year: number;
  weekNumber: number;
  copySettingsFromWeekId: string | null;
};

export type AppSettingKey = 'activeWorkWeekId';

export type AppSetting = {
  key: AppSettingKey;
  value: string;
  updatedAt: string;
};

export type MessageRateTier = {
  minimumMessages: number;
  maximumMessages: number | null;
  rateEur: number;
};

export type PayoutFeeTier = {
  minimumAmountEur: number;
  maximumAmountEur: number | null;
  feeEur: number;
};

export type WorkWeekSummary = {
  totalMessages: number;
  totalHeldMessages: number;
  totalMinutes: number;
  totalHours: number;
  averageMessagesPerHour: number;
  messagesDividedByForty: number;
  messageRateEur: number;
  regularMessagesEarningsEur: number;
  heldMessagesEarningsEur: number;
  grossEarningsEur: number;
  payoutFeeEur: number;
  netEarningsEur: number;
  netEarningsPln: number;
  financialPlanTotalPln: number;
  financialPlanBalancePln: number;
};

export type WorkProgress = {
  currentThreshold: number;
  nextThreshold: number | null;
  messagesMissing: number;
  remainingDays: number;
  requiredMessagesPerDay: number;
  status: 'red' | 'yellow' | 'light-green' | 'green';
};
