import { cloudCompareService } from '@/app/cloud/services/cloudCompareService';
import { cloudDirtyTracker } from '@/app/cloud/services/cloudDirtyTracker';
import { cloudMetadataService } from '@/app/cloud/services/cloudMetadataService';
import { cloudSnapshotService } from '@/app/cloud/services/cloudSnapshotService';
import type { CloudInspectionResult } from '@/app/cloud/cloud.types';
import { createCloudFingerprint } from '@/app/cloud/utils/cloudFingerprint';

export type AutomaticSyncAction = 'none' | 'upload' | 'download' | 'conflict';

export type AutomaticSyncResult = {
  action: AutomaticSyncAction;
  inspection: CloudInspectionResult;
};

async function inspect(userId: string): Promise<CloudInspectionResult> {
  return cloudCompareService.inspect(userId);
}

async function upload(userId: string): Promise<CloudInspectionResult> {
  const dirtyStateBeforeUpload = cloudDirtyTracker.getState();

  const localSnapshot = await cloudSnapshotService.createLocalSnapshot();

  const localFingerprint = createCloudFingerprint(localSnapshot);

  const uploadResult = await cloudSnapshotService.uploadLocalSnapshot(userId, localSnapshot);

  cloudMetadataService.saveMetadata(userId, {
    lastSyncedAt: uploadResult.syncedAt,
    lastSyncedFingerprint: localFingerprint,
    lastCloudSnapshotAt: uploadResult.syncedAt,
    lastSyncDirection: 'upload',
    deviceName: cloudMetadataService.getCurrentDeviceName(),
  });

  cloudDirtyTracker.clearDirtyIfRevision(dirtyStateBeforeUpload.revision);

  return cloudCompareService.inspect(userId);
}

async function download(userId: string): Promise<CloudInspectionResult> {
  const cloudRow = await cloudSnapshotService.getCloudSnapshot(userId);

  if (!cloudRow) {
    throw new Error('W chmurze nie ma jeszcze żadnego snapshotu.');
  }

  await cloudSnapshotService.downloadCloudSnapshot(userId, cloudRow);

  const restoredLocalSnapshot = await cloudSnapshotService.createLocalSnapshot();

  const restoredFingerprint = createCloudFingerprint(restoredLocalSnapshot);

  cloudMetadataService.saveMetadata(userId, {
    lastSyncedAt: cloudRow.updatedAt,
    lastSyncedFingerprint: restoredFingerprint,
    lastCloudSnapshotAt: cloudRow.updatedAt,
    lastSyncDirection: 'download',
    deviceName: cloudMetadataService.getCurrentDeviceName(),
  });

  cloudDirtyTracker.clearDirty();

  return cloudCompareService.inspect(userId);
}

async function synchronizeAutomatically(userId: string): Promise<AutomaticSyncResult> {
  const inspection = await inspect(userId);

  switch (inspection.state) {
    case 'synced':
      return {
        action: 'none',
        inspection,
      };

    case 'cloud-empty':
    case 'local-newer':
      return {
        action: 'upload',
        inspection: await upload(userId),
      };

    case 'cloud-newer':
      return {
        action: 'download',
        inspection: await download(userId),
      };

    case 'conflict':
      return {
        action: 'conflict',
        inspection,
      };
  }
}

export const cloudSyncService = {
  inspect,
  upload,
  download,
  synchronizeAutomatically,
};
