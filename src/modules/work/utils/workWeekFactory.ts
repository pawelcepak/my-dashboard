import type {
  FinancialPlanItem,
  WorkDay,
  WorkWeek,
  WorkWeekCreateOptions,
} from '@/modules/work/types/work.types';
import { addDaysToIsoDate, getIsoWeekDateRange } from '@/modules/work/utils/workWeekDate';

const DEFAULT_EXCHANGE_RATE_EUR_PLN = 4.2;
const DEFAULT_WORK_RATING = 8.5;

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
      beers: 0,
      workRating: DEFAULT_WORK_RATING,
      messages: 0,
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
          dailyMessagesTarget: null,
          weeklyMessagesTarget: 1576,
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
      beers: 0,
      workRating: DEFAULT_WORK_RATING,
      messages: 0,
      sessions: [],
    })),
  };
}
