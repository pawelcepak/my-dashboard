import Dexie, { type Table } from 'dexie';

import type { AppSetting, FinancialPlanItem, WorkWeek } from '@/modules/work/types/work.types';

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
            dailyMessagesTarget: null,
            weeklyMessagesTarget: 1576,
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
  }
}

export const database = new MyDashboardDatabase();
