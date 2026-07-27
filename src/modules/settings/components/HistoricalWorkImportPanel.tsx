import { AlertTriangle, CalendarRange, CheckCircle2, Database, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  historicalWorkImportService,
  type HistoricalWorkImportStatus,
} from '@/modules/settings/services/historicalWorkImportService';

function formatWeekNumbers(weekNumbers: number[]): string {
  if (weekNumbers.length === 0) {
    return 'Brak';
  }

  return weekNumbers.join(', ');
}

export default function HistoricalWorkImportPanel() {
  const [status, setStatus] = useState<HistoricalWorkImportStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function refreshStatus() {
    try {
      const nextStatus = await historicalWorkImportService.getStatus();

      setStatus(nextStatus);
      setError(null);
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : 'Nie udało się sprawdzić historii pracy.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshStatus();
  }, []);

  async function handleImport() {
    if (!status || status.importableWeeks === 0 || isImporting) {
      return;
    }

    const shouldImport = window.confirm(
      `Import doda brakujące tygodnie 8–29 roku 2026.\n\n` +
        `Do dodania: ${status.importableWeeks}.\n` +
        `Istniejące tygodnie nie zostaną zmienione.\n\n` +
        'Przed importem warto pobrać aktualną kopię JSON. Kontynuować?'
    );

    if (!shouldImport) {
      return;
    }

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await historicalWorkImportService.importMissingWeeks();

      setSuccess(
        result.importedWeekNumbers.length > 0
          ? `Dodano tygodnie: ${formatWeekNumbers(
              result.importedWeekNumbers
            )}. Pominięto istniejące: ${formatWeekNumbers(result.skippedWeekNumbers)}.`
          : 'Wszystkie tygodnie 8–29 były już zapisane.'
      );

      await refreshStatus();
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : 'Nie udało się zaimportować historii pracy.'
      );
    } finally {
      setIsImporting(false);
    }
  }

  const isComplete = status?.importableWeeks === 0;

  return (
    <section className="app-panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-5 py-4 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-zinc-100">Historia pracy 2026</h2>

            <span className="rounded-full border border-zinc-700 bg-zinc-950/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-500">
              Jednorazowy import
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Kontrolowane dodanie tygodni 8–29 bez nadpisywania tygodni zapisanych już w CHB.
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
          {isLoading || isImporting ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : isComplete ? (
            <CheckCircle2 aria-hidden="true" className="size-5" />
          ) : (
            <CalendarRange aria-hidden="true" className="size-5" />
          )}
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {error && (
          <div className="app-notice app-notice-error">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="app-notice app-notice-success">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="app-panel-muted p-4">
            <dt className="text-xs font-medium text-zinc-500">Zakres</dt>
            <dd className="mt-1 text-base font-bold text-zinc-100">2026-W08 – W29</dd>
          </div>

          <div className="app-panel-muted p-4">
            <dt className="text-xs font-medium text-zinc-500">Do dodania</dt>
            <dd className="mt-1 text-base font-bold text-zinc-100">
              {status?.importableWeeks ?? '—'}
            </dd>
          </div>

          <div className="app-panel-muted p-4">
            <dt className="text-xs font-medium text-zinc-500">Już istnieją</dt>
            <dd className="mt-1 truncate text-base font-bold text-zinc-100">
              {status ? formatWeekNumbers(status.existingWeekNumbers) : '—'}
            </dd>
          </div>
        </dl>

        <div className="app-notice app-notice-warning">
          <Database aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

          <div>
            <p className="font-bold">Historyczne bloki przechowują poprawny czas łączny</p>

            <p className="mt-1 font-medium">
              Zrzuty nie zawierały dokładnych godzin rozpoczęcia i zakończenia. Dlatego dodatni czas
              dnia jest zapisany jako jeden techniczny blok od 06:20. Przyszłe analizy konkretnych
              godzin powinny pomijać sesje oznaczone „duration-placeholder”.
            </p>
          </div>
        </div>

        <p className="text-xs leading-5 text-zinc-500">
          Wiadomości zapisano jako płatne. Zatrzymane i darmowe wiadomości mają wartość 0, ponieważ
          nie występowały osobno na źródłowych zestawieniach. Kurs historycznych tygodni ustawiono
          technicznie na 4,20 PLN/EUR i można go później zmienić osobno.
        </p>

        <button
          type="button"
          disabled={isLoading || isImporting || !status || status.importableWeeks === 0}
          onClick={() => {
            void handleImport();
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isImporting ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <CalendarRange aria-hidden="true" className="size-4" />
          )}

          {isImporting
            ? 'Importowanie historii…'
            : isComplete
              ? 'Historia 8–29 jest już kompletna'
              : `Dodaj ${status?.importableWeeks ?? 0} brakujących tygodni`}
        </button>
      </div>
    </section>
  );
}
