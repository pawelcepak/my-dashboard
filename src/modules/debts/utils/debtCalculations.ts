import type {
  Debt,
  DebtEvent,
  DebtsSummary,
  DebtWithSummary,
} from '@/modules/debts/types/debt.types';

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrencyPln(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(value);
}

export function getDebtEvents(debtId: string, events: DebtEvent[]): DebtEvent[] {
  return events
    .filter((event) => event.debtId === debtId)
    .sort((first, second) =>
      first.date === second.date
        ? first.createdAt.localeCompare(second.createdAt)
        : first.date.localeCompare(second.date)
    );
}

export function getCurrentDebtBalance(debt: Debt, events: DebtEvent[]): number {
  const latestEvent = getDebtEvents(debt.id, events).at(-1);
  return roundMoney(latestEvent?.balanceAfter ?? debt.initialAmount);
}

export function calculateDebtSummary(debt: Debt, events: DebtEvent[]): DebtWithSummary {
  const debtEvents = getDebtEvents(debt.id, events);
  const currentBalance = roundMoney(debtEvents.at(-1)?.balanceAfter ?? debt.initialAmount);
  const totalPayments = roundMoney(
    debtEvents
      .filter((event) => event.type === 'payment')
      .reduce((sum, event) => sum + Math.abs(event.amount), 0)
  );
  const netReduction = roundMoney(debt.initialAmount - currentBalance);
  const progressPercent =
    debt.initialAmount <= 0
      ? currentBalance <= 0
        ? 100
        : 0
      : Math.max(0, Math.min(100, (netReduction / debt.initialAmount) * 100));

  return {
    ...debt,
    currentBalance,
    totalPayments,
    netReduction,
    progressPercent,
    eventCount: debtEvents.length,
  };
}

export function calculateDebtsSummary(debts: Debt[], events: DebtEvent[]): DebtsSummary {
  const rows = debts.map((debt) => calculateDebtSummary(debt, events));
  const initialTotal = roundMoney(rows.reduce((sum, debt) => sum + debt.initialAmount, 0));
  const currentTotal = roundMoney(rows.reduce((sum, debt) => sum + debt.currentBalance, 0));
  const totalPayments = roundMoney(rows.reduce((sum, debt) => sum + debt.totalPayments, 0));
  const netReduction = roundMoney(initialTotal - currentTotal);

  return {
    initialTotal,
    currentTotal,
    totalPayments,
    netReduction,
    progressPercent:
      initialTotal <= 0 ? 0 : Math.max(0, Math.min(100, (netReduction / initialTotal) * 100)),
    activeCount: rows.filter((debt) => debt.currentBalance > 0.005).length,
    paidCount: rows.filter((debt) => debt.currentBalance <= 0.005).length,
  };
}
