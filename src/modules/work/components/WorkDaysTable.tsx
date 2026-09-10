import { Clock3 } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { useAppSettings } from '@/modules/settings/hooks/useAppSettings';
import {
  DEFAULT_WORK_TABLE_COLUMN_WIDTHS,
  type TableDensity,
  type WorkTableColumnWidths,
} from '@/modules/settings/types/appSettings.types';
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

type HeaderCellProps = {
  index: number;
  children: ReactNode;
  align?: 'left' | 'center';
  title?: string;
  onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>, index: number) => void;
};

const EDITABLE_COLUMNS = 5;
const MIN_COLUMN_WIDTH = 4;

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

function HeaderCell({ index, children, align = 'center', title, onResizeStart }: HeaderCellProps) {
  return (
    <th className={align === 'left' ? 'text-left' : 'text-center'} title={title}>
      {children}
      {index < DEFAULT_WORK_TABLE_COLUMN_WIDTHS.length - 1 && (
        <span
          className="work-column-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label={`Zmień szerokość kolumny ${String(children)}`}
          onPointerDown={(event) => onResizeStart(event, index)}
        />
      )}
    </th>
  );
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
  const { preferences, savePreference } = useAppSettings();
  const [columnWidths, setColumnWidths] = useState<WorkTableColumnWidths>(
    preferences.workTableColumnWidths
  );
  const columnWidthsRef = useRef<WorkTableColumnWidths>(preferences.workTableColumnWidths);
  const tableRef = useRef<HTMLTableElement>(null);
  const densityClassName = TABLE_DENSITY_CLASSES[tableDensity];

  useEffect(() => {
    setColumnWidths(preferences.workTableColumnWidths);
    columnWidthsRef.current = preferences.workTableColumnWidths;
  }, [preferences.workTableColumnWidths]);

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

  function startColumnResize(event: ReactPointerEvent<HTMLSpanElement>, index: number) {
    const tableWidth = tableRef.current?.getBoundingClientRect().width ?? 0;
    if (tableWidth <= 0 || index >= columnWidths.length - 1) return;

    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidths = [...columnWidthsRef.current] as WorkTableColumnWidths;
    const pairTotal = startWidths[index] + startWidths[index + 1];

    document.body.classList.add('work-table-resizing');

    function handlePointerMove(pointerEvent: PointerEvent) {
      const deltaPercent = ((pointerEvent.clientX - startX) / tableWidth) * 100;
      const nextLeft = Math.min(
        pairTotal - MIN_COLUMN_WIDTH,
        Math.max(MIN_COLUMN_WIDTH, startWidths[index] + deltaPercent)
      );
      const nextRight = pairTotal - nextLeft;
      const nextWidths = [...startWidths] as WorkTableColumnWidths;
      nextWidths[index] = Number(nextLeft.toFixed(3));
      nextWidths[index + 1] = Number(nextRight.toFixed(3));
      columnWidthsRef.current = nextWidths;
      setColumnWidths(nextWidths);
    }

    function handlePointerUp() {
      document.body.classList.remove('work-table-resizing');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      void savePreference('workTableColumnWidths', columnWidthsRef.current);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  }

  function resetColumnWidths() {
    const defaults = [...DEFAULT_WORK_TABLE_COLUMN_WIDTHS] as WorkTableColumnWidths;
    columnWidthsRef.current = defaults;
    setColumnWidths(defaults);
    void savePreference('workTableColumnWidths', defaults);
  }

  return (
    <section
      className={`${densityClassName} overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/55`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-700 px-3 py-2.5">
        <h2 className="min-w-0 text-xs font-semibold text-zinc-100">
          Historia aktywnego tygodnia
        </h2>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="work-table-width-reset"
            title="Przywróć domyślne szerokości kolumn"
            onClick={resetColumnWidths}
          >
            Reset szer.
          </button>
          <span
            className={`text-[9px] font-semibold uppercase tracking-wide ${isSaving ? 'text-amber-400' : 'text-zinc-600'}`}
          >
            {isSaving ? 'Zapisywanie…' : 'Tryb arkuszowy'}
          </span>
        </div>
      </div>

      <div className="overflow-x-hidden">
        <table ref={tableRef} className="work-spreadsheet-table" style={{ minWidth: 0, width: '100%' }}>
          <colgroup>
            {columnWidths.map((width, index) => (
              <col key={index} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <HeaderCell index={0} align="left" onResizeStart={startColumnResize}>Data</HeaderCell>
              <HeaderCell index={1} onResizeStart={startColumnResize}>Piwa</HeaderCell>
              <HeaderCell index={2} onResizeStart={startColumnResize}>Ocena</HeaderCell>
              <HeaderCell index={3} title="Zatrzymane" onResizeStart={startColumnResize}>Zatrz.</HeaderCell>
              <HeaderCell index={4} onResizeStart={startColumnResize}>Płatne</HeaderCell>
              <HeaderCell index={5} title="Odpowiedzi" onResizeStart={startColumnResize}>Odpow.</HeaderCell>
              <HeaderCell index={6} onResizeStart={startColumnResize}>Odp. %</HeaderCell>
              <HeaderCell index={7} title="Godziny" onResizeStart={startColumnResize}>Godz.</HeaderCell>
              <HeaderCell index={8} title="Średnia na godzinę" onResizeStart={startColumnResize}>Śr./h</HeaderCell>
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
                    <EditableNumberCell day={day} field="beers" value={day.beers} position={positions.beers} isEditing={isEditing(0)} align="center" valueClassName={day.beers === 0 ? 'text-emerald-400' : 'text-red-400'} onStartEditing={setEditingPosition} onCancelEditing={() => setEditingPosition(null)} onCommit={commitCell} onNavigate={navigateFromCell} />
                  </td>
                  <td className="text-center">
                    <EditableNumberCell day={day} field="workRating" value={day.workRating} position={positions.rating} isEditing={isEditing(1)} align="center" maximum={10} step={0.1} displayValue={formatWorkRating(day.workRating)} valueClassName={ratingTextClass} onStartEditing={setEditingPosition} onCancelEditing={() => setEditingPosition(null)} onCommit={commitCell} onNavigate={navigateFromCell} />
                  </td>
                  <td className="text-center">
                    <EditableNumberCell day={day} field="heldMessages" value={day.heldMessages} position={positions.held} isEditing={isEditing(2)} align="center" valueClassName="text-cyan-300" onStartEditing={setEditingPosition} onCancelEditing={() => setEditingPosition(null)} onCommit={commitCell} onNavigate={navigateFromCell} />
                  </td>
                  <td className="text-center">
                    <EditableNumberCell day={day} field="messages" value={day.messages} position={positions.messages} isEditing={isEditing(3)} align="center" valueClassName="text-[var(--app-accent)]" onStartEditing={setEditingPosition} onCancelEditing={() => setEditingPosition(null)} onCommit={commitCell} onNavigate={navigateFromCell} />
                  </td>
                  <td className="text-center">
                    <EditableNumberCell day={day} field="responses" value={day.responses ?? 0} position={positions.responses} isEditing={isEditing(4)} align="center" valueClassName="text-violet-300" onStartEditing={setEditingPosition} onCancelEditing={() => setEditingPosition(null)} onCommit={commitCell} onNavigate={navigateFromCell} />
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
