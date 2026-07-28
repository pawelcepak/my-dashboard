import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import {
  HISTORICAL_ALCOHOL_DAY_OVERRIDES,
  HISTORICAL_ALCOHOL_MONTHLY_EXPENSES,
} from '@/modules/alcohol/data/alcoholHistoricalData';
import type { AlcoholDayOverride, AlcoholSettings } from '@/modules/alcohol/types/alcohol.types';

export const ALCOHOL_SETTINGS_ID = 'alcohol-settings';

async function initialize(): Promise<void> {
  const timestamp = new Date().toISOString();

  await database.transaction(
    'rw',
    database.alcoholDayOverrides,
    database.alcoholMonthlyExpenses,
    database.alcoholSettings,
    database.portfolioTags,
    async () => {
      const settings = await database.alcoholSettings.get(ALCOHOL_SETTINGS_ID);

      if (!settings) {
        const tags = await database.portfolioTags.toArray();
        const defaultExpenseTagIds = tags
          .filter((tag) => tag.name.toLocaleLowerCase('pl-PL').includes('browar'))
          .map((tag) => tag.id);

        const nextSettings: AlcoholSettings = {
          id: ALCOHOL_SETTINGS_ID,
          expenseTagIds: defaultExpenseTagIds,
          portfolioExpenseStartMonth: '2026-06',
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        await database.alcoholSettings.add(nextSettings);
      }

      if ((await database.alcoholDayOverrides.count()) === 0) {
        await database.alcoholDayOverrides.bulkAdd(HISTORICAL_ALCOHOL_DAY_OVERRIDES);
      }

      if ((await database.alcoholMonthlyExpenses.count()) === 0) {
        await database.alcoholMonthlyExpenses.bulkAdd(HISTORICAL_ALCOHOL_MONTHLY_EXPENSES);
      }
    }
  );
}

async function toggleDay(date: string, automaticDrinking: boolean): Promise<void> {
  const existing = await database.alcoholDayOverrides.get(date);
  const currentDrinking = existing ? existing.state === 'drinking' : automaticDrinking;
  const desiredDrinking = !currentDrinking;

  if (desiredDrinking === automaticDrinking) {
    await database.alcoholDayOverrides.delete(date);
  } else {
    const timestamp = new Date().toISOString();
    const override: AlcoholDayOverride = {
      date,
      state: desiredDrinking ? 'drinking' : 'sober',
      source: 'manual',
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    await database.alcoholDayOverrides.put(override);
  }

  cloudDirtyTracker.markDirty();
}

async function clearOverride(date: string): Promise<void> {
  await database.alcoholDayOverrides.delete(date);
  cloudDirtyTracker.markDirty();
}

async function updateExpenseTagIds(expenseTagIds: string[]): Promise<void> {
  const current = await database.alcoholSettings.get(ALCOHOL_SETTINGS_ID);

  if (!current) {
    throw new Error('Nie znaleziono ustawień modułu Alkohol.');
  }

  await database.alcoholSettings.put({
    ...current,
    expenseTagIds: [...new Set(expenseTagIds)],
    updatedAt: new Date().toISOString(),
  });

  cloudDirtyTracker.markDirty();
}

export const alcoholService = {
  initialize,
  toggleDay,
  clearOverride,
  updateExpenseTagIds,
};
