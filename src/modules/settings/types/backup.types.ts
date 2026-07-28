import type {
  AlcoholDayOverride,
  AlcoholMonthlyExpense,
  AlcoholSettings,
} from '@/modules/alcohol/types/alcohol.types';
import type {
  PortfolioAccount,
  PortfolioTag,
  PortfolioTransaction,
} from '@/modules/portfolio/types/portfolio.types';
import type { AppSetting, WorkWeek } from '@/modules/work/types/work.types';

export const BACKUP_FORMAT_NAME = 'chb-backup';
export const BACKUP_FORMAT_VERSION = 3;

export type ChbBackupFile = {
  format: typeof BACKUP_FORMAT_NAME;
  version: typeof BACKUP_FORMAT_VERSION;
  createdAt: string;
  data: {
    workWeeks: WorkWeek[];
    appSettings: AppSetting[];
    portfolioAccounts: PortfolioAccount[];
    portfolioTags: PortfolioTag[];
    portfolioTransactions: PortfolioTransaction[];
    alcoholDayOverrides: AlcoholDayOverride[];
    alcoholMonthlyExpenses: AlcoholMonthlyExpense[];
    alcoholSettings: AlcoholSettings[];
  };
};

export type BackupPreview = {
  backup: ChbBackupFile;
  createdAt: string;
  workWeekCount: number;
  portfolioTransactionCount: number;
  years: number[];
  firstWeekLabel: string;
  lastWeekLabel: string;
  activeWeekLabel: string | null;
};
