import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { database } from '@/database/database';
import type {
  PortfolioAccount,
  PortfolioTag,
  PortfolioCsvRow,
  PortfolioTagInput,
  PortfolioTransaction,
  PortfolioTransactionInput,
} from '@/modules/portfolio/types/portfolio.types';

export const DEFAULT_PORTFOLIO_ACCOUNT_ID = 'portfolio-primary';

const DEFAULT_TAGS: Array<Pick<PortfolioTag, 'id' | 'name' | 'kind'>> = [
  {
    id: 'portfolio-tag-entertalkpro',
    name: 'EnterTalkPro',
    kind: 'income',
  },
  {
    id: 'portfolio-tag-browary',
    name: 'browary',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-na-zycie',
    name: 'na życie',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-rozrywka',
    name: 'rozrywka',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-bez-zlej-rozrywki',
    name: 'b. zła rozrywka',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-jedzenie',
    name: 'jedzenie',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-transport',
    name: 'transport',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-medycyna',
    name: 'medycyna',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-przedmioty',
    name: 'przedmioty',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-zobowiazania',
    name: 'zobowiązania',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-ai',
    name: 'AI',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-orange',
    name: 'orange',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-plenti',
    name: 'plenti',
    kind: 'expense',
  },
  {
    id: 'portfolio-tag-bankomat',
    name: 'bankomat',
    kind: 'expense',
  },
];

function normalizeMoney(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('Kwota musi być prawidłową liczbą.');
  }

  return Math.round(value * 100) / 100;
}

function validatePositiveAmount(value: number): number {
  const normalizedValue = normalizeMoney(value);

  if (normalizedValue <= 0) {
    throw new Error('Kwota transakcji musi być większa od zera.');
  }

  return normalizedValue;
}

function validateDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Transakcja zawiera nieprawidłową datę.');
  }

  return value;
}

function normalizeTagName(value: string): string {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new Error('Nazwa tagu nie może być pusta.');
  }

  if (normalizedValue.length > 40) {
    throw new Error('Nazwa tagu może mieć maksymalnie 40 znaków.');
  }

  return normalizedValue;
}

