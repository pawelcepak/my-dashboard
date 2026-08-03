import AppPreferencesPanel from '@/modules/settings/components/AppPreferencesPanel';
import DataBackupPanel from '@/modules/settings/components/DataBackupPanel';
import HistoricalWorkImportPanel from '@/modules/settings/components/HistoricalWorkImportPanel';
import NavigationPreferencesPanel from '@/modules/settings/components/NavigationPreferencesPanel';
import PageHeader from '@/shared/components/PageHeader';

const SETTINGS_SECTIONS = [
  { id: 'settings-app', label: 'Wygląd' },
  { id: 'settings-navigation', label: 'Nawigacja' },
  { id: 'settings-import', label: 'Import' },
  { id: 'settings-backup', label: 'Backup' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Ustawienia"
        sections={SETTINGS_SECTIONS}
      />
      <div id="settings-app" className="page-section-anchor">
        <AppPreferencesPanel />
      </div>
      <div id="settings-navigation" className="page-section-anchor">
        <NavigationPreferencesPanel />
      </div>
      <div id="settings-import" className="page-section-anchor">
        <HistoricalWorkImportPanel />
      </div>
      <div id="settings-backup" className="page-section-anchor">
        <DataBackupPanel />
      </div>
    </div>
  );
}
