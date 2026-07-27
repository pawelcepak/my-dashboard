import type {
  PortfolioAccount,
  PortfolioLedgerRow,
  PortfolioSummary,
  PortfolioTransaction,
} from '@/modules/portfolio/types/portfolio.types';

export function formatCurrencyPln(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPortfolioDate(value: string): string {
  const [year, month, day] = value.split('-');

  return `${day}.${month}.${year}`;
}

export function getSignedTransactionAmount(transaction: PortfolioTransaction): number {
  return transaction.type === 'income' ? transaction.amount : -transaction.amount;
}

export function sortTransactionsChronologically(
  transactions: PortfolioTransaction[]
): PortfolioTransaction[] {
  return [...transactions].sort((first, second) => {
    const dateDifference = first.date.localeCompare(second.date);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    const createdDifference = first.createdAt.localeCompare(second.createdAt);

    if (createdDifference !== 0) {
      return createdDifference;
    }

    return first.id.localeCompare(second.id);
  });
}

export function createPortfolioLedger(
  account: PortfolioAccount,
  transactions: PortfolioTransaction[]
): PortfolioLedgerRow[] {
  let balance = account.initialBalance;

  return sortTransactionsChronologically(transactions).map((transaction) => {
    const signedAmount = getSignedTransactionAmount(transaction);

    balance += signedAmount;

    return {
      transaction,
      signedAmount,
      balanceAfter: Math.round(balance * 100) / 100,
    };
  });
}

function toLocalIsoDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getIsoWeekBounds(date: Date): {
  startDate: string;
  endDate: string;
} {
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const day = localDate.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(localDate);
  monday.setDate(localDate.getDate() - daysSinceMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: toLocalIsoDate(monday),
    endDate: toLocalIsoDate(sunday),
  };
}

export function calculatePortfolioSummary(
  account: PortfolioAccount,
  transactions: PortfolioTransaction[],
  now = new Date()
): PortfolioSummary {
  const ledger = createPortfolioLedger(account, transactions);

  const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income');

  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

  const totalIncome = incomeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const totalExpenses = expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const { startDate, endDate } = getIsoWeekBounds(now);
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentWeekTransactions = transactions.filter(
    (transaction) => transaction.date >= startDate && transaction.date <= endDate
  );

  const currentMonthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(monthPrefix)
  );

  const currentWeekIncome = currentWeekTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentWeekExpenses = currentWeekTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentMonthIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentMonthExpenses = currentMonthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenseDates = new Set(
    currentMonthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .map((transaction) => transaction.date)
  );

  return {
    currentBalance: ledger.at(-1)?.balanceAfter ?? account.initialBalance,
    totalIncome,
    totalExpenses,
    netFlow: totalIncome - totalExpenses,
    currentWeekIncome,
    currentWeekExpenses,
    currentMonthIncome,
    currentMonthExpenses,
    averageDailyExpense: expenseDates.size > 0 ? currentMonthExpenses / expenseDates.size : 0,
  };
}
