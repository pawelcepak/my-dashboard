import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

import type { AlcoholDayStatus } from '@/modules/alcohol/types/alcohol.types';
import { getMonthLabel } from '@/modules/alcohol/utils/alcoholCalculations';

type AlcoholCalendarProps = {
  month: string;
  statuses: Map<string, AlcoholDayStatus>;
  isSaving: boolean;
  onMonthChange: (month: string) => void;
  onToggleDay: (date: string, automaticDrinking: boolean) => Promise<void>;
  onClearOverride: (date: string) => Promise<void>;
};

function shiftMonth(month: string, offset: number): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const next = new Date(year, monthNumber - 1 + offset, 1);

  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
}

export default function AlcoholCalendar({
  month,
  statuses,
  isSaving,
  onMonthChange,
  onToggleDay,
  onClearOverride,
}: AlcoholCalendarProps) {
  const [year, monthNumber] = month.split('-').map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1);
  const dayCount = new Date(year, monthNumber, 0).getDate();
  const mondayOffset = (firstDay.getDay() + 6) % 7;

  const cells = [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <section className="app-panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-700 px-4 py-3">
        <button
          type="button"
          onClick={() => onMonthChange(shiftMonth(month, -1))}
          className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-400"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-semibold capitalize text-zinc-100">{getMonthLabel(month)}</h2>
          <p className="mt-0.5 text-[10px] text-zinc-500">
            Kliknięcie zmienia stan dnia. Work pozostaje źródłem AUTO.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onMonthChange(shiftMonth(month, 1))}
          className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-400"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
          {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-16" />;
            }

            const date = `${month}-${String(day).padStart(2, '0')}`;
            const status = statuses.get(date);
            const automaticDrinking = status?.automaticDrinking ?? false;
            const drinking = status?.drinking ?? false;
            const overrideState = status?.overrideState ?? null;

            return (
              <div
                key={date}
                className={`relative min-h-16 rounded-lg border p-1.5 transition ${
                  drinking ? 'border-red-700 bg-red-950/35' : 'border-zinc-700 bg-zinc-950/35'
                }`}
              >
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    void onToggleDay(date, automaticDrinking);
                  }}
                  className="flex h-full w-full flex-col items-start text-left disabled:opacity-50"
                >
                  <span
                    className={`text-xs font-bold ${drinking ? 'text-red-300' : 'text-zinc-400'}`}
                  >
                    {day}
                  </span>

                  <span className="mt-auto text-[9px] font-semibold text-zinc-600">
                    {status?.beers ? `${status.beers} piw` : overrideState ? 'ręcznie' : '—'}
                  </span>
                </button>

                {overrideState && (
                  <button
                    type="button"
                    title="Przywróć stan automatyczny z Work"
                    disabled={isSaving}
                    onClick={(event) => {
                      event.stopPropagation();
                      void onClearOverride(date);
                    }}
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-500"
                  >
                    <RotateCcw className="size-2.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
