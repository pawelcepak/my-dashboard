import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import {
  HISTORICAL_WORK_IMPORT_RANGE,
  HISTORICAL_WORK_WEEKS_2026,
} from '@/modules/settings/data/historicalWorkWeeks2026';

export type HistoricalWorkImportStatus = {
  totalWeeks: number;
  importableWeeks: number;
  existingWeekNumbers: number[];
};

export type HistoricalWorkImportResult = {
  importedWeekNumbers: number[];
  skippedWeekNumbers: number[];
};

async function getStatus(): Promise<HistoricalWorkImportStatus> {
  const existingWeeks = await database.workWeeks
    .where('year')
    .equals(HISTORICAL_WORK_IMPORT_RANGE.year)
    .toArray();

  const existingWeekNumbers = existingWeeks
    .filter(
      (week) =>
        week.weekNumber >= HISTORICAL_WORK_IMPORT_RANGE.firstWeekNumber &&
        week.weekNumber <= HISTORICAL_WORK_IMPORT_RANGE.lastWeekNumber
    )
    .map((week) => week.weekNumber)
    .sort((firstWeek, secondWeek) => firstWeek - secondWeek);

  return {
    totalWeeks: HISTORICAL_WORK_IMPORT_RANGE.weekCount,
    importableWeeks: HISTORICAL_WORK_IMPORT_RANGE.weekCount - existingWeekNumbers.length,
    existingWeekNumbers,
  };
}

async function importMissingWeeks(): Promise<HistoricalWorkImportResult> {
  const result = await database.transaction(
    'rw',
    database.workWeeks,
    async (): Promise<HistoricalWorkImportResult> => {
      const importedWeekNumbers: number[] = [];
      const skippedWeekNumbers: number[] = [];

      for (const sourceWeek of HISTORICAL_WORK_WEEKS_2026) {
        const existingWeek = await database.workWeeks
          .where('[year+weekNumber]')
          .equals([sourceWeek.year, sourceWeek.weekNumber])
          .first();

        if (existingWeek) {
          skippedWeekNumbers.push(sourceWeek.weekNumber);
          continue;
        }

        await database.workWeeks.add(structuredClone(sourceWeek));
        importedWeekNumbers.push(sourceWeek.weekNumber);
      }

      return {
        importedWeekNumbers,
        skippedWeekNumbers,
      };
    }
  );

  if (result.importedWeekNumbers.length > 0) {
    cloudDirtyTracker.markDirty();
  }

  return result;
}

export const historicalWorkImportService = {
  getStatus,
  importMissingWeeks,
};
