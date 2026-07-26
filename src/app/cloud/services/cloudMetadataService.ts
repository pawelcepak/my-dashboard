import type { CloudSyncDirection } from '@/app/cloud/cloud.types';

export type CloudSyncMetadata = {
  lastSyncedAt: string;
  lastSyncedFingerprint: string;
  lastCloudSnapshotAt: string;
  lastSyncDirection: Exclude<CloudSyncDirection, null>;
  deviceName: string;
};

const STORAGE_KEY_PREFIX = 'chb-cloud-sync-metadata';

function createStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export function getCurrentDeviceName(): string {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('windows')) {
    return 'Komputer Windows';
  }

  if (userAgent.includes('linux')) {
    return 'Laptop Linux';
  }

  if (userAgent.includes('android') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'Urządzenie mobilne';
  }

  return 'Przeglądarka CHB';
}

function isCloudSyncMetadata(value: unknown): value is CloudSyncMetadata {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.lastSyncedAt === 'string' &&
    typeof record.lastSyncedFingerprint === 'string' &&
    typeof record.lastCloudSnapshotAt === 'string' &&
    (record.lastSyncDirection === 'upload' || record.lastSyncDirection === 'download') &&
    typeof record.deviceName === 'string'
  );
}

function getMetadata(userId: string): CloudSyncMetadata | null {
  const storedValue = window.localStorage.getItem(createStorageKey(userId));

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return isCloudSyncMetadata(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function saveMetadata(userId: string, metadata: CloudSyncMetadata): void {
  window.localStorage.setItem(createStorageKey(userId), JSON.stringify(metadata));
}

function clearMetadata(userId: string): void {
  window.localStorage.removeItem(createStorageKey(userId));
}

export const cloudMetadataService = {
  getMetadata,
  saveMetadata,
  clearMetadata,
  getCurrentDeviceName,
};
