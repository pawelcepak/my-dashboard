import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import type {
  Debt,
  DebtBalanceUpdateInput,
  DebtEvent,
  DebtInput,
  DebtPaymentInput,
} from '@/modules/debts/types/debt.types';
import { getCurrentDebtBalance, roundMoney } from '@/modules/debts/utils/debtCalculations';

const INITIAL_DEBTS: Array<Pick<Debt, 'id' | 'name' | 'initialAmount' | 'note'>> = [
  {
    id: 'debt-komornik',
    name: 'Komornik',
    initialAmount: 14844.26,
    note: 'Obsługa płatności przez platformę eKruk.',
  },
  { id: 'debt-zus', name: 'ZUS', initialAmount: 2068.36, note: '' },
  { id: 'debt-orange', name: 'Orange', initialAmount: 1021.36, note: '' },
  { id: 'debt-vectra-gliwice', name: 'Vectra Gliwice', initialAmount: 569.38, note: '' },
  { id: 'debt-best', name: 'Best', initialAmount: 1838.08, note: '' },
];

function validateDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Podaj prawidłową datę w formacie RRRR-MM-DD.');
  }
  return value;
}

function validateName(value: string): string {
  const name = value.trim();
  if (!name) throw new Error('Nazwa długu nie może być pusta.');
  if (name.length > 80) throw new Error('Nazwa długu może mieć maksymalnie 80 znaków.');
  return name;
}

