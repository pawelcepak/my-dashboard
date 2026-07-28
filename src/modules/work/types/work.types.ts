import type { AppPreferenceKey } from '@/modules/settings/types/appSettings.types';

export type WorkSession = {
  id: string;
  startTime: string;
  endTime: string;
};

export type WorkDay = {
  id: string;
  date: string;

  /*
   * Płatne wiadomości, których stawka zależy od tygodniowego progu.
   *
   * Zachowujemy nazwę `messages` dla zgodności z dotychczasowymi danymi,
   * obliczeniami, backupami i komponentami.
   */
  messages: number;

  /*
   * Darmowe wiadomości rozliczane według osobnej, stałej stawki.
   */
  freeMessages: number;

  /*
   * Zatrzymane wiadomości przypisane do konkretnego dnia.
   *
   * Pole tygodniowe WorkWeek.heldMessages pozostaje tymczasowo zachowane
   * dla zgodności ze starszymi danymi i obecnym interfejsem.
   */
  heldMessages: number;

  beers: number;
  workRating: number | null;
  sessions: WorkSession[];
};

export type FinancialPlanItem = {
  id: string;
  name: string;
  plannedAmountPln: number;

  /*
   * Mniejsza liczba oznacza wyższy priorytet.
   */
  priority: number;

  /*
   * Zablokowany cel nie może zostać przesunięty ani usunięty.
   */
  locked: boolean;
};

export type WorkWeekGoals = {
  /*
   * Bazowy cel wiadomości na jeden dzień.
   */
  dailyMessagesTarget: number | null;

  /*
   * Cel tygodniowy liczony dla siedmiu dni.
   *
   * Zachowujemy dotychczasową nazwę pola ze względu na zgodność
   * istniejących komponentów, danych i wcześniejszych backupów.
   */
  weeklyMessagesTarget: number | null;

  /*
   * Cel tygodniowy liczony dla pięciu dni.
   */
  weeklyMessagesTarget5Days: number | null;

  /*
   * Niezależny, ręcznie ustawiany cel godzin pracy dziennie.
   */
  dailyHoursTarget: number | null;
};

export type WorkWeek = {
  id: string;
  year: number;
  weekNumber: number;
  startDate: string;
  endDate: string;

  /*
   * Starsza tygodniowa wartość zatrzymanych wiadomości.
   *
   * Pozostaje zachowana podczas przejścia na dane dzienne. Jej usunięcie
   * będzie możliwe dopiero po pełnej migracji interfejsu, obliczeń,
   * historii i backupów.
   */
  heldMessages: number;

  exchangeRateEurPln: number;
  goals: WorkWeekGoals;
  days: WorkDay[];
  financialPlan: FinancialPlanItem[];
  createdAt: string;
  updatedAt: string;
};

export type WorkWeekCreateOptions = {
  year: number;
  weekNumber: number;
  copySettingsFromWeekId: string | null;
};

export type AppSettingKey = 'activeWorkWeekId' | 'lastBackupAt' | AppPreferenceKey;

export type AppSetting = {
  key: AppSettingKey;
  value: string;
  updatedAt: string;
};

export type MessageRateTier = {
  minimumMessages: number;
  maximumMessages: number | null;
  rateEur: number;
};

export type PayoutFeeTier = {
  minimumAmountEur: number;
  maximumAmountEur: number | null;
  feeEur: number;
};

export type WorkWeekSummary = {
  totalMessages: number;
  totalHeldMessages: number;
  totalMinutes: number;
  totalHours: number;
  averageMessagesPerHour: number;
  messagesDividedByForty: number;
  messageRateEur: number;
  regularMessagesEarningsEur: number;
  heldMessagesEarningsEur: number;
  grossEarningsEur: number;
  payoutFeeEur: number;
  netEarningsEur: number;
  netEarningsPln: number;
  financialPlanTotalPln: number;
  financialPlanBalancePln: number;
};

export type WorkTimeCategory = 'standard' | 'additional' | 'weekend';

export type WorkTimeSegment = {
  date: string;
  category: WorkTimeCategory;
  minutes: number;
};

export type WorkDayTimeAnalytics = {
  date: string;
  standardMinutes: number;
  additionalMinutes: number;
  weekendMinutes: number;
  standardHoursScore: number | null;
};

export type WorkTimeAnalytics = {
  days: WorkDayTimeAnalytics[];
  totalStandardMinutes: number;
  totalAdditionalMinutes: number;
  totalWeekendMinutes: number;
  averageStandardHoursScore: number | null;
  ratedDayCount: number;
  scoreFiveDayCount: number;
  scoreSixDayCount: number;
  bestDay: (WorkDayTimeAnalytics & { standardHoursScore: number }) | null;
};

export type WorkProgress = {
  currentThreshold: number;
  nextThreshold: number | null;
  messagesMissing: number;
  remainingDays: number;
  requiredMessagesPerDay: number;
  status: 'red' | 'yellow' | 'light-green' | 'green';
};
