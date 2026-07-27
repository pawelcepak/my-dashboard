import Dexie, { type Table } from 'dexie';

import type {
  AppSetting,
  FinancialPlanItem,
  WorkDay,
  WorkWeek,
  WorkWeekGoals,
} from '@/modules/work/types/work.types';

export const DATABASE_SCHEMA_VERSION = 5;

const DEFAULT_WEEKLY_MESSAGES_TARGET = 1576;
const GOAL_PRECISION_MULTIPLIER = 100;

function roundGoalValue(value: number): number {
  return Math.round(value * GOAL_PRECISION_MULTIPLIER) / GOAL_PRECISION_MULTIPLIER;
}

function getNullableNonNegativeNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}

function getNonNegativeInteger(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return 0;
  }

  return value;
}

function normalizeWorkDay(day: WorkDay): WorkDay {
  return {
    ...day,
    messages: getNonNegativeInteger(day.messages),
    freeMessages: getNonNegativeInteger(day.freeMessages),
    heldMessages: getNonNegativeInteger(day.heldMessages),
    beers: getNonNegativeInteger(day.beers),
    sessions: Array.isArray(day.sessions) ? day.sessions : [],
  };
}

function normalizeWorkGoals(goals: Partial<WorkWeekGoals> | undefined): WorkWeekGoals {
  const storedDailyTarget = getNullableNonNegativeNumber(goals?.dailyMessagesTarget);

  const storedWeekly7DaysTarget = getNullableNonNegativeNumber(goals?.weeklyMessagesTarget);

  const storedWeekly5DaysTarget = getNullableNonNegativeNumber(goals?.weeklyMessagesTarget5Days);

  const dailyHoursTarget = getNullableNonNegativeNumber(goals?.dailyHoursTarget);

  if (storedDailyTarget !== null) {
    return {
      dailyMessagesTarget: roundGoalValue(storedDailyTarget),
      weeklyMessagesTarget: storedWeekly7DaysTarget ?? roundGoalValue(storedDailyTarget * 7),
      weeklyMessagesTarget5Days: storedWeekly5DaysTarget ?? roundGoalValue(storedDailyTarget * 5),
      dailyHoursTarget,
    };
  }

  if (storedWeekly7DaysTarget !== null) {
    const dailyMessagesTarget = roundGoalValue(storedWeekly7DaysTarget / 7);

    return {
      dailyMessagesTarget,
      weeklyMessagesTarget: roundGoalValue(storedWeekly7DaysTarget),
      weeklyMessagesTarget5Days:
        storedWeekly5DaysTarget ?? roundGoalValue((storedWeekly7DaysTarget / 7) * 5),
      dailyHoursTarget,
    };
  }

  if (storedWeekly5DaysTarget !== null) {
    const dailyMessagesTarget = roundGoalValue(storedWeekly5DaysTarget / 5);

    return {
      dailyMessagesTarget,
      weeklyMessagesTarget: roundGoalValue((storedWeekly5DaysTarget / 5) * 7),
      weeklyMessagesTarget5Days: roundGoalValue(storedWeekly5DaysTarget),
      dailyHoursTarget,
    };
  }

  return {
    dailyMessagesTarget: null,
    weeklyMessagesTarget: null,
    weeklyMessagesTarget5Days: null,
    dailyHoursTarget,
  };
}

function normalizeFinancialPlan(items: FinancialPlanItem[] | undefined): FinancialPlanItem[] {
  return [...(items ?? [])]
    .map((item, index) => ({
      ...item,
      priority: Number.isInteger(item.priority) && item.priority > 0 ? item.priority : index + 1,
      locked: typeof item.locked === 'boolean' ? item.locked : false,
    }))
    .sort((firstItem, secondItem) => firstItem.priority - secondItem.priority)
    .map((item, index) => ({
      ...item,
      priority: index + 1,
    }));
}

