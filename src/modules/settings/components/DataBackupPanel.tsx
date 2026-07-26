import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileJson,
  LoaderCircle,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { database } from '@/database/database';
import { backupService } from '@/modules/settings/services/backupService';
import type { BackupPreview } from '@/modules/settings/types/backup.types';

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function DataBackupPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const databaseSummary = useLiveQuery(async () => {
    const [workWeekCount, lastBackupSetting] = await Promise.all([
      database.workWeeks.count(),
      database.appSettings.get('lastBackupAt'),
    ]);

    return {
      workWeekCount,
      lastBackupAt: lastBackupSetting?.value ?? null,
    };
  }, []);

  const [preview, setPreview] = useState<BackupPreview | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setError(null);
    setSuccess(null);

    try {
      const createdAt = await backupService.exportBackup();

      setSuccess(`Kopia została utworzona: ${formatDateTime(createdAt)}.`);
    } catch (exportError) {
      setError(
        exportError instanceof Error ? exportError.message : 'Nie udało się utworzyć kopii.'
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setPreview(null);
    setError(null);
    setSuccess(null);

    if (!file) {
      return;
    }

    setIsReadingFile(true);

    try {
      const nextPreview = await backupService.readBackupFile(file);

      setPreview(nextPreview);
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : 'Nie udało się odczytać pliku.');

      event.target.value = '';
    } finally {
      setIsReadingFile(false);
    }
  }

  async function handleRestore() {
    if (!preview) {
      return;
    }

    const shouldRestore = window.confirm(
      `Import zastąpi wszystkie obecne dane CHB.\n\nKopia zawiera ${preview.workWeekCount} tygodni.\n\nCzy na pewno kontynuować?`
    );

    if (!shouldRestore) {
      return;
    }

    setIsRestoring(true);
    setError(null);
    setSuccess(null);

    try {
      await backupService.restoreBackup(preview.backup);

      setSuccess(`Przywrócono ${preview.workWeekCount} tygodni z kopii.`);

      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (restoreError) {
      setError(
        restoreError instanceof Error ? restoreError.message : 'Nie udało się przywrócić kopii.'
      );
    } finally {
      setIsRestoring(false);
    }
  }

  const isBusy = isExporting || isReadingFile || isRestoring;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />

          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-800 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />

          <p>{success}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-400">
              <Download aria-hidden="true" className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-100">Eksport danych</h2>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Zapisz wszystkie tygodnie i ustawienia CHB w jednym pliku JSON.
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 rounded-xl border border-zinc-700 bg-zinc-950/50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Tygodnie w bazie</dt>

              <dd className="font-medium text-zinc-200">{databaseSummary?.workWeekCount ?? '—'}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Ostatni eksport</dt>

              <dd className="text-right font-medium text-zinc-200">
                {databaseSummary?.lastBackupAt
                  ? formatDateTime(databaseSummary.lastBackupAt)
                  : 'Brak'}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => {
              void handleExport();
            }}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Download aria-hidden="true" className="size-4" />
            )}

            {isExporting ? 'Tworzenie kopii…' : 'Pobierz kopię JSON'}
          </button>
        </section>

        <section className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-400">
              <Upload aria-hidden="true" className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-100">Import danych</h2>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Sprawdź kopię, a następnie zastąp nią obecną lokalną bazę.
              </p>
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-zinc-400">Plik kopii CHB</span>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              disabled={isBusy}
              onChange={(event) => {
                void handleFileChange(event);
              }}
              className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--app-accent-soft)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--app-accent)]"
            />
          </label>

          {isReadingFile && (
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Sprawdzanie kopii…
            </div>
          )}

          {preview && (
            <div className="mt-4 rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] p-4">
              <div className="flex items-center gap-2">
                <FileJson aria-hidden="true" className="size-4 text-[var(--app-accent)]" />

                <p className="text-sm font-semibold text-zinc-100">Kopia jest prawidłowa</p>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-zinc-500">Utworzono</dt>

                  <dd className="mt-1 font-medium text-zinc-200">
                    {formatDateTime(preview.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-500">Tygodnie</dt>

                  <dd className="mt-1 font-medium text-zinc-200">{preview.workWeekCount}</dd>
                </div>

                <div>
                  <dt className="text-zinc-500">Zakres</dt>

                  <dd className="mt-1 font-medium text-zinc-200">
                    {preview.firstWeekLabel}
                    {' – '}
                    {preview.lastWeekLabel}
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-500">Aktywny tydzień</dt>

                  <dd className="mt-1 font-medium text-zinc-200">
                    {preview.activeWeekLabel ?? 'Automatyczny'}
                  </dd>
                </div>

                <div className="col-span-2">
                  <dt className="text-zinc-500">Lata</dt>

                  <dd className="mt-1 font-medium text-zinc-200">{preview.years.join(', ')}</dd>
                </div>
              </dl>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  void handleRestore();
                }}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-700 bg-red-950/40 px-4 text-sm font-medium text-red-300 transition hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRestoring ? (
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Upload aria-hidden="true" className="size-4" />
                )}

                {isRestoring ? 'Przywracanie…' : 'Zastąp dane kopią'}
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="rounded-xl border border-amber-800 bg-amber-950/20 px-4 py-3 text-sm leading-6 text-amber-300">
        Import zastępuje wszystkie lokalne tygodnie i ustawienia zapisane w tej przeglądarce. Przed
        importem utwórz eksport obecnych danych.
      </div>
    </div>
  );
}