async function initialize(): Promise<void> {
  const timestamp = new Date().toISOString();

  await database.transaction('rw', database.portfolioAccounts, database.portfolioTags, async () => {
    const account = await database.portfolioAccounts.get(DEFAULT_PORTFOLIO_ACCOUNT_ID);

    if (!account) {
      const defaultAccount: PortfolioAccount = {
        id: DEFAULT_PORTFOLIO_ACCOUNT_ID,
        name: 'Główny portfel',
        initialBalance: 315.71,
        initialBalanceDate: '2026-05-07',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await database.portfolioAccounts.add(defaultAccount);
    }

    const tagCount = await database.portfolioTags.count();

    if (tagCount === 0) {
      const tags: PortfolioTag[] = DEFAULT_TAGS.map((tag) => ({
        ...tag,
        createdAt: timestamp,
        updatedAt: timestamp,
      }));

      await database.portfolioTags.bulkAdd(tags);
    }
  });
}

async function createTransaction(input: PortfolioTransactionInput): Promise<PortfolioTransaction> {
  const timestamp = new Date().toISOString();

  const transaction: PortfolioTransaction = {
    id: crypto.randomUUID(),
    accountId: DEFAULT_PORTFOLIO_ACCOUNT_ID,
    date: validateDate(input.date),
    type: input.type,
    amount: validatePositiveAmount(input.amount),
    tagId: input.tagId,
    note: input.note.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await database.portfolioTransactions.add(transaction);
  cloudDirtyTracker.markDirty();

  return transaction;
}

async function updateTransaction(
  transactionId: string,
  input: PortfolioTransactionInput
): Promise<void> {
  const existingTransaction = await database.portfolioTransactions.get(transactionId);

  if (!existingTransaction) {
    throw new Error('Nie znaleziono transakcji do edycji.');
  }

  await database.portfolioTransactions.put({
    ...existingTransaction,
    date: validateDate(input.date),
    type: input.type,
    amount: validatePositiveAmount(input.amount),
    tagId: input.tagId,
    note: input.note.trim(),
    updatedAt: new Date().toISOString(),
  });

  cloudDirtyTracker.markDirty();
}

async function deleteTransaction(transactionId: string): Promise<void> {
  await database.portfolioTransactions.delete(transactionId);
  cloudDirtyTracker.markDirty();
}

async function createTag(input: PortfolioTagInput): Promise<PortfolioTag> {
  const name = normalizeTagName(input.name);

  const existingTags = await database.portfolioTags.toArray();

  if (
    existingTags.some(
      (tag) => tag.name.toLocaleLowerCase('pl-PL') === name.toLocaleLowerCase('pl-PL')
    )
  ) {
    throw new Error('Tag o tej nazwie już istnieje.');
  }

  const timestamp = new Date().toISOString();

  const tag: PortfolioTag = {
    id: crypto.randomUUID(),
    name,
    kind: input.kind,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await database.portfolioTags.add(tag);
  cloudDirtyTracker.markDirty();

  return tag;
}

async function updateTag(tagId: string, input: PortfolioTagInput): Promise<void> {
  const existingTag = await database.portfolioTags.get(tagId);

  if (!existingTag) {
    throw new Error('Nie znaleziono tagu do edycji.');
  }

  const name = normalizeTagName(input.name);

  const tags = await database.portfolioTags.toArray();

  if (
    tags.some(
      (tag) =>
        tag.id !== tagId && tag.name.toLocaleLowerCase('pl-PL') === name.toLocaleLowerCase('pl-PL')
    )
  ) {
    throw new Error('Tag o tej nazwie już istnieje.');
  }

  await database.portfolioTags.put({
    ...existingTag,
    name,
    kind: input.kind,
    updatedAt: new Date().toISOString(),
  });

  cloudDirtyTracker.markDirty();
}

async function deleteTag(tagId: string): Promise<void> {
  await database.transaction(
    'rw',
    database.portfolioTags,
    database.portfolioTransactions,
    async () => {
      const relatedTransactions = await database.portfolioTransactions
        .where('tagId')
        .equals(tagId)
        .toArray();

      if (relatedTransactions.length > 0) {
        await database.portfolioTransactions.bulkPut(
          relatedTransactions.map((transaction) => ({
            ...transaction,
            tagId: null,
            updatedAt: new Date().toISOString(),
          }))
        );
      }

      await database.portfolioTags.delete(tagId);
    }
  );

  cloudDirtyTracker.markDirty();
}

async function updateAccount(initialBalance: number, initialBalanceDate: string): Promise<void> {
  const account = await database.portfolioAccounts.get(DEFAULT_PORTFOLIO_ACCOUNT_ID);

  if (!account) {
    throw new Error('Nie znaleziono głównego portfela.');
  }

  await database.portfolioAccounts.put({
    ...account,
    initialBalance: normalizeMoney(initialBalance),
    initialBalanceDate: validateDate(initialBalanceDate),
    updatedAt: new Date().toISOString(),
  });

  cloudDirtyTracker.markDirty();
}

async function importCsvRows(
  rows: PortfolioCsvRow[]
): Promise<{ importedTransactions: number; createdTags: number }> {
  if (rows.length === 0) {
    throw new Error('Brak prawidłowych wierszy do importu.');
  }

  const timestamp = new Date().toISOString();

  const result = await database.transaction(
    'rw',
    database.portfolioTags,
    database.portfolioTransactions,
    async () => {
      const existingTags = await database.portfolioTags.toArray();
      const tagsByNormalizedName = new Map(
        existingTags.map((tag) => [tag.name.toLocaleLowerCase('pl-PL'), tag])
      );

      const createdTags: PortfolioTag[] = [];
      const transactions: PortfolioTransaction[] = [];

      for (const row of rows) {
        let tagId: string | null = null;

        if (row.tagName) {
          const normalizedName = row.tagName.toLocaleLowerCase('pl-PL');
          let tag = tagsByNormalizedName.get(normalizedName);

          if (!tag) {
            tag = {
              id: crypto.randomUUID(),
              name: normalizeTagName(row.tagName),
              kind: row.type,
              createdAt: timestamp,
              updatedAt: timestamp,
            };

            tagsByNormalizedName.set(normalizedName, tag);
            createdTags.push(tag);
          } else if (tag.kind !== row.type && tag.kind !== 'both') {
            tag = {
              ...tag,
              kind: 'both',
              updatedAt: timestamp,
            };

            tagsByNormalizedName.set(normalizedName, tag);
          }

          tagId = tag.id;
        }

        transactions.push({
          id: crypto.randomUUID(),
          accountId: DEFAULT_PORTFOLIO_ACCOUNT_ID,
          date: validateDate(row.date),
          type: row.type,
          amount: validatePositiveAmount(row.amount),
          tagId,
          note: row.note.trim(),
          createdAt: `${timestamp}-${String(row.rowNumber).padStart(4, '0')}`,
          updatedAt: timestamp,
        });
      }

      const changedExistingTags = [...tagsByNormalizedName.values()].filter((tag) =>
        existingTags.some(
          (existingTag) => existingTag.id === tag.id && existingTag.kind !== tag.kind
        )
      );

      if (createdTags.length > 0) {
        await database.portfolioTags.bulkAdd(createdTags);
      }

      if (changedExistingTags.length > 0) {
        await database.portfolioTags.bulkPut(changedExistingTags);
      }

      await database.portfolioTransactions.bulkAdd(transactions);

      return {
        importedTransactions: transactions.length,
        createdTags: createdTags.length,
      };
    }
  );

  cloudDirtyTracker.markDirty();

  return result;
}

export const portfolioService = {
  initialize,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createTag,
  updateTag,
  deleteTag,
  updateAccount,
  importCsvRows,
};
