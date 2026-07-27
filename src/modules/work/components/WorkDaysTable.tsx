import { Clock3 } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

import type { TableDensity } from '@/modules/settings/types/appSettings.types';
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
  tableDensity: TableDensity;
  onUpdateDay: (updatedDay: WorkDay) => void;
  onEditSessions: (dayId: string) => void;
};

type CellPosition = {
  rowIndex: number;
  columnIndex: number;
};

type NavigationDirection = 'next' | 'previous' | 'up' | 'down' | 'left' | 'right';

type EditableNumberCellProps = {
  value: number | null;
  field: EditableField;
  day: WorkDay;
  position: CellPosition;
  isEditing: boolean;
  align?: 'center' | 'right';
  valueClassName?: string;
  displayValue?: string;
  minimum?: number;
  maximum?: number;
  step?: number;
  onStartEditing: (position: CellPosition) => void;
  onCancelEditing: () => void;
  onCommit: (updatedDay: WorkDay, position: CellPosition, direction?: NavigationDirection) => void;
  onNavigate: (position: CellPosition, direction: NavigationDirection) => void;
};

const EDITABLE_COLUMNS = 4;

const TABLE_DENSITY_CLASSES: Record<TableDensity, string> = {
  standard: 'work-table-density-standard',
  compact: 'work-table-density-compact',
  'very-compact': 'work-table-density-very-compact',
};

function createCellId(position: CellPosition): string {
  return `work-cell-${position.rowIndex}-${position.columnIndex}`;
}

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
  position,
  isEditing,
  align = 'right',
  valueClassName = 'text-zinc-200',
  displayValue,
  minimum = 0,
  maximum,
  step = 1,
  onStartEditing,
  onCancelEditing,
  onCommit,
  onNavigate,
}: EditableNumberCellProps) {
  const [draftValue, setDraftValue] = useState(value === null ? '' : String(value));

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value === null ? '' : String(value));
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  function getUpdatedDay(): WorkDay {
    const nextValue =
      field === 'workRating' ? parseWorkRating(draftValue) : parseNonNegativeInteger(draftValue);

    if (nextValue === value) {
      return day;
    }

    return {
      ...day,
      [field]: nextValue,
    };
  }

  function commitEditing(direction?: NavigationDirection) {
    onCommit(getUpdatedDay(), position, direction);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEditing('down');
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      commitEditing(event.shiftKey ? 'previous' : 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      commitEditing('up');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      commitEditing('down');
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      commitEditing('left');
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      commitEditing('right');
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDraftValue(value === null ? '' : String(value));
      onCancelEditing();
    }
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onStartEditing(position);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      onNavigate(position, event.shiftKey ? 'previous' : 'next');
      return;
    }

    const directionByKey: Partial<Record<string, NavigationDirection>> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };

    const direction = directionByKey[event.key];

    if (direction) {
      event.preventDefault();
      onNavigate(position, direction);
    }
  }

  if (isEditing) {
    const inputWidth = Math.max(3, draftValue.length + 1);

    const inputStyle: CSSProperties = {
      width: `${inputWidth}ch`,
    };

    return (
      <input
        ref={inputRef}
        id={createCellId(position)}
        data-work-cell="true"
        data-row-index={position.rowIndex}
        data-column-index={position.columnIndex}
        type="number"
        inputMode={step < 1 ? 'decimal' : 'numeric'}
        min={minimum}
        max={maximum}
        step={step}
        value={draftValue}
        style={inputStyle}
        onChange={(event) => setDraftValue(event.target.value)}
        onKeyDown={handleInputKeyDown}
        onBlur={() => {
          commitEditing();
        }}
        className={`work-spreadsheet-input ${align === 'center' ? 'text-center' : 'text-right'}`}
      />
    );
  }

  return (
    <button
      id={createCellId(position)}
      data-work-cell="true"
      data-row-index={position.rowIndex}
      data-column-index={position.columnIndex}
      type="button"
      title="Kliknij lub naciśnij Enter, aby edytować"
      onClick={() => onStartEditing(position)}
      onKeyDown={handleButtonKeyDown}
      className={`work-spreadsheet-value ${
        align === 'center' ? 'text-center' : 'text-right'
      } ${valueClassName}`}
    >
      {displayValue ?? (value === null ? '—' : formatNumber(value))}
    </button>
  );
}

function getTargetPosition(
  current: CellPosition,
  direction: NavigationDirection,
  rowCount: number
): CellPosition {
  const lastRowIndex = Math.max(0, rowCount - 1);
  const lastColumnIndex = EDITABLE_COLUMNS - 1;

  if (direction === 'up') {
    return {
      rowIndex: current.rowIndex === 0 ? lastRowIndex : current.rowIndex - 1,
      columnIndex: current.columnIndex,
    };
  }

  if (direction === 'down') {
    return {
      rowIndex: current.rowIndex === lastRowIndex ? 0 : current.rowIndex + 1,
      columnIndex: current.columnIndex,
    };
  }

  if (direction === 'left') {
    return {
      rowIndex: current.rowIndex,
      columnIndex: current.columnIndex === 0 ? lastColumnIndex : current.columnIndex - 1,
    };
  }

  if (direction === 'right') {
    return {
      rowIndex: current.rowIndex,
      columnIndex: current.columnIndex === lastColumnIndex ? 0 : current.columnIndex + 1,
    };
  }

  const linearIndex = current.rowIndex * EDITABLE_COLUMNS + current.columnIndex;

  const cellCount = rowCount * EDITABLE_COLUMNS;

  if (direction === 'previous') {
    const previousIndex = linearIndex === 0 ? cellCount - 1 : linearIndex - 1;

    return {
      rowIndex: Math.floor(previousIndex / EDITABLE_COLUMNS),
      columnIndex: previousIndex % EDITABLE_COLUMNS,
    };
  }

  const nextIndex = linearIndex === cellCount - 1 ? 0 : linearIndex + 1;

  return {
    rowIndex: Math.floor(nextIndex / EDITABLE_COLUMNS),
    columnIndex: nextIndex % EDITABLE_COLUMNS,
  };
}

