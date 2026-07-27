import { Clock3, Plus, Trash2, X } from 'lucide-react';

import type { WorkDay, WorkSession } from '@/modules/work/types/work.types';
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
  'h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

const labelClasses = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500';

function createSession(): WorkSession {
  return {
    id: crypto.randomUUID(),
    startTime: '08:00',
    endTime: '09:00',
  };
}

export default function WorkDayEditor({ day, onChange, onClose }: WorkDayEditorProps) {
  const workedHours = getDayWorkedHours(day);

  const messagesPerHour = workedHours > 0 ? getDayMessagesPerHour(day) : 0;

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
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-session-editor-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-4 py-3.5 sm:px-5">
          <div>
            <h2 id="work-session-editor-title" className="text-sm font-semibold text-zinc-100">
              Bloki pracy
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">{formatIsoDate(day.date)}</p>
          </div>

          <button
            type="button"
            aria-label="Zamknij edycję bloków"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-4rem)] overflow-y-auto p-4 sm:p-5">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                Łączny czas
              </p>

              <p className="mt-1 text-lg font-bold text-zinc-100">{formatHours(workedHours)} h</p>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                Średnia/h
              </p>

              <p className="mt-1 text-lg font-bold text-zinc-100">
                {workedHours > 0 ? formatDecimal(messagesPerHour) : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-zinc-300">Przedziały czasu</h3>

              <p className="mt-0.5 text-[11px] text-zinc-500">Zmiany zapisują się automatycznie.</p>
            </div>

            <button
              type="button"
              onClick={addSession}
              className="flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] px-3 text-xs font-semibold text-[var(--app-accent)] transition hover:brightness-110"
            >
              <Plus aria-hidden="true" className="size-3.5" />
              Dodaj blok
            </button>
          </div>

          {day.sessions.length > 0 ? (
            <div className="mt-3 space-y-2">
              {day.sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="grid gap-2 rounded-xl border border-zinc-700 bg-zinc-950/40 p-3 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-500">
                    <Clock3 aria-hidden="true" className="size-4" />
                  </div>

                  <label>
                    <span className={labelClasses}>Początek {index + 1}</span>

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
                    className="flex size-10 items-center justify-center rounded-lg border border-red-900/70 bg-red-950/30 text-red-400 transition hover:bg-red-950/60"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/30 px-5 py-7 text-center">
              <p className="text-sm font-medium text-zinc-400">Brak bloków pracy</p>

              <p className="mt-1 text-xs text-zinc-600">
                Dodaj pierwszy blok, aby obliczyć godziny.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
