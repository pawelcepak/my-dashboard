export type PortfolioTransactionType = 'income' | 'expense';

export type PortfolioTagKind = PortfolioTransactionType | 'both';

export type PortfolioAccount = {
  id: string;
  name: string;
  initialBalance: number;
  initialBalanceDate: string;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioTag = {
  id: string;
  name: string;
  kind: PortfolioTagKind;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioTransaction = {
  id: string;
  accountId: string;
  date: string;
  type: PortfolioTransactionType;
  amount: number;
  tagId: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioTransactionInput = {
  date: string;
  type: PortfolioTransactionType;
  amount: number;
  tagId: string | null;
  note: string;
};

export type PortfolioTagInput = {
  name: string;
  kind: PortfolioTagKind;
};

export type PortfolioLedgerRow = {
  transaction: PortfolioTransaction;
  signedAmount: number;
  balanceAfter: number;
};

export type PortfolioSummary = {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  currentWeekIncome: number;
  currentWeekExpenses: number;
  currentMonthIncome: number;
  currentMonthExpenses: number;
  averageDailyExpense: number;
};

export type PortfolioCsvRow = {
  rowNumber: number;
  date: string;
  type: PortfolioTransactionType;
  amount: number;
  tagName: string;
  note: string;
};

export type PortfolioCsvPreview = {
  rows: PortfolioCsvRow[];
  errors: string[];
};
