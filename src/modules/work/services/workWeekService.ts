import { database } from '@/database/database';
import { createInitialWorkWeek } from '@/modules/work/data/workMockData';
import type { WorkWeek } from '@/modules/work/types/work.types';

type WorkWeekUpdater = (week: WorkWeek) => WorkWeek;

async function initialize(): Promise<void> {
  const numberOfWeeks = await database.workWeeks.count();

  if (numberOfWeeks > 0) {
    return;
  }

  await database.workWeeks.put(createInitialWorkWeek());
}

async function getCurrentWeek(): Promise<WorkWeek | undefined> {
  return database.workWeeks.orderBy('startDate').last();
}

async function getWeekById(workWeekId: string): Promise<WorkWeek | undefined> {
  return database.workWeeks.get(workWeekId);
}

async function saveWeek(week: WorkWeek): Promise<void> {
  await database.workWeeks.put({
    ...week,
    updatedAt: new Date().toISOString(),
  });
}

async function updateWeek(workWeekId: string, updater: WorkWeekUpdater): Promise<void> {
  await database.transaction('rw', database.workWeeks, async () => {
    const existingWeek = await database.workWeeks.get(workWeekId);

    if (!existingWeek) {
      throw new Error(`Nie znaleziono tygodnia pracy: ${workWeekId}`);
    }

    const updatedWeek = updater(structuredClone(existingWeek));

    await database.workWeeks.put({
      ...updatedWeek,
      id: existingWeek.id,
      createdAt: existingWeek.createdAt,
      updatedAt: new Date().toISOString(),
    });
  });
}

async function resetWeek(workWeekId: string): Promise<void> {
  const initialWeek = createInitialWorkWeek();

  await database.workWeeks.put({
    ...initialWeek,
    id: workWeekId,
    updatedAt: new Date().toISOString(),
  });
}

async function deleteAllWorkData(): Promise<void> {
  await database.transaction('rw', database.workWeeks, async () => {
    await database.workWeeks.clear();
    await database.workWeeks.put(createInitialWorkWeek());
  });
}

export const workWeekService = {
  initialize,
  getCurrentWeek,
  getWeekById,
  saveWeek,
  updateWeek,
  resetWeek,
  deleteAllWorkData,
};
