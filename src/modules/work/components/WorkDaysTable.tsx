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

type EditableField = 'beers' | 'workRating' | 'heldMessages' | 'messages' | 'responses';

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

const EDITABLE_COLUMNS = 5;

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
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
}

function parseWorkRating(value: string): number | null {
  if (value.trim() === '') return null;
  const parsedValue = Number.parseFloat(value.replace(',', '.'));
  if (!Number.isFinite(parsedValue)) return null;
  return Math.round(Math.min(10, Math.max(0, parsedValue)) * 10) / 10;
}

function getResponseRate(day: WorkDay): number | null {
  const denominator = day.heldMessages + day.messages;
  if (denominator <= 0) return null;
  return ((day.responses ?? 0) / denominator) * 100;
}

function getWeekendDateClass(date: string): string {
  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  if (dayOfWeek === 0) return 'text-red-400';
  if (dayOfWeek === 6) return 'text-zinc-500';
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
    if (!isEditing) setDraftValue(value === null ? '' : String(value));
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function getUpdatedDay(): WorkDay {
    const nextValue =
      field === 'workRating' ? parseWorkRating(draftValue) : parseNonNegativeInteger(draftValue);
    if (nextValue === value) return day;
    return { ...day, [field]: nextValue };
  }

  function commitEditing(direction?: NavigationDirection) {
    onCommit(getUpdatedDay(), position, direction);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const directions: Partial<Record<string, NavigationDirection>> = {
      Enter: 'down',
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };

    if (event.key === 'Tab') {
      event.preventDefault();
      commitEditing(event.shiftKey ? 'previous' : 'next');
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDraftValue(value === null ? '' : String(value));
      onCancelEditing();
      return;
    }

    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      commitEditing(direction);
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

    const directions: Partial<Record<string, NavigationDirection>> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      onNavigate(position, direction);
    }
  }

  if (isEditing) {
    const inputStyle: CSSProperties = { width: `${Math.max(3, draftValue.length + 1)}ch` };
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
        onBlur={() => commitEditing()}
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
      className={`work-spreadsheet-value ${align === 'center' ? 'text-center' : 'text-right'} ${valueClassName}`}
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
  const targetIndex =
    direction === 'previous'
      ? linearIndex === 0
        ? cellCount - 1
        : linearIndex - 1
      : linearIndex === cellCount - 1
        ? 0
        : linearIndex + 1;

  return {
    rowIndex: Math.floor(targetIndex / EDITABLE_COLUMNS),
    columnIndex: targetIndex % EDITABLE_COLUMNS,
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
    window.requestAnimationFrame(() => document.getElementById(createCellId(position))?.focus());
  }

  function navigateFromCell(position: CellPosition, direction: NavigationDirection) {
    setEditingPosition(null);
    focusCell(getTargetPosition(position, direction, reversedDays.length));
  }

  function commitCell(
    updatedDay: WorkDay,
    position: CellPosition,
    direction?: NavigationDirection
  ) {
    onUpdateDay(updatedDay);
    setEditingPosition(null);
    focusCell(direction ? getTargetPosition(position, direction, reversedDays.length) : position);
  }

  return (
    <section
      className={`${densityClassName} overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/55`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-700 px-3 py-2.5">
        <h2 className="min-w-0 text-xs font-semibold text-zinc-100">
          Historia aktywnego tygodnia
        </h2>
        <span
          className={`shrink-0 text-[9px] font-semibold uppercase tracking-wide ${isSaving ? 'text-amber-400' : 'text-zinc-600'}`}
        >
          {isSaving ? 'Zapisywanie…' : 'Tryb arkuszowy'}
        </span>
      </div>

      <div className="overflow-x-hidden">
        <table className="work-spreadsheet-table" style={{ minWidth: 0, width: '100%' }}>
          <colgroup>
            <col style={{ width: '11%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="text-left">Data</th>
              <th className="text-center">Piwa</th>
              <th className="text-center">Ocena</th>
              <th className="text-center" title="Zatrzymane">
                Zatrz.
              </th>
              <th className="text-center">Płatne</th>
              <th className="text-center" title="Odpowiedzi">
                Odpow.
              </th>
              <th className="text-center">Odp. %</th>
              <th className="text-center" title="Godziny">
                Godz.
              </th>
              <th className="text-center" title="Średnia na godzinę">
                Śr./h
              </th>
            </tr>
          </thead>
          <tbody>
            {reversedDays.map((day, rowIndex) => {
              const workedHours = getDayWorkedHours(day);
              const messagesPerHour = workedHours > 0 ? getDayMessagesPerHour(day) : null;
              const responseRate = getResponseRate(day);
              const ratingPresentation = getWorkRatingPresentation(day.workRating);
              const ratingTextClass =
                day.workRating === null
                  ? 'text-zinc-500'
                  : (ratingPresentation.className
                      .split(' ')
                      .find((className) => className.startsWith('text-')) ?? 'text-zinc-200');

              const positions = {
                beers: { rowIndex, columnIndex: 0 },
                rating: { rowIndex, columnIndex: 1 },
                held: { rowIndex, columnIndex: 2 },
                messages: { rowIndex, columnIndex: 3 },
                responses: { rowIndex, columnIndex: 4 },
              };

              const isEditing = (columnIndex: number) =>
                editingPosition?.rowIndex === rowIndex &&
                editingPosition.columnIndex === columnIndex;

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
                      position={positions.beers}
                      isEditing={isEditing(0)}
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
                      position={positions.rating}
                      isEditing={isEditing(1)}
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
                  <td className="text-center">
                    <EditableNumberCell
                      day={day}
                      field="heldMessages"
                      value={day.heldMessages}
                      position={positions.held}
                      isEditing={isEditing(2)}
                      align="center"
                      valueClassName="text-cyan-300"
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>
                  <td className="text-center">
                    <EditableNumberCell
                      day={day}
                      field="messages"
                      value={day.messages}
                      position={positions.messages}
                      isEditing={isEditing(3)}
                      align="center"
                      valueClassName="text-[var(--app-accent)]"
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>
                  <td className="text-center">
                    <EditableNumberCell
                      day={day}
                      field="responses"
                      value={day.responses ?? 0}
                      position={positions.responses}
                      isEditing={isEditing(4)}
                      align="center"
                      valueClassName="text-violet-300"
                      onStartEditing={setEditingPosition}
                      onCancelEditing={() => setEditingPosition(null)}
                      onCommit={commitCell}
                      onNavigate={navigateFromCell}
                    />
                  </td>
                  <td className="text-center font-semibold text-zinc-300">
                    {responseRate === null ? '—' : `${responseRate.toFixed(2)}%`}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      title="Edytuj bloki czasu"
                      onClick={() => onEditSessions(day.id)}
                      className="work-spreadsheet-hours justify-center text-center"
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
