import { Clock3, Plus, Trash2, X } from 'lucide-react';

import type { WorkDay, WorkSession } from '@/modules/work/types/work.types';
import {
  formatWorkRating,
  getBeerPresentation,
  getWorkRatingPresentation,
} from '@/modules/work/utils/workPresentation';
import {
  formatDecimal,
  formatHours,
  formatIsoDate,
  getDayMessagesPerHour,
  getDayWorkedHours,
} from '@/modules/work/utils/workCalculations';

type WorkDayEditorProps = {
  day: WorkDay;
  onChange: (day: WorkDay) => void;
  onClose: () => void;
};

const inputClasses =
  'h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800';

const labelClasses = 'mb-2 block text-sm font-medium text-zinc-400';

function createSession(): WorkSession {
  return {
    id: crypto.randomUUID(),
    startTime: '08:00',
    endTime: '09:00',
  };
}

function toNonNegativeInteger(value: string): number {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function toWorkRating(value: string): number | null {
  if (value === '') {
    return null;
  }

  const normalizedValue = value.replace(',', '.');
  const parsedValue = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  const limitedValue = Math.min(10, Math.max(0, parsedValue));

  return Math.round(limitedValue * 10) / 10;
}

export default function WorkDayEditor({ day, onChange, onClose }: WorkDayEditorProps) {
  const workedHours = getDayWorkedHours(day);
  const messagesPerHour = getDayMessagesPerHour(day);

  const ratingPresentation = getWorkRatingPresentation(day.workRating);

  const beerPresentation = getBeerPresentation(day.beers);

  function updateSession(sessionId: string, field: 'startTime' | 'endTime', value: string) {
    onChange({
      ...day,
      sessions: day.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              [field]: value,
            }
          : session
      ),
    });
  }

  function removeSession(sessionId: string) {
    onChange({
      ...day,
      sessions: day.sessions.filter((session) => session.id !== sessionId),
    });
  }

  function addSession() {
    onChange({
      ...day,
      sessions: [...day.sessions, createSession()],
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Edycja dnia</h2>

          <p className="mt-1 text-sm text-zinc-500">{formatIsoDate(day.date)}</p>
        </div>

        <button
          type="button"
          aria-label="Zamknij edycję dnia"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label>
            <span className={labelClasses}>Data</span>

            <input
              type="date"
              value={day.date}
              onChange={(event) =>
                onChange({
                  ...day,
                  date: event.target.value,
                })
              }
              className={inputClasses}
            />
          </label>

          <label>
            <span className={labelClasses}>Liczba piw</span>

            <input
              type="number"
              min="0"
              step="1"
              value={day.beers}
              onChange={(event) =>
                onChange({
                  ...day,
                  beers: toNonNegativeInteger(event.target.value),
                })
              }
              className={inputClasses}
            />

            <span
              className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${beerPresentation.className}`}
            >
              {beerPresentation.label}
            </span>
          </label>

          <label>
            <span className={labelClasses}>Ocena pracy</span>

            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={day.workRating ?? ''}
              placeholder="8,5"
              onChange={(event) =>
                onChange({
                  ...day,
                  workRating: toWorkRating(event.target.value),
                })
              }
              className={inputClasses}
            />

            <span
              className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${ratingPresentation.className}`}
            >
              {formatWorkRating(day.workRating)}
              {day.workRating !== null ? ` · ${ratingPresentation.label}` : ''}
            </span>
          </label>

          <label>
            <span className={labelClasses}>Wiadomości</span>

            <input
              type="number"
              min="0"
              step="1"
              value={day.messages}
              onChange={(event) =>
                onChange({
                  ...day,
                  messages: toNonNegativeInteger(event.target.value),
                })
              }
              className={inputClasses}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-600">Łączny czas pracy</p>

            <p className="mt-2 text-xl font-semibold text-zinc-100">
              {formatHours(workedHours)} godz.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-600">Wiadomości na godzinę</p>

            <p className="mt-2 text-xl font-semibold text-zinc-100">
              {workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Bloki pracy</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Czas dnia jest obliczany automatycznie z poniższych przedziałów.
              </p>
            </div>

            <button
              type="button"
              onClick={addSession}
              className="flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
            >
              <Plus aria-hidden="true" className="size-4" />
              Dodaj blok
            </button>
          </div>

          {day.sessions.length > 0 ? (
            <div className="mt-4 space-y-3">
              {day.sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
                    <Clock3 aria-hidden="true" className="size-4" />
                  </div>

                  <label>
                    <span className={labelClasses}>Początek bloku {index + 1}</span>

                    <input
                      type="time"
                      value={session.startTime}
                      onChange={(event) =>
                        updateSession(session.id, 'startTime', event.target.value)
                      }
                      className={inputClasses}
                    />
                  </label>

                  <label>
                    <span className={labelClasses}>Koniec</span>

                    <input
                      type="time"
                      value={session.endTime}
                      onChange={(event) => updateSession(session.id, 'endTime', event.target.value)}
                      className={inputClasses}
                    />
                  </label>

                  <button
                    type="button"
                    aria-label={`Usuń blok ${index + 1}`}
                    onClick={() => removeSession(session.id)}
                    className="flex size-11 items-center justify-center rounded-xl border border-red-950 bg-red-950/30 text-red-400 transition hover:bg-red-950/60 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-900"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 px-5 py-8 text-center">
              <p className="text-sm font-medium text-zinc-400">Brak bloków pracy</p>

              <p className="mt-1 text-sm text-zinc-600">
                Dodaj pierwszy blok, aby aplikacja mogła obliczyć czas pracy.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
