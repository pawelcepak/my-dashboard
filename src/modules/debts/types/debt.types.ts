export type DebtStatus = 'active' | 'paid';

export type Debt = {
  id: string;
  name: string;
  initialAmount: number;
  note: string;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
};

export type DebtEventType = 'payment' | 'balance-update';

export type DebtEvent = {
  id: string;
  debtId: string;
  date: string;
  type: DebtEventType;
  amount: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type DebtInput = {
  name: string;
  initialAmount: number;
  note: string;
};

export type DebtPaymentInput = {
  debtId: string;
  date: string;
  amount: number;
  note: string;
};

export type DebtBalanceUpdateInput = {
  debtId: string;
  date: string;
  currentBalance: number;
  note: string;
};

export type DebtWithSummary = Debt & {
  currentBalance: number;
  totalPayments: number;
  netReduction: number;
  progressPercent: number;
  eventCount: number;
};

export type DebtsSummary = {
  initialTotal: number;
  currentTotal: number;
  totalPayments: number;
  netReduction: number;
  progressPercent: number;
  activeCount: number;
  paidCount: number;
};