export default function WorkDaysTable({
  days,
  isSaving,
  tableDensity,
  onUpdateDay,
  onEditSessions,
}: WorkDaysTableProps) {
  const reversedDays = [...days].reverse();

  const [editingPosition, setEditingPosition] = useState<CellPosition | null>(null);

  const densityClassName = TABLE_DENSITY_CLASSES[tableDensity];

  function focusCell(position: CellPosition) {
    window.requestAnimationFrame(() => {
      document.getElementById(createCellId(position))?.focus();
    });
  }

  function navigateFromCell(position: CellPosition, direction: NavigationDirection) {
    const targetPosition = getTargetPosition(position, direction, reversedDays.length);

    setEditingPosition(null);
    focusCell(targetPosition);
  }

  function commitCell(
    updatedDay: WorkDay,
    position: CellPosition,
    direction?: NavigationDirection
  ) {
    onUpdateDay(updatedDay);
    setEditingPosition(null);

    if (direction) {
      const targetPosition = getTargetPosition(position, direction, reversedDays.length);

      focusCell(targetPosition);
    } else {
      focusCell(position);
    }
  }

  return (
    <section
      className={`${densityClassName} overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/55`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-700 px-3 py-2.5">
        <div className="min-w-0">
          <h2 className="text-xs font-semibold text-zinc-100">Historia aktywnego tygodnia</h2>

          <p className="mt-0.5 truncate text-[10px] text-zinc-500">
            Enter zapisuje, Tab i strzałki zmieniają komórkę
          </p>
        </div>

        <span
          className={`shrink-0 text-[9px] font-semibold uppercase tracking-wide ${
            isSaving ? 'text-amber-400' : 'text-zinc-600'
          }`}
        >
          {isSaving ? 'Zapisywanie…' : 'Tryb arkuszowy'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="work-spreadsheet-table">
          <thead>
            <tr>
              <th className="text-left">Data</th>
              <th className="text-center">Piwa</th>
              <th className="text-center">Ocena</th>
              <th className="text-right">Zatrzymane</th>
              <th className="text-right">Płatne</th>
              <th className="text-right">Godziny</th>
              <th className="text-right">Średnia/h</th>
            </tr>
          </thead>

          <tbody>
            {reversedDays.map((day, rowIndex) => {
              const workedHours = getDayWorkedHours(day);

              const messagesPerHour = workedHours > 0 ? getDayMessagesPerHour(day) : null;

              const ratingPresentation = getWorkRatingPresentation(day.workRating);

              const ratingTextClass =
                day.workRating === null
                  ? 'text-zinc-500'
                  : (ratingPresentation.className
                      .split(' ')
                      .find((className) => className.startsWith('text-')) ?? 'text-zinc-200');

              const beersPosition = {
                rowIndex,
                columnIndex: 0,
              };

              const ratingPosition = {
                rowIndex,
                columnIndex: 1,
              };

              const heldPosition = {
                rowIndex,
                columnIndex: 2,
              };

              const messagesPosition = {
                rowIndex,
                columnIndex: 3,
              };

              return (
                <tr key={day.id}>
                  <td className={`text-left font-bold ${getWeekendDateClass(day.date)}`}>
                    {formatShortIsoDate(day.date)}
                  </td>

                  <td className="text-center">
                    <EditableNumberCell
                      day={day}
                      field="beers"
                      value={day.beers}
                      position={beersPosition}
                      isEditing={
                        editingPosition?.rowIndex === rowIndex && editingPosition.columnIndex === 0
                      }
                      align="center"
                      valueClassName={day.beers === 0 ? 'text-emerald-400' : 'text-red-400'}
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>

                  <td className="text-center">
                    <EditableNumberCell
                      day={day}
                      field="workRating"
                      value={day.workRating}
                      position={ratingPosition}
                      isEditing={
                        editingPosition?.rowIndex === rowIndex && editingPosition.columnIndex === 1
                      }
                      align="center"
                      maximum={10}
                      step={0.1}
                      displayValue={formatWorkRating(day.workRating)}
                      valueClassName={ratingTextClass}
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>

                  <td className="text-right">
                    <EditableNumberCell
                      day={day}
                      field="heldMessages"
                      value={day.heldMessages}
                      position={heldPosition}
                      isEditing={
                        editingPosition?.rowIndex === rowIndex && editingPosition.columnIndex === 2
                      }
                      valueClassName="text-cyan-300"
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>

                  <td className="text-right">
                    <EditableNumberCell
                      day={day}
                      field="messages"
                      value={day.messages}
                      position={messagesPosition}
                      isEditing={
                        editingPosition?.rowIndex === rowIndex && editingPosition.columnIndex === 3
                      }
                      valueClassName="text-[var(--app-accent)]"
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>

                  <td className="text-right">
                    <button
                      type="button"
                      title="Edytuj bloki czasu"
                      onClick={() => onEditSessions(day.id)}
                      className="work-spreadsheet-hours"
                    >
                      <Clock3 aria-hidden="true" className="size-3 text-zinc-500" />

                      <span>{workedHours > 0 ? formatHours(workedHours) : '—'}</span>
                    </button>
                  </td>

                  <td className="text-right">
                    <MessagesPerHourIndicator
                      value={messagesPerHour}
                      compact
                      className="justify-end whitespace-nowrap text-[10px]"
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
