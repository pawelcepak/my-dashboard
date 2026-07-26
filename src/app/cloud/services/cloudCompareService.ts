import type { CloudInspectionResult } from '@/app/cloud/cloud.types';
import { cloudMetadataService } from '@/app/cloud/services/cloudMetadataService';
import { cloudSnapshotService } from '@/app/cloud/services/cloudSnapshotService';
import { createCloudFingerprint } from '@/app/cloud/utils/cloudFingerprint';
import type { ChbBackupFile } from '@/modules/settings/types/backup.types';

function getLatestTimestamp(values: Array<string | null | undefined>): string | null {
  const validValues = values.filter(
    (value): value is string => typeof value === 'string' && !Number.isNaN(Date.parse(value))
  );

  if (validValues.length === 0) {
    return null;
  }

  return validValues.sort((first, second) => second.localeCompare(first))[0];
}

function getLocalDataTimestamp(backup: ChbBackupFile): string | null {
  const weekTimestamps = backup.data.workWeeks.map((week) => week.updatedAt);

  const settingTimestamps = backup.data.appSettings
    .filter((setting) => setting.key !== 'lastBackupAt')
    .map((setting) => setting.updatedAt);

  return getLatestTimestamp([...weekTimestamps, ...settingTimestamps]);
}

async function inspect(userId: string): Promise<CloudInspectionResult> {
  const localSnapshot = await cloudSnapshotService.createLocalSnapshot();

  const localFingerprint = createCloudFingerprint(localSnapshot);

  const localDataAt = getLocalDataTimestamp(localSnapshot);

  const cloudRow = await cloudSnapshotService.getCloudSnapshot(userId);

  const storedMetadata = cloudMetadataService.getMetadata(userId);

  const deviceName = cloudMetadataService.getCurrentDeviceName();

  if (!cloudRow) {
    return {
      state: 'cloud-empty',
      hasCloudSnapshot: false,
      localFingerprint,
      cloudFingerprint: null,
      localDataAt,
      cloudSnapshotAt: null,
      lastSyncedAt: storedMetadata?.lastSyncedAt ?? null,
      deviceName,
    };
  }

  const cloudFingerprint = createCloudFingerprint(cloudRow.snapshot);

  if (localFingerprint === cloudFingerprint) {
    return {
      state: 'synced',
      hasCloudSnapshot: true,
      localFingerprint,
      cloudFingerprint,
      localDataAt,
      cloudSnapshotAt: cloudRow.updatedAt,
      lastSyncedAt: storedMetadata?.lastSyncedAt ?? cloudRow.updatedAt,
      deviceName,
    };
  }

  const baselineFingerprint = storedMetadata?.lastSyncedFingerprint;

  if (!baselineFingerprint) {
    return {
      state: 'conflict',
      hasCloudSnapshot: true,
      localFingerprint,
      cloudFingerprint,
      localDataAt,
      cloudSnapshotAt: cloudRow.updatedAt,
      lastSyncedAt: null,
      deviceName,
    };
  }

  const localChanged = localFingerprint !== baselineFingerprint;

  const cloudChanged = cloudFingerprint !== baselineFingerprint;

  if (localChanged && !cloudChanged) {
    return {
      state: 'local-newer',
      hasCloudSnapshot: true,
      localFingerprint,
      cloudFingerprint,
      localDataAt,
      cloudSnapshotAt: cloudRow.updatedAt,
      lastSyncedAt: storedMetadata.lastSyncedAt,
      deviceName,
    };
  }

  if (!localChanged && cloudChanged) {
    return {
      state: 'cloud-newer',
      hasCloudSnapshot: true,
      localFingerprint,
      cloudFingerprint,
      localDataAt,
      cloudSnapshotAt: cloudRow.updatedAt,
      lastSyncedAt: storedMetadata.lastSyncedAt,
      deviceName,
    };
  }

  return {
    state: 'conflict',
    hasCloudSnapshot: true,
    localFingerprint,
    cloudFingerprint,
    localDataAt,
    cloudSnapshotAt: cloudRow.updatedAt,
    lastSyncedAt: storedMetadata.lastSyncedAt,
    deviceName,
  };
}

export const cloudCompareService = {
  inspect,
};
