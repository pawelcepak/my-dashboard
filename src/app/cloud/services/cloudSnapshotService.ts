import { database } from '@/database/database';
import { supabase } from '@/lib/supabase';
import { backupService } from '@/modules/settings/services/backupService';
import {
  BACKUP_FORMAT_NAME,
  BACKUP_FORMAT_VERSION,
  type ChbBackupFile,
} from '@/modules/settings/types/backup.types';

export type CloudSnapshotRow = {
  snapshot: ChbBackupFile;
  createdAt: string;
  updatedAt: string;
};

export type CloudSnapshotMetadata = {
  exists: boolean;
  updatedAt: string | null;
};

export type CloudUploadResult = {
  syncedAt: string;
};

export type CloudDownloadResult = {
  syncedAt: string;
  workWeekCount: number;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Wystąpił nieznany błąd chmury.';
}

export async function createLocalSnapshot(): Promise<ChbBackupFile> {
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
    throw new Error('Lokalna baza nie zawiera żadnego tygodnia pracy.');
  }

  return {
    format: BACKUP_FORMAT_NAME,
    version: BACKUP_FORMAT_VERSION,
    createdAt: new Date().toISOString(),
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
}

async function getSnapshotMetadata(userId: string): Promise<CloudSnapshotMetadata> {
  const { data, error } = await supabase
    .from('cloud_snapshots')
    .select('updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Nie udało się sprawdzić snapshotu: ${error.message}`);
  }

  if (!data) {
    return {
      exists: false,
      updatedAt: null,
    };
  }

  return {
    exists: true,
    updatedAt: data.updated_at,
  };
}

async function getCloudSnapshot(userId: string): Promise<CloudSnapshotRow | null> {
  const { data, error } = await supabase
    .from('cloud_snapshots')
    .select('snapshot, created_at, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Nie udało się pobrać danych: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const snapshot = backupService.normalizeBackup(data.snapshot);

  return {
    snapshot,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

async function uploadLocalSnapshot(
  userId: string,
  suppliedSnapshot?: ChbBackupFile
): Promise<CloudUploadResult> {
  const snapshot = suppliedSnapshot ?? (await createLocalSnapshot());

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('cloud_snapshots')
    .upsert(
      {
        user_id: userId,
        snapshot,
        updated_at: timestamp,
      },
      {
        onConflict: 'user_id',
      }
    )
    .select('updated_at')
    .single();

  if (error) {
    throw new Error(`Nie udało się wysłać danych: ${error.message}`);
  }

  if (!data?.updated_at) {
    throw new Error('Chmura nie zwróciła czasu zapisu snapshotu.');
  }

  return {
    syncedAt: data.updated_at,
  };
}

async function downloadCloudSnapshot(
  userId: string,
  suppliedCloudRow?: CloudSnapshotRow
): Promise<CloudDownloadResult> {
  const cloudRow = suppliedCloudRow ?? (await getCloudSnapshot(userId));

  if (!cloudRow) {
    throw new Error('W chmurze nie ma jeszcze żadnego snapshotu.');
  }

  try {
    await backupService.restoreBackup(cloudRow.snapshot);
  } catch (error) {
    throw new Error(`Snapshot nie został przywrócony: ${getErrorMessage(error)}`);
  }

  return {
    syncedAt: cloudRow.updatedAt,
    workWeekCount: cloudRow.snapshot.data.workWeeks.length,
  };
}

export const cloudSnapshotService = {
  createLocalSnapshot,
  getSnapshotMetadata,
  getCloudSnapshot,
  uploadLocalSnapshot,
  downloadCloudSnapshot,
};