class MyDashboardDatabase extends Dexie {
  workWeeks!: Table<WorkWeek, string>;
  appSettings!: Table<AppSetting, string>;

  constructor() {
    super('my-dashboard');

    this.version(1).stores({
      workWeeks: 'id, [year+weekNumber], year, weekNumber, startDate, endDate, updatedAt',
    });

    this.version(2)
      .stores({
        workWeeks: 'id, &[year+weekNumber], year, weekNumber, startDate, endDate, updatedAt',
        appSettings: 'key, updatedAt',
      })
      .upgrade(async (transaction) => {
        const workWeeksTable = transaction.table<WorkWeek, string>('workWeeks');

        const settingsTable = transaction.table<AppSetting, string>('appSettings');

        const weeks = await workWeeksTable.toArray();

        const normalizedWeeks = weeks.map((week) => ({
          ...week,
          goals: week.goals ?? {
            dailyMessagesTarget: roundGoalValue(DEFAULT_WEEKLY_MESSAGES_TARGET / 7),
            weeklyMessagesTarget: DEFAULT_WEEKLY_MESSAGES_TARGET,
            weeklyMessagesTarget5Days: roundGoalValue((DEFAULT_WEEKLY_MESSAGES_TARGET / 7) * 5),
            dailyHoursTarget: null,
          },
          createdAt: week.createdAt ?? new Date().toISOString(),
          updatedAt: week.updatedAt ?? new Date().toISOString(),
        }));

        await workWeeksTable.bulkPut(normalizedWeeks);

        const newestWeek = [...normalizedWeeks].sort((firstWeek, secondWeek) =>
          secondWeek.startDate.localeCompare(firstWeek.startDate)
        )[0];

        if (newestWeek) {
          await settingsTable.put({
            key: 'activeWorkWeekId',
            value: newestWeek.id,
            updatedAt: new Date().toISOString(),
          });
        }
      });

    this.version(3)
      .stores({
        workWeeks: 'id, &[year+weekNumber], year, weekNumber, startDate, endDate, updatedAt',
        appSettings: 'key, updatedAt',
      })
      .upgrade(async (transaction) => {
        const workWeeksTable = transaction.table<WorkWeek, string>('workWeeks');

        const weeks = await workWeeksTable.toArray();

        const normalizedWeeks = weeks.map((week) => ({
          ...week,
          financialPlan: normalizeFinancialPlan(week.financialPlan),
          updatedAt: new Date().toISOString(),
        }));

        await workWeeksTable.bulkPut(normalizedWeeks);
      });

    this.version(4)
      .stores({
        workWeeks: 'id, &[year+weekNumber], year, weekNumber, startDate, endDate, updatedAt',
        appSettings: 'key, updatedAt',
      })
      .upgrade(async (transaction) => {
        const workWeeksTable = transaction.table<WorkWeek, string>('workWeeks');

        const weeks = await workWeeksTable.toArray();

        const normalizedWeeks = weeks.map((week) => ({
          ...week,
          goals: normalizeWorkGoals(week.goals),
          updatedAt: new Date().toISOString(),
        }));

        await workWeeksTable.bulkPut(normalizedWeeks);
      });

    this.version(DATABASE_SCHEMA_VERSION)
      .stores({
        workWeeks: 'id, &[year+weekNumber], year, weekNumber, startDate, endDate, updatedAt',
        appSettings: 'key, updatedAt',
      })
      .upgrade(async (transaction) => {
        const workWeeksTable = transaction.table<WorkWeek, string>('workWeeks');

        const weeks = await workWeeksTable.toArray();

        const migrationTimestamp = new Date().toISOString();

        const normalizedWeeks = weeks.map((week) => ({
          ...week,
          days: week.days.map(normalizeWorkDay),
          updatedAt: migrationTimestamp,
        }));

        await workWeeksTable.bulkPut(normalizedWeeks);
      });
  }
}

export const database = new MyDashboardDatabase();
