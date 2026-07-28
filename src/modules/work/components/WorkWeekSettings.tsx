import { CircleDollarSign, Trash2 } from 'lucide-react';

import CollapsiblePanel from '@/shared/components/CollapsiblePanel';

type WorkWeekSettingsProps = {
  exchangeRateEurPln: number;
  onExchangeRateChange: (value: number) => void;
  onReset: () => void;
};

const inputClasses =
  'h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

function parseNonNegativeNumber(value: string): number {
  const normalizedValue = value.replace(',', '.');
  const parsedValue = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

export default function WorkWeekSettings({
  exchangeRateEurPln,
  onExchangeRateChange,
  onReset,
}: WorkWeekSettingsProps) {
  return (
    <CollapsiblePanel
      storageKey="work-week-settings"
      title="Ustawienia tygodnia"
      description="Kurs waluty i operacje na aktywnym tygodniu"
      icon={<CircleDollarSign aria-hidden="true" className="size-4" />}
      summary={
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-600">EUR/PLN</p>
          <p className="mt-0.5 text-xs font-bold text-zinc-300">
            {exchangeRateEurPln.toFixed(2).replace('.', ',')}
          </p>
        </div>
      }
      defaultOpen={false}
    >
      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)]">
        <label className="rounded-xl border border-zinc-700 bg-zinc-950/35 p-3">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Kurs EUR/PLN</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={exchangeRateEurPln}
            onChange={(event) => onExchangeRateChange(parseNonNegativeNumber(event.target.value))}
            className={inputClasses}
          />

          <span className="mt-1.5 block text-[10px] leading-4 text-zinc-500">
            Zapisywany osobno dla każdego tygodnia.
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/35 px-3 py-2.5">
            <p className="text-xs font-medium text-zinc-400">Zatrzymane wiadomości</p>
            <p className="mt-1 text-[10px] leading-4 text-zinc-500">
              Są wpisywane przy dniach i sumowane automatycznie.
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-800 bg-red-950/30 px-4 text-xs font-medium text-red-300 transition hover:bg-red-950/50"
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
            Wyczyść tydzień
          </button>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
