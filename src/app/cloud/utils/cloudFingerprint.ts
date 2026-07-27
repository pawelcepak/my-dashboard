import type { ChbBackupFile } from '@/modules/settings/types/backup.types';

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const record = value as Record<string, unknown>;

  const entries = Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`);

  return `{${entries.join(',')}}`;
}

function createHash(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);

    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

function createComparableData(backup: ChbBackupFile) {
  return {
    workWeeks: [...backup.data.workWeeks].sort((firstWeek, secondWeek) =>
      firstWeek.startDate.localeCompare(secondWeek.startDate)
    ),
    appSettings: backup.data.appSettings
      .filter((setting) => setting.key !== 'lastBackupAt')
      .sort((firstSetting, secondSetting) => firstSetting.key.localeCompare(secondSetting.key)),
    portfolioAccounts: [...(backup.data.portfolioAccounts ?? [])].sort(
      (firstAccount, secondAccount) => firstAccount.id.localeCompare(secondAccount.id)
    ),
    portfolioTags: [...(backup.data.portfolioTags ?? [])].sort((firstTag, secondTag) =>
      firstTag.id.localeCompare(secondTag.id)
    ),
    portfolioTransactions: [...(backup.data.portfolioTransactions ?? [])].sort(
      (firstTransaction, secondTransaction) =>
        firstTransaction.id.localeCompare(secondTransaction.id)
    ),
  };
}

export function createCloudFingerprint(backup: ChbBackupFile): string {
  return createHash(stableStringify(createComparableData(backup)));
}
