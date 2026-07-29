import { database } from '@/database/database';
import type {
  AlcoholDayOverride,
  AlcoholMonthlyExpense,
  AlcoholSettings,
} from '@/modules/alcohol/types/alcohol.types';
import type { Debt, DebtEvent, DebtEventType, DebtStatus } from '@/modules/debts/types/debt.types';
import type {
  PortfolioAccount,
  PortfolioTag,
  PortfolioTagKind,
  PortfolioTransaction,
  PortfolioTransactionType,
} from '@/modules/portfolio/types/portfolio.types';
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

const SUPPORTED_SETTING_KEYS = new Set([
  'activeWorkWeekId',
  'lastBackupAt',
  'tableDensity',
  'accentTheme',
  'navigationOrder',
  'navigationTabColors',
  'debt-seed-v1',
]);

const GOAL_PRECISION_MULTIPLIER = 100;

function roundGoalValue(value: number): number {
  return Math.round(value * GOAL_PRECISION_MULTIPLIER) / GOAL_PRECISION_MULTIPLIER;
}

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

function parseNullableNonNegativeNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isFiniteNumber(value) || value < 0) {
    throw new Error('Cel zawiera nieprawidłową wartość liczbową.');
  }

  return value;
}

function parseNonNegativeInteger(value: unknown, fallbackValue = 0): number {
  if (value === undefined) {
    return fallbackValue;
  }

  if (!isFiniteNumber(value) || !Number.isInteger(value) || value < 0) {
    throw new Error('Dzień zawiera nieprawidłową wartość liczbową.');
  }

  return value;
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

function parseWorkDay(value: unknown): WorkDay {
  if (!isRecord(value)) {
    throw new Error('Tydzień zawiera nieprawidłowy rekord dnia.');
  }

  if (
    !isString(value.id) ||
    !isIsoDate(value.date) ||
    !isNullableNumber(value.workRating) ||
    !Array.isArray(value.sessions) ||
    !value.sessions.every(isWorkSession)
  ) {
    throw new Error(`Dzień ${String(value.date)} zawiera nieprawidłowe dane.`);
  }

  return {
    id: value.id,
    date: value.date,
    messages: parseNonNegativeInteger(value.messages),
    freeMessages: parseNonNegativeInteger(value.freeMessages),
    heldMessages: parseNonNegativeInteger(value.heldMessages),
    beers: parseNonNegativeInteger(value.beers),
    workRating: value.workRating,
    sessions: value.sessions,
  };
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

function parseWorkWeekGoals(value: unknown): WorkWeekGoals {
  if (!isRecord(value)) {
    throw new Error('Tydzień zawiera nieprawidłowe cele pracy.');
  }

  const storedDailyMessagesTarget = parseNullableNonNegativeNumber(value.dailyMessagesTarget);

  const storedWeekly7DaysTarget = parseNullableNonNegativeNumber(value.weeklyMessagesTarget);

  const storedWeekly5DaysTarget = parseNullableNonNegativeNumber(value.weeklyMessagesTarget5Days);

  const dailyHoursTarget = parseNullableNonNegativeNumber(value.dailyHoursTarget);

  if (storedDailyMessagesTarget !== null) {
    return {
      dailyMessagesTarget: roundGoalValue(storedDailyMessagesTarget),
      weeklyMessagesTarget:
        storedWeekly7DaysTarget ?? roundGoalValue(storedDailyMessagesTarget * 7),
      weeklyMessagesTarget5Days:
        storedWeekly5DaysTarget ?? roundGoalValue(storedDailyMessagesTarget * 5),
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
    !Array.isArray(value.days) ||
    value.days.length !== 7 ||
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
    goals: parseWorkWeekGoals(value.goals),
    days: value.days.map(parseWorkDay),
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

function isPortfolioTransactionType(value: unknown): value is PortfolioTransactionType {
  return value === 'income' || value === 'expense';
}

function isPortfolioTagKind(value: unknown): value is PortfolioTagKind {
  return value === 'income' || value === 'expense' || value === 'both';
}

function parsePortfolioAccount(value: unknown): PortfolioAccount {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isFiniteNumber(value.initialBalance) ||
    !isIsoDate(value.initialBalanceDate) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error('Kopia zawiera nieprawidłowy portfel.');
  }

  return {
    id: value.id,
    name: value.name,
    initialBalance: value.initialBalance,
    initialBalanceDate: value.initialBalanceDate,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parsePortfolioTag(value: unknown): PortfolioTag {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isPortfolioTagKind(value.kind) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error('Kopia zawiera nieprawidłowy tag portfela.');
  }

  return {
    id: value.id,
    name: value.name,
    kind: value.kind,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parsePortfolioTransaction(value: unknown): PortfolioTransaction {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.accountId) ||
    !isIsoDate(value.date) ||
    !isPortfolioTransactionType(value.type) ||
    !isFiniteNumber(value.amount) ||
    value.amount <= 0 ||
    !(value.tagId === null || isString(value.tagId)) ||
    !isString(value.note) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error('Kopia zawiera nieprawidłową transakcję portfela.');
  }

  return {
    id: value.id,
    accountId: value.accountId,
    date: value.date,
    type: value.type,
    amount: value.amount,
    tagId: value.tagId,
    note: value.note,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function validateUniqueIds(values: Array<{ id: string }>, label: string): void {
  const ids = new Set<string>();

  for (const value of values) {
    if (ids.has(value.id)) {
      throw new Error(`Kopia zawiera powtórzony identyfikator ${label}: ${value.id}.`);
    }

    ids.add(value.id);
  }
}

function isDebtStatus(value: unknown): value is DebtStatus {
  return value === 'active' || value === 'paid';
}
function isDebtEventType(value: unknown): value is DebtEventType {
  return value === 'payment' || value === 'balance-update';
}
function parseDebt(value: unknown): Debt {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isFiniteNumber(value.initialAmount) ||
    value.initialAmount <= 0 ||
    !isString(value.note) ||
    !isDebtStatus(value.status) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  )
    throw new Error('Kopia zawiera nieprawidłowy dług.');
  return value as Debt;
}
function parseDebtEvent(value: unknown): DebtEvent {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.debtId) ||
    !isIsoDate(value.date) ||
    !isDebtEventType(value.type) ||
    !isFiniteNumber(value.amount) ||
    !isFiniteNumber(value.balanceAfter) ||
    value.balanceAfter < 0 ||
    !isString(value.note) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  )
    throw new Error('Kopia zawiera nieprawidłowe zdarzenie długu.');
  return value as DebtEvent;
}

function parseAlcoholDayOverride(value: unknown): AlcoholDayOverride {
  if (
    !isRecord(value) ||
    !isIsoDate(value.date) ||
    (value.state !== 'drinking' && value.state !== 'sober') ||
    (value.source !== 'manual' && value.source !== 'historical-import') ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error('Kopia zawiera nieprawidłową korektę dnia alkoholu.');
  }

  return value as AlcoholDayOverride;
}

function parseAlcoholMonthlyExpense(value: unknown): AlcoholMonthlyExpense {
  if (
    !isRecord(value) ||
    !isString(value.month) ||
    !/^\d{4}-\d{2}$/.test(value.month) ||
    !isFiniteNumber(value.amount) ||
    value.amount < 0 ||
    value.source !== 'manual' ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error('Kopia zawiera nieprawidłowy miesięczny koszt alkoholu.');
  }

  return value as AlcoholMonthlyExpense;
}

function parseAlcoholSettings(value: unknown): AlcoholSettings {
  if (
    !isRecord(value) ||
    value.id !== 'alcohol-settings' ||
    !Array.isArray(value.expenseTagIds) ||
    !value.expenseTagIds.every(isString) ||
    !isString(value.portfolioExpenseStartMonth) ||
    !isIsoDateTime(value.createdAt) ||
    !isIsoDateTime(value.updatedAt)
  ) {
    throw new Error('Kopia zawiera nieprawidłowe ustawienia modułu Alkohol.');
  }

  return value as AlcoholSettings;
}

function validateBackup(value: unknown): ChbBackupFile {
  if (!isRecord(value)) {
    throw new Error('Plik nie zawiera prawidłowego obiektu JSON.');
  }

  if (value.format !== BACKUP_FORMAT_NAME) {
    throw new Error('To nie jest plik kopii zapasowej CHB.');
  }

  if (
    value.version !== 1 &&
    value.version !== 2 &&
    value.version !== 3 &&
    value.version !== BACKUP_FORMAT_VERSION
  ) {
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

  const normalizedPortfolioAccounts = Array.isArray(value.data.portfolioAccounts)
    ? value.data.portfolioAccounts.map(parsePortfolioAccount)
    : [];

  const normalizedPortfolioTags = Array.isArray(value.data.portfolioTags)
    ? value.data.portfolioTags.map(parsePortfolioTag)
    : [];

  const normalizedPortfolioTransactions = Array.isArray(value.data.portfolioTransactions)
    ? value.data.portfolioTransactions.map(parsePortfolioTransaction)
    : [];

  const normalizedAlcoholDayOverrides = Array.isArray(value.data.alcoholDayOverrides)
    ? value.data.alcoholDayOverrides.map(parseAlcoholDayOverride)
    : [];

  const normalizedAlcoholMonthlyExpenses = Array.isArray(value.data.alcoholMonthlyExpenses)
    ? value.data.alcoholMonthlyExpenses.map(parseAlcoholMonthlyExpense)
    : [];

  const normalizedAlcoholSettings = Array.isArray(value.data.alcoholSettings)
    ? value.data.alcoholSettings.map(parseAlcoholSettings)
    : [];

  const normalizedDebts = Array.isArray(value.data.debts) ? value.data.debts.map(parseDebt) : [];
  const normalizedDebtEvents = Array.isArray(value.data.debtEvents)
    ? value.data.debtEvents.map(parseDebtEvent)
    : [];

  const backup: ChbBackupFile = {
    format: BACKUP_FORMAT_NAME,
    version: BACKUP_FORMAT_VERSION,
    createdAt: value.createdAt,
    data: {
      workWeeks: normalizedWorkWeeks,
      appSettings: value.data.appSettings,
      portfolioAccounts: normalizedPortfolioAccounts,
      portfolioTags: normalizedPortfolioTags,
      portfolioTransactions: normalizedPortfolioTransactions,
      alcoholDayOverrides: normalizedAlcoholDayOverrides,
      alcoholMonthlyExpenses: normalizedAlcoholMonthlyExpenses,
      alcoholSettings: normalizedAlcoholSettings,
      debts: normalizedDebts,
      debtEvents: normalizedDebtEvents,
    },
  };

  validateUniqueWeeks(backup.data.workWeeks);

  validateUniqueSettings(backup.data.appSettings);
  validateUniqueIds(backup.data.portfolioAccounts, 'portfela');
  validateUniqueIds(backup.data.portfolioTags, 'tagu portfela');
  validateUniqueIds(backup.data.portfolioTransactions, 'transakcji portfela');
  validateUniqueIds(
    backup.data.alcoholDayOverrides.map((item) => ({ id: item.date })),
    'korekty dnia alkoholu'
  );
  validateUniqueIds(
    backup.data.alcoholMonthlyExpenses.map((item) => ({ id: item.month })),
    'miesięcznego kosztu alkoholu'
  );
  validateUniqueIds(backup.data.alcoholSettings, 'ustawień alkoholu');
  validateUniqueIds(backup.data.debts, 'długu');
  validateUniqueIds(backup.data.debtEvents, 'zdarzenia długu');

  const debtIds = new Set(backup.data.debts.map((debt) => debt.id));
  for (const event of backup.data.debtEvents) {
    if (!debtIds.has(event.debtId)) {
      throw new Error(`Zdarzenie długu ${event.id} wskazuje na nieistniejący dług.`);
    }
  }

  return backup;
}

export function normalizeBackup(value: unknown): ChbBackupFile {
  return validateBackup(value);
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

  const [
    workWeeks,
    appSettings,
    portfolioAccounts,
    portfolioTags,
    portfolioTransactions,
    alcoholDayOverrides,
    alcoholMonthlyExpenses,
    alcoholSettings,
    debts,
    debtEvents,
  ] = await Promise.all([
    database.workWeeks.orderBy('startDate').toArray(),
    database.appSettings.toArray(),
    database.portfolioAccounts.toArray(),
    database.portfolioTags.toArray(),
    database.portfolioTransactions.toArray(),
    database.alcoholDayOverrides.toArray(),
    database.alcoholMonthlyExpenses.toArray(),
    database.alcoholSettings.toArray(),
    database.debts.toArray(),
    database.debtEvents.toArray(),
  ]);

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
      portfolioAccounts,
      portfolioTags,
      portfolioTransactions,
      alcoholDayOverrides,
      alcoholMonthlyExpenses,
      alcoholSettings,
      debts,
      debtEvents,
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
    portfolioTransactionCount: backup.data.portfolioTransactions.length,
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

  await database.transaction(
    'rw',
    [
      database.workWeeks,
      database.appSettings,
      database.portfolioAccounts,
      database.portfolioTags,
      database.portfolioTransactions,
      database.alcoholDayOverrides,
      database.alcoholMonthlyExpenses,
      database.alcoholSettings,
      database.debts,
      database.debtEvents,
    ],
    async () => {
      await database.workWeeks.clear();
      await database.appSettings.clear();
      await database.portfolioAccounts.clear();
      await database.portfolioTags.clear();
      await database.portfolioTransactions.clear();
      await database.alcoholDayOverrides.clear();
      await database.alcoholMonthlyExpenses.clear();
      await database.alcoholSettings.clear();
      await database.debts.clear();
      await database.debtEvents.clear();

      await database.workWeeks.bulkPut(validatedBackup.data.workWeeks);

      if (validatedBackup.data.appSettings.length > 0) {
        await database.appSettings.bulkPut(validatedBackup.data.appSettings);
      }

      if (validatedBackup.data.portfolioAccounts.length > 0) {
        await database.portfolioAccounts.bulkPut(validatedBackup.data.portfolioAccounts);
      }

      if (validatedBackup.data.portfolioTags.length > 0) {
        await database.portfolioTags.bulkPut(validatedBackup.data.portfolioTags);
      }

      if (validatedBackup.data.portfolioTransactions.length > 0) {
        await database.portfolioTransactions.bulkPut(validatedBackup.data.portfolioTransactions);
      }

      if (validatedBackup.data.alcoholDayOverrides.length > 0) {
        await database.alcoholDayOverrides.bulkPut(validatedBackup.data.alcoholDayOverrides);
      }

      if (validatedBackup.data.alcoholMonthlyExpenses.length > 0) {
        await database.alcoholMonthlyExpenses.bulkPut(validatedBackup.data.alcoholMonthlyExpenses);
      }

      if (validatedBackup.data.alcoholSettings.length > 0) {
        await database.alcoholSettings.bulkPut(validatedBackup.data.alcoholSettings);
      }

      if (validatedBackup.data.debts.length > 0) {
        await database.debts.bulkPut(validatedBackup.data.debts);
      }

      if (validatedBackup.data.debtEvents.length > 0) {
        await database.debtEvents.bulkPut(validatedBackup.data.debtEvents);
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
    }
  );
}

export const backupService = {
  exportBackup,
  readBackupFile,
  restoreBackup,
  normalizeBackup,
};
