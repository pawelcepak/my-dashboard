import type {
  MessageRateTier,
  PayoutFeeTier,
  WorkDay,
  WorkProgress,
  WorkSession,
  WorkWeek,
  WorkWeekSummary,
} from '@/modules/work/types/work.types';

export const HELD_MESSAGE_RATE_EUR = 0.05;

export const MESSAGE_RATE_TIERS: MessageRateTier[] = [
  {
    minimumMessages: 0,
    maximumMessages: 775,
    rateEur: 0.07,
  },
  {
    minimumMessages: 776,
    maximumMessages: 1575,
    rateEur: 0.08,
  },
  {
    minimumMessages: 1576,
    maximumMessages: 1975,
    rateEur: 0.09,
  },
  {
    minimumMessages: 1976,
    maximumMessages: null,
    rateEur: 0.1,
  },
];

export const PAYOUT_FEE_TIERS: PayoutFeeTier[] = [
  {
    minimumAmountEur: 0,
    maximumAmountEur: 249.99,
    feeEur: 5,
  },
  {
    minimumAmountEur: 250,
    maximumAmountEur: 499.99,
    feeEur: 7.5,
  },
  {
    minimumAmountEur: 500,
    maximumAmountEur: 599.99,
    feeEur: 10,
  },
  {
    minimumAmountEur: 600,
    maximumAmountEur: 999.99,
    feeEur: 12.5,
  },
  {
    minimumAmountEur: 1000,
    maximumAmountEur: null,
    feeEur: 15,
  },
];

const MESSAGE_THRESHOLDS = [0, 776, 1576, 1976];

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

export function getSessionMinutes(session: WorkSession): number {
  const startMinutes = parseTimeToMinutes(session.startTime);
  let endMinutes = parseTimeToMinutes(session.endTime);

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

export function getDayWorkedMinutes(day: WorkDay): number {
  return day.sessions.reduce((total, session) => total + getSessionMinutes(session), 0);
}

export function getDayWorkedHours(day: WorkDay): number {
  return getDayWorkedMinutes(day) / 60;
}

export function getDayMessagesPerHour(day: WorkDay): number {
  const hours = getDayWorkedHours(day);

  if (hours === 0) {
    return 0;
  }

  return day.messages / hours;
}

export function getMessageRate(totalMessages: number): number {
  const tier = MESSAGE_RATE_TIERS.find(({ minimumMessages, maximumMessages }) => {
    const meetsMinimum = totalMessages >= minimumMessages;
    const meetsMaximum = maximumMessages === null || totalMessages <= maximumMessages;

    return meetsMinimum && meetsMaximum;
  });

  return tier?.rateEur ?? MESSAGE_RATE_TIERS[0].rateEur;
}

export function getPayoutFee(grossAmountEur: number): number {
  const tier = PAYOUT_FEE_TIERS.find(({ minimumAmountEur, maximumAmountEur }) => {
    const meetsMinimum = grossAmountEur >= minimumAmountEur;
    const meetsMaximum = maximumAmountEur === null || grossAmountEur <= maximumAmountEur;

    return meetsMinimum && meetsMaximum;
  });

  return tier?.feeEur ?? 0;
}

export function calculateWorkWeekSummary(week: WorkWeek): WorkWeekSummary {
  const totalMessages = week.days.reduce((total, day) => total + day.messages, 0);

  const totalMinutes = week.days.reduce((total, day) => total + getDayWorkedMinutes(day), 0);

  const totalHours = totalMinutes / 60;

  const averageMessagesPerHour = totalHours > 0 ? totalMessages / totalHours : 0;

  const messageRateEur = getMessageRate(totalMessages);

  const regularMessagesEarningsEur = totalMessages * messageRateEur;

  const heldMessagesEarningsEur = week.heldMessages * HELD_MESSAGE_RATE_EUR;

  const grossEarningsEur = regularMessagesEarningsEur + heldMessagesEarningsEur;

  const payoutFeeEur = getPayoutFee(grossEarningsEur);

  const netEarningsEur = Math.max(0, grossEarningsEur - payoutFeeEur);

  const netEarningsPln = netEarningsEur * week.exchangeRateEurPln;

  const financialPlanTotalPln = week.financialPlan.reduce(
    (total, item) => total + item.plannedAmountPln,
    0
  );

  return {
    totalMessages,
    totalHeldMessages: week.heldMessages,
    totalMinutes,
    totalHours,
    averageMessagesPerHour,
    messagesDividedByForty: totalMessages / 40,
    messageRateEur,
    regularMessagesEarningsEur,
    heldMessagesEarningsEur,
    grossEarningsEur,
    payoutFeeEur,
    netEarningsEur,
    netEarningsPln,
    financialPlanTotalPln,
    financialPlanBalancePln: netEarningsPln - financialPlanTotalPln,
  };
}

export function calculateWorkProgress(week: WorkWeek, totalMessages: number): WorkProgress {
  let status: WorkProgress['status'] = 'red';

  if (totalMessages >= 1976) {
    status = 'green';
  } else if (totalMessages >= 1576) {
    status = 'light-green';
  } else if (totalMessages >= 776) {
    status = 'yellow';
  }

  const currentThreshold =
    [...MESSAGE_THRESHOLDS].reverse().find((threshold) => totalMessages >= threshold) ?? 0;

  const nextThreshold = MESSAGE_THRESHOLDS.find((threshold) => threshold > totalMessages) ?? null;

  const completedDays = week.days.filter(
    (day) => day.messages > 0 || day.sessions.length > 0
  ).length;

  const remainingDays = Math.max(0, week.days.length - completedDays);

  const messagesMissing = nextThreshold === null ? 0 : Math.max(0, nextThreshold - totalMessages);

  const requiredMessagesPerDay =
    remainingDays > 0 ? Math.ceil(messagesMissing / remainingDays) : messagesMissing;

  return {
    currentThreshold,
    nextThreshold,
    messagesMissing,
    remainingDays,
    requiredMessagesPerDay,
    status,
  };
}

export function formatHours(hours: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(hours);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDecimal(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrencyEur(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyPln(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatIsoDate(date: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function formatShortIsoDate(date: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${date}T00:00:00`));
}
