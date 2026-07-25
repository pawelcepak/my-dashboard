import Dexie, { type Table } from 'dexie';

import type { WorkWeek } from '@/modules/work/types/work.types';

class MyDashboardDatabase extends Dexie {
  workWeeks!: Table<WorkWeek, string>;

  constructor() {
    super('my-dashboard');

    this.version(1).stores({
      workWeeks: 'id, [year+weekNumber], year, weekNumber, startDate, endDate, updatedAt',
    });
  }
}

export const database = new MyDashboardDatabase();
