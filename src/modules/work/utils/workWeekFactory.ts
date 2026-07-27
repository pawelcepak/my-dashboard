import type {
  FinancialPlanItem,
  WorkDay,
  WorkWeek,
  WorkWeekCreateOptions,
} from '@/modules/work/types/work.types';
import { addDaysToIsoDate, getIsoWeekDateRange } from '@/modules/work/utils/workWeekDate';

const DEFAULT_EXCHANGE_RATE_EUR_PLN = 4.2;
const DEFAULT_WORK_RATING = 8.5;

const DEFAULT_WEEKLY_MESSAGES_TARGET = 1576;
const DEFAULT_DAILY_MESSAGES_TARGET = 225.14;
const DEFAULT_WEEKLY_MESSAGES_TARGET_5_DAYS = 1125.71;

function createFinancialPlanCopy(sourceItems: FinancialPlanItem[]): FinancialPlanItem[] {
  return sourceItems.map((item, index) => ({
    id: crypto.randomUUID(),
    name: item.name,
    plannedAmountPln: item.plannedAmountPln,
    priority: item.priority ?? index + 1,
    locked: item.locked ?? false,
  }));
}

function createEmptyWorkDays(startDate: string): WorkDay[] {
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const date = addDaysToIsoDate(startDate, dayIndex);

    return {
      id: crypto.randomUUID(),
      date,
      messages: 0,
      freeMessages: 0,
      heldMessages: 0,
      beers: 0,
      workRating: DEFAULT_WORK_RATING,
      sessions: [],
    };
  });
}

export function createEmptyWorkWeek(
  options: WorkWeekCreateOptions,
  sourceWeek?: WorkWeek
): WorkWeek {
  const { startDate, endDate } = getIsoWeekDateRange(options.year, options.weekNumber);

  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    year: options.year,
    weekNumber: options.weekNumber,
    startDate,
    endDate,
    heldMessages: 0,
    exchangeRateEurPln: sourceWeek?.exchangeRateEurPln ?? DEFAULT_EXCHANGE_RATE_EUR_PLN,
    goals: sourceWeek
      ? structuredClone(sourceWeek.goals)
      : {
          dailyMessagesTarget: DEFAULT_DAILY_MESSAGES_TARGET,
          weeklyMessagesTarget: DEFAULT_WEEKLY_MESSAGES_TARGET,
          weeklyMessagesTarget5Days: DEFAULT_WEEKLY_MESSAGES_TARGET_5_DAYS,
          dailyHoursTarget: null,
        },
    days: createEmptyWorkDays(startDate),
    financialPlan: sourceWeek ? createFinancialPlanCopy(sourceWeek.financialPlan) : [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function clearWorkWeekActivity(week: WorkWeek): WorkWeek {
  return {
    ...week,
    heldMessages: 0,
    days: week.days.map((day) => ({
      ...day,
      messages: 0,
      freeMessages: 0,
      heldMessages: 0,
      beers: 0,
      workRating: DEFAULT_WORK_RATING,
      sessions: [],
    })),
  };
}
