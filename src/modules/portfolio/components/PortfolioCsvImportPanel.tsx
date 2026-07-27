import { Download, FileSpreadsheet, LoaderCircle, Upload } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

import {
  createPortfolioCsvTemplate,
  parsePortfolioCsv,
} from '@/modules/portfolio/services/portfolioCsvService';
import type {
  PortfolioCsvPreview,
  PortfolioCsvRow,
} from '@/modules/portfolio/types/portfolio.types';

type PortfolioCsvImportPanelProps = {
  isSaving: boolean;
  onImport: (
    rows: PortfolioCsvRow[]
  ) => Promise<{ importedTransactions: number; createdTags: number }>;
};

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export default function PortfolioCsvImportPanel({
  isSaving,
  onImport,
}: PortfolioCsvImportPanelProps) {
  const [preview, setPreview] = useState<PortfolioCsvPreview | null>(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState('');

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();

    setFileName(file.name);
    setPreview(parsePortfolioCsv(text));
    setResult('');
  }

  async function handleImport() {
    if (!preview || preview.rows.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Zaimportować ${preview.rows.length} transakcji z pliku ${fileName}?`
    );

    if (!confirmed) {
      return;
    }

    const importResult = await onImport(preview.rows);

    setResult(
      `Dodano ${importResult.importedTransactions} transakcji i ${importResult.createdTags} nowych tagów.`
    );
    setPreview(null);
    setFileName('');
  }

  return (
    <section className="app-panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-700 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Import CSV</h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Data, Rodzaj, Kwota, Tag i opcjonalna Notatka
          </p>
        </div>

        <FileSpreadsheet className="size-5 text-[var(--app-accent)]" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 text-xs font-semibold text-white">
            <Upload className="size-3.5" />
            Wybierz CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => {
                void handleFileChange(event);
              }}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              downloadTextFile('chb-portfolio-template.csv', createPortfolioCsvTemplate())
            }
            className="flex h-10 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-xs font-semibold text-zinc-300"
          >
            <Download className="size-3.5" />
            Pobierz szablon
          </button>
        </div>

        {preview && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3 text-xs">
            <p className="font-semibold text-zinc-300">
              {fileName}: {preview.rows.length} prawidłowych wierszy
            </p>

            {preview.errors.length > 0 && (
              <div className="mt-2 rounded-lg border border-red-900 bg-red-950/20 p-2 text-red-300">
                {preview.errors.slice(0, 8).map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={isSaving || preview.rows.length === 0 || preview.errors.length > 0}
              onClick={() => {
                void handleImport();
              }}
              className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] font-semibold text-[var(--app-accent)] disabled:opacity-50"
            >
              {isSaving ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              Importuj transakcje
            </button>
          </div>
        )}

        {result && (
          <p className="rounded-lg border border-emerald-800 bg-emerald-950/20 p-2 text-xs font-medium text-emerald-300">
            {result}
          </p>
        )}
      </div>
    </section>
  );
}
