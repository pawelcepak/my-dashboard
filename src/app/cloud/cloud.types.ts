export type CloudConnectionStatus =
  | 'checking'
  | 'cloud-empty'
  | 'local-newer'
  | 'cloud-newer'
  | 'conflict'
  | 'syncing'
  | 'synced'
  | 'offline'
  | 'error';

export type CloudSyncDirection = 'upload' | 'download' | null;

export type CloudComparisonState =
  'cloud-empty' | 'local-newer' | 'cloud-newer' | 'conflict' | 'synced';

export type CloudStatusDetails = {
  status: CloudConnectionStatus;
  syncDirection: CloudSyncDirection;
  lastCheckedAt: string | null;
  lastSyncedAt: string | null;
  cloudSnapshotAt: string | null;
  localDataAt: string | null;
  hasCloudSnapshot: boolean;
  deviceName: string;
  errorMessage: string | null;
};

export type CloudInspectionResult = {
  state: CloudComparisonState;
  hasCloudSnapshot: boolean;
  localFingerprint: string;
  cloudFingerprint: string | null;
  localDataAt: string | null;
  cloudSnapshotAt: string | null;
  lastSyncedAt: string | null;
  deviceName: string;
};
