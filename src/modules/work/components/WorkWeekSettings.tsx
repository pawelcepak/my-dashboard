import { MessageSquareMore, Trash2 } from 'lucide-react';

type WorkWeekSettingsProps = {
  heldMessages: number;
  exchangeRateEurPln: number;
  onHeldMessagesChange: (value: number) => void;
  onExchangeRateChange: (value: number) => void;
  onReset: () => void;
};

const inputClasses =
  'h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

function parseNonNegativeNumber(value: string): number {
  const normalizedValue = value.replace(',', '.');
  const parsedValue = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

export default function WorkWeekSettings({
  heldMessages,
  exchangeRateEurPln,
  onHeldMessagesChange,
  onExchangeRateChange,
  onReset,
}: WorkWeekSettingsProps) {
  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Ustawienia tygodnia</h2>

          <p className="mt-1 text-sm text-zinc-500">Parametry wpływające na obliczenie wypłaty</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-500">
          <MessageSquareMore aria-hidden="true" className="size-5" />
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <label>
          <span className="mb-2 block text-sm font-medium text-zinc-400">
            Zatrzymane wiadomości
          </span>

          <input
            type="number"
            min="0"
            step="1"
            value={heldMessages}
            onChange={(event) =>
              onHeldMessagesChange(Math.floor(parseNonNegativeNumber(event.target.value)))
            }
            className={inputClasses}
          />

          <span className="mt-2 block text-xs leading-5 text-zinc-500">
            Każda zatrzymana wiadomość jest liczona po 0,05 EUR.
          </span>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-zinc-400">Kurs EUR/PLN</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={exchangeRateEurPln}
            onChange={(event) => onExchangeRateChange(parseNonNegativeNumber(event.target.value))}
            className={inputClasses}
          />
        </label>

        <button
          type="button"
          onClick={onReset}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-800 bg-red-950/30 px-4 text-sm font-medium text-red-300 transition hover:bg-red-950/50"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Wyczyść dane aktywnego tygodnia
        </button>
      </div>
    </section>
  );
}
