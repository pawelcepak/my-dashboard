import DataBackupPanel from '@/modules/settings/components/DataBackupPanel';
import PageHeader from '@/shared/components/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ustawienia"
        description="Kopie bezpieczeństwa i zarządzanie lokalnymi danymi CHB."
      />

      <DataBackupPanel />
    </div>
  );
}
