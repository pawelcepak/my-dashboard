import { database } from '@/database/database';
import { createInitialWorkWeek } from '@/modules/work/data/workMockData';
import type { WorkWeek, WorkWeekCreateOptions } from '@/modules/work/types/work.types';
import { clearWorkWeekActivity, createEmptyWorkWeek } from '@/modules/work/utils/workWeekFactory';

type WorkWeekUpdater = (week: WorkWeek) => WorkWeek;

async function initialize(): Promise<void> {
  await database.transaction('rw', database.workWeeks, database.appSettings, async () => {
    const numberOfWeeks = await database.workWeeks.count();

    if (numberOfWeeks === 0) {
      const initialWeek = createInitialWorkWeek();

      await database.workWeeks.put(initialWeek);

      await database.appSettings.put({
        key: 'activeWorkWeekId',
        value: initialWeek.id,
        updatedAt: new Date().toISOString(),
      });

      return;
    }

    const activeSetting = await database.appSettings.get('activeWorkWeekId');

    if (activeSetting) {
      const activeWeekExists = await database.workWeeks.get(activeSetting.value);

      if (activeWeekExists) {
        return;
      }
    }

    const newestWeek = await database.workWeeks.orderBy('startDate').last();

    if (newestWeek) {
      await database.appSettings.put({
        key: 'activeWorkWeekId',
        value: newestWeek.id,
        updatedAt: new Date().toISOString(),
      });
    }
  });
}

async function getAllWeeks(): Promise<WorkWeek[]> {
  return database.workWeeks.orderBy('startDate').reverse().toArray();
}

async function getActiveWeek(): Promise<WorkWeek | undefined> {
  const setting = await database.appSettings.get('activeWorkWeekId');

  if (setting) {
    const activeWeek = await database.workWeeks.get(setting.value);

    if (activeWeek) {
      return activeWeek;
    }
  }

  return database.workWeeks.orderBy('startDate').last();
}

async function getWeekById(workWeekId: string): Promise<WorkWeek | undefined> {
  return database.workWeeks.get(workWeekId);
}

async function createWeek(options: WorkWeekCreateOptions): Promise<WorkWeek> {
  return database.transaction('rw', database.workWeeks, database.appSettings, async () => {
    const existingWeek = await database.workWeeks
      .where('[year+weekNumber]')
      .equals([options.year, options.weekNumber])
      .first();

    if (existingWeek) {
      throw new Error(`Tydzień ${options.weekNumber} roku ${options.year} już istnieje.`);
    }

    const sourceWeek = options.copySettingsFromWeekId
      ? await database.workWeeks.get(options.copySettingsFromWeekId)
      : undefined;

    const newWeek = createEmptyWorkWeek(options, sourceWeek);

    await database.workWeeks.add(newWeek);

    await database.appSettings.put({
      key: 'activeWorkWeekId',
      value: newWeek.id,
      updatedAt: new Date().toISOString(),
    });

    return newWeek;
  });
}

async function setActiveWeek(workWeekId: string): Promise<void> {
  const week = await database.workWeeks.get(workWeekId);

  if (!week) {
    throw new Error(`Nie znaleziono tygodnia pracy: ${workWeekId}`);
  }

  await database.appSettings.put({
    key: 'activeWorkWeekId',
    value: workWeekId,
    updatedAt: new Date().toISOString(),
  });
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
      year: existingWeek.year,
      weekNumber: existingWeek.weekNumber,
      startDate: existingWeek.startDate,
      endDate: existingWeek.endDate,
      createdAt: existingWeek.createdAt,
      updatedAt: new Date().toISOString(),
    });
  });
}

async function resetWeek(workWeekId: string): Promise<void> {
  await updateWeek(workWeekId, clearWorkWeekActivity);
}

async function deleteWeek(workWeekId: string): Promise<void> {
  await database.transaction('rw', database.workWeeks, database.appSettings, async () => {
    const numberOfWeeks = await database.workWeeks.count();

    if (numberOfWeeks <= 1) {
      throw new Error('Nie można usunąć ostatniego tygodnia w bazie.');
    }

    const week = await database.workWeeks.get(workWeekId);

    if (!week) {
      throw new Error(`Nie znaleziono tygodnia pracy: ${workWeekId}`);
    }

    const activeSetting = await database.appSettings.get('activeWorkWeekId');

    await database.workWeeks.delete(workWeekId);

    if (activeSetting?.value === workWeekId) {
      const newestRemainingWeek = await database.workWeeks.orderBy('startDate').last();

      if (!newestRemainingWeek) {
        throw new Error('Nie znaleziono tygodnia zastępczego.');
      }

      await database.appSettings.put({
        key: 'activeWorkWeekId',
        value: newestRemainingWeek.id,
        updatedAt: new Date().toISOString(),
      });
    }
  });
}

export const workWeekService = {
  initialize,
  getAllWeeks,
  getActiveWeek,
  getWeekById,
  createWeek,
  setActiveWeek,
  saveWeek,
  updateWeek,
  resetWeek,
  deleteWeek,
};
