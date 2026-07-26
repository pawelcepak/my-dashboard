import { database } from '@/database/database';
import {
  BACKUP_FORMAT_NAME,
  BACKUP_FORMAT_VERSION,
  type BackupPreview,
  type ChbBackupFile,
} from '@/modules/settings/types/backup.types';
import type {
  AppSetting,
  FinancialPlanItem,
  WorkDay,
  WorkSession,
  WorkWeek,
  WorkWeekGoals,
} from '@/modules/work/types/work.types';
import { formatWorkWeekLabel } from '@/modules/work/utils/workWeekDate';

const SUPPORTED_SETTING_KEYS = new Set(['activeWorkWeekId', 'lastBackupAt']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value);
}

function isIsoDate(value: unknown): value is string {
  return isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isIsoDateTime(value: unknown): value is string {
  if (!isString(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

function isWorkSession(value: unknown): value is WorkSession {
  if (!isRecord(value)) {
    return false;
  }

  return isString(value.id) && isString(value.startTime) && isString(value.endTime);
}

function isWorkDay(value: unknown): value is WorkDay {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isIsoDate(value.date) &&
    isFiniteNumber(value.beers) &&
    value.beers >= 0 &&
    isNullableNumber(value.workRating) &&
    isFiniteNumber(value.messages) &&
    value.messages >= 0 &&
    Array.isArray(value.sessions) &&
    value.sessions.every(isWorkSession)
  );
}

function parseFinancialPlanItem(value: unknown, index: number): FinancialPlanItem {
  if (!isRecord(value)) {
    throw new Error(`Nieprawidłowa pozycja planu finansowego nr ${index + 1}.`);
  }

  if (
    !isString(value.id) ||
    !isString(value.name) ||
    !isFiniteNumber(value.plannedAmountPln) ||
    value.plannedAmountPln < 0
  ) {
    throw new Error(`Pozycja planu finansowego nr ${index + 1} zawiera nieprawidłowe dane.`);
  }

  const priority =
    isFiniteNumber(value.priority) && Number.isInteger(value.priority) && value.priority > 0
      ? value.priority
      : index + 1;

  const locked = typeof value.locked === 'boolean' ? value.locked : false;

  return {
    id: value.id,
    name: value.name,
    plannedAmountPln: value.plannedAmountPln,
    priority,
    locked,
  };
}

function normalizeFinancialPlan(value: unknown): FinancialPlanItem[] {
  if (!Array.isArray(value)) {
    throw new Error('Tydzień zawiera nieprawidłowy plan finansowy.');
  }

  return value
    .map(parseFinancialPlanItem)
    .sort((firstItem, secondItem) => firstItem.priority - secondItem.priority)
    .map((item, index) => ({
      ...item,
      priority: index + 1,
    }));
}

function isWorkWeekGoals(value: unknown): value is WorkWeekGoals {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNullableNumber(value.dailyMessagesTarget) &&
    isNullableNumber(value.weeklyMessagesTarget) &&
    isNullableNumber(value.dailyHoursTarget)
  );
}

function parseWorkWeek(value: unknown): WorkWeek {
  if (!isRecord(value)) {
    throw new Error('Kopia zawiera nieprawidłowy rekord tygodnia.');
  }

  if (
    !isString(value.id) ||
    !isFiniteNumber(value.year) ||
    !Number.isInteger(value.year) ||
    !isFiniteNumber(value.weekNumber) ||
    !Number.isInteger(value.weekNumber) ||
    value.weekNumber < 1 ||
    value.weekNumber > 53 ||
    !isIsoDate(value.startDate) ||
    !isIsoDate(value.endDate) ||
    !isFiniteNumber(value.heldMessages) ||
    value.heldMessages < 0 ||
    !isFiniteNumber(value.exchangeRateEurPln) ||
    value.exchangeRateEurPln < 0 ||
    !isWorkWeekGoals(value.goals) ||
    !Array.isArray(value.days) ||
    value.days.length !== 7 ||
    !value.days.every(isWorkDay) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error(
      `Tydzień ${String(value.year)}-W${String(value.weekNumber)} zawiera nieprawidłowe dane.`
    );
  }

  return {
    id: value.id,
    year: value.year,
    weekNumber: value.weekNumber,
    startDate: value.startDate,
    endDate: value.endDate,
    heldMessages: value.heldMessages,
    exchangeRateEurPln: value.exchangeRateEurPln,
    goals: value.goals,
    days: value.days,
    financialPlan: normalizeFinancialPlan(value.financialPlan),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function isAppSetting(value: unknown): value is AppSetting {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.key) &&
    SUPPORTED_SETTING_KEYS.has(value.key) &&
    isString(value.value) &&
    isIsoDateTime(value.updatedAt)
  );
}

function validateUniqueWeeks(weeks: WorkWeek[]): void {
  const ids = new Set<string>();
  const isoWeeks = new Set<string>();

  for (const week of weeks) {
    if (ids.has(week.id)) {
      throw new Error(`Kopia zawiera powtórzony identyfikator tygodnia: ${week.id}.`);
    }

    ids.add(week.id);

    const isoWeekKey = `${week.year}-${week.weekNumber}`;

    if (isoWeeks.has(isoWeekKey)) {
      throw new Error(`Kopia zawiera dwa rekordy tygodnia ${week.weekNumber} roku ${week.year}.`);
    }

    isoWeeks.add(isoWeekKey);
  }
}

function validateUniqueSettings(settings: AppSetting[]): void {
  const keys = new Set<string>();

  for (const setting of settings) {
    if (keys.has(setting.key)) {
      throw new Error(`Kopia zawiera powtórzone ustawienie: ${setting.key}.`);
    }

    keys.add(setting.key);
  }
}

function validateBackup(value: unknown): ChbBackupFile {
  if (!isRecord(value)) {
    throw new Error('Plik nie zawiera prawidłowego obiektu JSON.');
  }

  if (value.format !== BACKUP_FORMAT_NAME) {
    throw new Error('To nie jest plik kopii zapasowej CHB.');
  }

  if (value.version !== BACKUP_FORMAT_VERSION) {
    throw new Error(`Nieobsługiwana wersja kopii: ${String(value.version)}.`);
  }

  if (!isIsoDateTime(value.createdAt)) {
    throw new Error('Kopia ma nieprawidłową datę utworzenia.');
  }

  if (!isRecord(value.data)) {
    throw new Error('Kopia nie zawiera sekcji danych.');
  }

  if (!Array.isArray(value.data.workWeeks)) {
    throw new Error('Kopia nie zawiera prawidłowej listy tygodni pracy.');
  }

  const normalizedWorkWeeks = value.data.workWeeks.map(parseWorkWeek);

  if (normalizedWorkWeeks.length === 0) {
    throw new Error('Kopia nie zawiera żadnego tygodnia pracy.');
  }

  if (!Array.isArray(value.data.appSettings) || !value.data.appSettings.every(isAppSetting)) {
    throw new Error('Kopia zawiera nieprawidłowe ustawienia aplikacji.');
  }

  const backup: ChbBackupFile = {
    format: BACKUP_FORMAT_NAME,
    version: BACKUP_FORMAT_VERSION,
    createdAt: value.createdAt,
    data: {
      workWeeks: normalizedWorkWeeks,
      appSettings: value.data.appSettings,
    },
  };

  validateUniqueWeeks(backup.data.workWeeks);
  validateUniqueSettings(backup.data.appSettings);

  return backup;
}

function createFileName(createdAt: string): string {
  const date = new Date(createdAt);

  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  const timePart = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join('-');

  return `chb-backup-${datePart}-${timePart}.json`;
}

function downloadJsonFile(fileName: string, contents: string): void {
  const blob = new Blob([contents], {
    type: 'application/json;charset=utf-8',
  });

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

async function exportBackup(): Promise<string> {
  const createdAt = new Date().toISOString();

  await database.appSettings.put({
    key: 'lastBackupAt',
    value: createdAt,
    updatedAt: createdAt,
  });

  const workWeeks = await database.workWeeks.orderBy('startDate').toArray();

  const appSettings = await database.appSettings.toArray();

  if (workWeeks.length === 0) {
    throw new Error('Nie można utworzyć kopii bez tygodni pracy.');
  }

  const backup: ChbBackupFile = {
    format: BACKUP_FORMAT_NAME,
    version: BACKUP_FORMAT_VERSION,
    createdAt,
    data: {
      workWeeks,
      appSettings,
    },
  };

  const fileName = createFileName(createdAt);

  downloadJsonFile(fileName, JSON.stringify(backup, null, 2));

  return createdAt;
}

async function readBackupFile(file: File): Promise<BackupPreview> {
  if (!file.name.toLowerCase().endsWith('.json')) {
    throw new Error('Wybierz plik w formacie JSON.');
  }

  const text = await file.text();

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(text);
  } catch {
    throw new Error('Plik nie zawiera prawidłowego kodu JSON.');
  }

  const backup = validateBackup(parsedValue);

  const sortedWeeks = [...backup.data.workWeeks].sort((firstWeek, secondWeek) =>
    firstWeek.startDate.localeCompare(secondWeek.startDate)
  );

  const firstWeek = sortedWeeks[0];
  const lastWeek = sortedWeeks[sortedWeeks.length - 1];

  const activeSetting = backup.data.appSettings.find(
    (setting) => setting.key === 'activeWorkWeekId'
  );

  const activeWeek = activeSetting
    ? backup.data.workWeeks.find((week) => week.id === activeSetting.value)
    : undefined;

  return {
    backup,
    createdAt: backup.createdAt,
    workWeekCount: backup.data.workWeeks.length,
    years: [...new Set(backup.data.workWeeks.map((week) => week.year))].sort(
      (firstYear, secondYear) => secondYear - firstYear
    ),
    firstWeekLabel: formatWorkWeekLabel(firstWeek.year, firstWeek.weekNumber),
    lastWeekLabel: formatWorkWeekLabel(lastWeek.year, lastWeek.weekNumber),
    activeWeekLabel: activeWeek
      ? formatWorkWeekLabel(activeWeek.year, activeWeek.weekNumber)
      : null,
  };
}

async function restoreBackup(backup: ChbBackupFile): Promise<void> {
  const validatedBackup = validateBackup(backup);

  await database.transaction('rw', database.workWeeks, database.appSettings, async () => {
    await database.workWeeks.clear();
    await database.appSettings.clear();

    await database.workWeeks.bulkPut(validatedBackup.data.workWeeks);

    if (validatedBackup.data.appSettings.length > 0) {
      await database.appSettings.bulkPut(validatedBackup.data.appSettings);
    }

    const activeSetting = await database.appSettings.get('activeWorkWeekId');

    const activeWeekExists = activeSetting
      ? await database.workWeeks.get(activeSetting.value)
      : undefined;

    if (!activeWeekExists) {
      const newestWeek = await database.workWeeks.orderBy('startDate').last();

      if (!newestWeek) {
        throw new Error('Po imporcie nie znaleziono żadnego tygodnia.');
      }

      const timestamp = new Date().toISOString();

      await database.appSettings.put({
        key: 'activeWorkWeekId',
        value: newestWeek.id,
        updatedAt: timestamp,
      });
    }
  });
}

export const backupService = {
  exportBackup,
  readBackupFile,
  restoreBackup,
};
