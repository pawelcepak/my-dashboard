import AppPreferencesPanel from '@/modules/settings/components/AppPreferencesPanel';
import DataBackupPanel from '@/modules/settings/components/DataBackupPanel';
import HistoricalWorkImportPanel from '@/modules/settings/components/HistoricalWorkImportPanel';
import PageHeader from '@/shared/components/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ustawienia"
        description="Preferencje aplikacji, kopie bezpieczeństwa i zarządzanie lokalnymi danymi CHB."
      />

      <AppPreferencesPanel />

      <HistoricalWorkImportPanel />

      <DataBackupPanel />
    </div>
  );
}