function validateNonNegativeMoney(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} musi być prawidłową kwotą.`);
  return roundMoney(value);
}

function validatePositiveMoney(value: number, label: string): number {
  const amount = validateNonNegativeMoney(value, label);
  if (amount <= 0) throw new Error(`${label} musi być większa od zera.`);
  return amount;
}

let initializationPromise: Promise<void> | null = null;

async function initializeInternal(): Promise<void> {
  await database.transaction('rw', database.debts, database.debtEvents, async () => {
    const timestamp = new Date().toISOString();
    const existingDebtIds = new Set(await database.debts.toCollection().primaryKeys());

    const missingDebts: Debt[] = INITIAL_DEBTS.filter((debt) => !existingDebtIds.has(debt.id)).map(
      (debt) => ({
        ...debt,
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    if (missingDebts.length > 0) {
      await database.debts.bulkAdd(missingDebts);
    }

    const seedEvents: DebtEvent[] = [
      {
        id: 'debt-event-komornik-2026-07-09',
        debtId: 'debt-komornik',
        date: '2026-07-09',
        type: 'payment',
        amount: -200,
        balanceAfter: 14644.26,
        note: 'Historyczna spłata z arkusza Minusy (eKruk).',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: 'debt-event-vectra-2026-07-24',
        debtId: 'debt-vectra-gliwice',
        date: '2026-07-24',
        type: 'payment',
        amount: -21.42,
        balanceAfter: 547.96,
        note: 'Historyczna spłata z arkusza Minusy.',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    const existingEventIds = new Set(await database.debtEvents.toCollection().primaryKeys());
    const missingEvents = seedEvents.filter((event) => !existingEventIds.has(event.id));

    if (missingEvents.length > 0) {
      await database.debtEvents.bulkAdd(missingEvents);
    }
  });
}

async function initialize(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeInternal().catch((error: unknown) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

async function createDebt(input: DebtInput): Promise<Debt> {
  const timestamp = new Date().toISOString();
  const debt: Debt = {
    id: crypto.randomUUID(),
    name: validateName(input.name),
    initialAmount: validatePositiveMoney(input.initialAmount, 'Kwota początkowa'),
    note: input.note.trim(),
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await database.debts.add(debt);
  cloudDirtyTracker.markDirty();
  return debt;
}

async function updateDebt(debtId: string, input: DebtInput): Promise<void> {
  const debt = await database.debts.get(debtId);
  if (!debt) throw new Error('Nie znaleziono długu do edycji.');
  const events = await database.debtEvents.where('debtId').equals(debtId).toArray();
  const currentBalance = getCurrentDebtBalance(debt, events);
  const initialAmount = validatePositiveMoney(input.initialAmount, 'Kwota początkowa');
  if (events.length > 0 && initialAmount < currentBalance) {
    throw new Error(
      'Kwota początkowa nie może być mniejsza od aktualnego salda po zapisanych zdarzeniach.'
    );
  }
  await database.debts.put({
    ...debt,
    name: validateName(input.name),
    initialAmount,
    note: input.note.trim(),
    updatedAt: new Date().toISOString(),
  });
  cloudDirtyTracker.markDirty();
}

async function addPayment(input: DebtPaymentInput): Promise<DebtEvent> {
  const debt = await database.debts.get(input.debtId);
  if (!debt) throw new Error('Nie znaleziono wybranego długu.');
  const events = await database.debtEvents.where('debtId').equals(debt.id).toArray();
  const currentBalance = getCurrentDebtBalance(debt, events);
  const amount = validatePositiveMoney(input.amount, 'Kwota spłaty');
  const timestamp = new Date().toISOString();
  const event: DebtEvent = {
    id: crypto.randomUUID(),
    debtId: debt.id,
    date: validateDate(input.date),
    type: 'payment',
    amount: -amount,
    balanceAfter: Math.max(0, roundMoney(currentBalance - amount)),
    note: input.note.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await database.transaction('rw', database.debtEvents, database.debts, async () => {
    await database.debtEvents.add(event);
    await database.debts.update(debt.id, {
      status: event.balanceAfter <= 0.005 ? 'paid' : 'active',
      updatedAt: timestamp,
    });
  });
  cloudDirtyTracker.markDirty();
  return event;
}

async function updateBalance(input: DebtBalanceUpdateInput): Promise<DebtEvent> {
  const debt = await database.debts.get(input.debtId);
  if (!debt) throw new Error('Nie znaleziono wybranego długu.');
  const events = await database.debtEvents.where('debtId').equals(debt.id).toArray();
  const currentBalance = getCurrentDebtBalance(debt, events);
  const newBalance = validateNonNegativeMoney(input.currentBalance, 'Aktualne saldo');
  const difference = roundMoney(newBalance - currentBalance);
  if (Math.abs(difference) < 0.005) throw new Error('Nowe saldo jest takie samo jak obecne.');
  const timestamp = new Date().toISOString();
  const event: DebtEvent = {
    id: crypto.randomUUID(),
    debtId: debt.id,
    date: validateDate(input.date),
    type: 'balance-update',
    amount: difference,
    balanceAfter: newBalance,
    note: input.note.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await database.transaction('rw', database.debtEvents, database.debts, async () => {
    await database.debtEvents.add(event);
    await database.debts.update(debt.id, {
      status: newBalance <= 0.005 ? 'paid' : 'active',
      updatedAt: timestamp,
    });
  });
  cloudDirtyTracker.markDirty();
  return event;
}

async function deleteEvent(eventId: string): Promise<void> {
  const event = await database.debtEvents.get(eventId);
  if (!event) return;
  await database.debtEvents.delete(eventId);
  const debt = await database.debts.get(event.debtId);
  if (debt) {
    const events = await database.debtEvents.where('debtId').equals(debt.id).toArray();
    const balance = getCurrentDebtBalance(debt, events);
    await database.debts.update(debt.id, {
      status: balance <= 0.005 ? 'paid' : 'active',
      updatedAt: new Date().toISOString(),
    });
  }
  cloudDirtyTracker.markDirty();
}

async function deleteDebt(debtId: string): Promise<void> {
  await database.transaction('rw', database.debts, database.debtEvents, async () => {
    await database.debtEvents.where('debtId').equals(debtId).delete();
    await database.debts.delete(debtId);
  });
  cloudDirtyTracker.markDirty();
}

export const debtService = {
  initialize,
  createDebt,
  updateDebt,
  addPayment,
  updateBalance,
  deleteEvent,
  deleteDebt,
};
