import { Clock3 } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import MessagesPerHourIndicator from '@/modules/work/components/MessagesPerHourIndicator';
import type { WorkDay } from '@/modules/work/types/work.types';
import {
  formatHours,
  formatNumber,
  formatShortIsoDate,
  getDayMessagesPerHour,
  getDayWorkedHours,
} from '@/modules/work/utils/workCalculations';
import { formatWorkRating, getWorkRatingPresentation } from '@/modules/work/utils/workPresentation';

type EditableField = 'beers' | 'workRating' | 'heldMessages' | 'messages';

type WorkDaysTableProps = {
  days: WorkDay[];
  isSaving: boolean;
  onUpdateDay: (updatedDay: WorkDay) => void;
  onEditSessions: (dayId: string) => void;
};

type EditableNumberCellProps = {
  value: number | null;
  field: EditableField;
  day: WorkDay;
  align?: 'center' | 'right';
  valueClassName?: string;
  displayValue?: string;
  minimum?: number;
  maximum?: number;
  step?: number;
  onCommit: (updatedDay: WorkDay) => void;
};

function parseNonNegativeInteger(value: string): number {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function parseWorkRating(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsedValue = Number.parseFloat(value.replace(',', '.'));

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return Math.round(Math.min(10, Math.max(0, parsedValue)) * 10) / 10;
}

function getWeekendDateClass(date: string): string {
  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

  if (dayOfWeek === 0) {
    return 'text-red-400';
  }

  if (dayOfWeek === 6) {
    return 'text-zinc-500';
  }

  return 'text-zinc-200';
}

function EditableNumberCell({
  value,
  field,
  day,
  align = 'right',
  valueClassName = 'text-zinc-200',
  displayValue,
  minimum = 0,
  maximum,
  step = 1,
  onCommit,
}: EditableNumberCellProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [draftValue, setDraftValue] = useState(value === null ? '' : String(value));

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value === null ? '' : String(value));
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function cancelEditing() {
    setDraftValue(value === null ? '' : String(value));
    setIsEditing(false);
  }

  function commitEditing() {
    const nextValue =
      field === 'workRating' ? parseWorkRating(draftValue) : parseNonNegativeInteger(draftValue);

    if (nextValue !== value) {
      onCommit({
        ...day,
        [field]: nextValue,
      });
    }

    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEditing();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        inputMode={step < 1 ? 'decimal' : 'numeric'}
        min={minimum}
        max={maximum}
        step={step}
        value={draftValue}
        onChange={(event) => setDraftValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitEditing}
        className={`h-7 w-full min-w-0 border-0 border-b border-[var(--app-accent)] bg-transparent px-1 text-xs font-bold text-zinc-100 outline-none ${
          align === 'center' ? 'text-center' : 'text-right'
        }`}
      />
    );
  }

  return (
    <button
      type="button"
      title="Kliknij, aby edytować"
      onClick={() => setIsEditing(true)}
      className={`min-h-7 w-full rounded px-1 text-xs font-bold transition hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-accent)] ${
        align === 'center' ? 'text-center' : 'text-right'
      } ${valueClassName}`}
    >
      {displayValue ?? (value === null ? '—' : formatNumber(value))}
    </button>
  );
}

export default function WorkDaysTable({
  days,
  isSaving,
  onUpdateDay,
  onEditSessions,
}: WorkDaysTableProps) {
  const reversedDays = [...days].reverse();

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Historia aktywnego tygodnia</h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Kliknij wartość, wpisz nową liczbę i zatwierdź Enterem.
          </p>
        </div>

        <span
          className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${
            isSaving ? 'text-amber-400' : 'text-zinc-600'
          }`}
        >
          {isSaving ? 'Zapisywanie…' : 'Enter zapisuje'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[670px] table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-950/30 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">
              <th className="w-[5.25rem] px-3 py-2.5 font-bold">Data</th>

              <th className="w-[4rem] px-1.5 py-2.5 text-center font-bold">Piwa</th>

              <th className="w-[4.5rem] px-1.5 py-2.5 text-center font-bold">Ocena</th>

              <th className="w-[6.5rem] px-1.5 py-2.5 text-right font-bold">Zatrzymane</th>

              <th className="w-[5.5rem] px-1.5 py-2.5 text-right font-bold">Płatne</th>

              <th className="w-[5.75rem] px-1.5 py-2.5 text-right font-bold">Godziny</th>

              <th className="w-[6.75rem] px-3 py-2.5 text-right font-bold">Średnia/h</th>
            </tr>
          </thead>

          <tbody>
            {reversedDays.map((day) => {
              const workedHours = getDayWorkedHours(day);

              const messagesPerHour = workedHours > 0 ? getDayMessagesPerHour(day) : null;

              const ratingPresentation = getWorkRatingPresentation(day.workRating);

              return (
                <tr
                  key={day.id}
                  className="border-b border-zinc-700/70 transition last:border-b-0 hover:bg-zinc-950/35"
                >
                  <td
                    className={`whitespace-nowrap px-3 py-2 text-xs font-bold ${getWeekendDateClass(
                      day.date
                    )}`}
                  >
                    {formatShortIsoDate(day.date)}
                  </td>

                  <td className="px-1.5 py-1.5">
                    <EditableNumberCell
                      day={day}
                      field="beers"
                      value={day.beers}
                      align="center"
                      valueClassName={day.beers === 0 ? 'text-emerald-400' : 'text-red-400'}
                      onCommit={onUpdateDay}
                    />
                  </td>

                  <td className="px-1.5 py-1.5">
                    <EditableNumberCell
                      day={day}
                      field="workRating"
                      value={day.workRating}
                      align="center"
                      maximum={10}
                      step={0.1}
                      displayValue={formatWorkRating(day.workRating)}
                      valueClassName={
                        day.workRating === null
                          ? 'text-zinc-500'
                          : (ratingPresentation.className
                              .split(' ')
                              .find((className) => className.startsWith('text-')) ??
                            'text-zinc-200')
                      }
                      onCommit={onUpdateDay}
                    />
                  </td>

                  <td className="px-1.5 py-1.5">
                    <EditableNumberCell
                      day={day}
                      field="heldMessages"
                      value={day.heldMessages}
                      valueClassName="text-cyan-300"
                      onCommit={onUpdateDay}
                    />
                  </td>

                  <td className="px-1.5 py-1.5">
                    <EditableNumberCell
                      day={day}
                      field="messages"
                      value={day.messages}
                      valueClassName="text-[var(--app-accent)]"
                      onCommit={onUpdateDay}
                    />
                  </td>

                  <td className="px-1.5 py-1.5">
                    <button
                      type="button"
                      title="Edytuj bloki czasu"
                      onClick={() => onEditSessions(day.id)}
                      className="flex min-h-7 w-full items-center justify-end gap-1.5 rounded px-1 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800/80 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-accent)]"
                    >
                      <Clock3 aria-hidden="true" className="size-3.5 text-zinc-500" />

                      {workedHours > 0 ? formatHours(workedHours) : '—'}
                    </button>
                  </td>

                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <MessagesPerHourIndicator
                      value={messagesPerHour}
                      compact
                      className="justify-end text-xs"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
