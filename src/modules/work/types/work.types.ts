import type { AppPreferenceKey } from '@/modules/settings/types/appSettings.types';

export type WorkSession = {
  id: string;
  startTime: string;
  endTime: string;
};

export type WorkDay = {
  id: string;
  date: string;
  messages: number;
  freeMessages: number;
  heldMessages: number;
  responses?: number;
  beers: number;
  workRating: number | null;
  sessions: WorkSession[];
};

export type FinancialPlanItem = {
  id: string;
  name: string;
  plannedAmountPln: number;
  priority: number;
  locked: boolean;
};

export type WorkWeekGoals = {
  dailyMessagesTarget: number | null;
  weeklyMessagesTarget: number | null;
  weeklyMessagesTarget5Days: number | null;
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

export type AppSettingKey =
  | 'activeWorkWeekId'
  | 'lastBackupAt'
  | 'shoppingPlans'
  | AppPreferenceKey;

export type AppSetting = {
  key: AppSettingKey;
  value: string;
  updatedAt: string;
};
