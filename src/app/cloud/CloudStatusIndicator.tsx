import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  ChevronDown,
  CloudOff,
  CloudUpload,
  Download,
  GitCompareArrows,
  HardDrive,
  LoaderCircle,
  RefreshCw,
  TriangleAlert,
  Upload,
  Wifi,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';
import { useCloud } from '@/app/cloud/useCloud';
import type { CloudConnectionStatus } from '@/app/cloud/cloud.types';

type StatusPresentation = {
  label: string;
  description: string;
  className: string;
  icon: typeof CloudUpload;
};

const statusPresentations: Record<CloudConnectionStatus, StatusPresentation> = {
  checking: {
    label: 'Sprawdzanie',
    description: 'Porównywanie lokalnej bazy z prywatnym snapshotem.',
    className: 'border-sky-800/70 bg-sky-950/25 text-sky-400',
    icon: LoaderCircle,
  },
  'cloud-empty': {
    label: 'Chmura pusta',
    description: 'Wyślij dane lokalne, aby utworzyć pierwszy snapshot.',
    className: 'border-amber-800/70 bg-amber-950/25 text-amber-400',
    icon: CloudUpload,
  },
  'local-newer': {
    label: 'Zmiany lokalne',
    description: 'To urządzenie zawiera zmiany, których nie ma jeszcze w chmurze.',
    className: 'border-amber-800/70 bg-amber-950/25 text-amber-400',
    icon: ArrowUpFromLine,
  },
  'cloud-newer': {
    label: 'Chmura nowsza',
    description: 'W chmurze znajdują się nowsze dane z innego urządzenia.',
    className: 'border-sky-800/70 bg-sky-950/25 text-sky-400',
    icon: ArrowDownToLine,
  },
  conflict: {
    label: 'Wymaga decyzji',
    description: 'Dane lokalne i chmurowe różnią się. Nic nie zostanie nadpisane automatycznie.',
    className: 'border-red-800/70 bg-red-950/25 text-red-400',
    icon: GitCompareArrows,
  },
  syncing: {
    label: 'Synchronizacja',
    description: 'Trwa bezpieczne przenoszenie danych.',
    className: 'border-sky-800/70 bg-sky-950/25 text-sky-400',
    icon: LoaderCircle,
  },
  synced: {
    label: 'Chmura aktualna',
    description: 'Lokalna baza i snapshot zawierają te same dane.',
    className: 'border-emerald-800/70 bg-emerald-950/25 text-emerald-400',
    icon: CheckCircle2,
  },
  offline: {
    label: 'Offline',
    description: 'Dane są zapisywane lokalnie i zostaną porównane po odzyskaniu internetu.',
    className: 'border-amber-800/70 bg-amber-950/25 text-amber-400',
    icon: CloudOff,
  },
  error: {
    label: 'Błąd chmury',
    description: 'Nie udało się wykonać operacji chmurowej.',
    className: 'border-red-800/70 bg-red-950/25 text-red-400',
    icon: TriangleAlert,
  },
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return 'Brak';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(value));
}

function formatRelativeTime(value: string | null, now: number): string {
  if (!value) {
    return '—';
  }

  const differenceInSeconds = Math.max(0, Math.floor((now - new Date(value).getTime()) / 1000));

  if (differenceInSeconds < 5) {
    return 'przed chwilą';
  }

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} s temu`;
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min temu`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  return `${differenceInHours} godz. temu`;
}

function getActionErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Operacja nie powiodła się.';
}

export default function CloudStatusIndicator() {
  const { user } = useAuth();

  const {
    status,
    syncDirection,
    lastCheckedAt,
    lastSyncedAt,
    cloudSnapshotAt,
    localDataAt,
    hasCloudSnapshot,
    deviceName,
    errorMessage,
    isChecking,
    isSyncing,
    checkConnection,
    uploadLocalData,
    downloadCloudData,
  } = useCloud();

  const panelRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [now, setNow] = useState(Date.now());

  const [localActionError, setLocalActionError] = useState<string | null>(null);

  const [localActionSuccess, setLocalActionSuccess] = useState<string | null>(null);

  const presentation = statusPresentations[status];

  const StatusIcon = presentation.icon;

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !panelRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);

      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  async function handleUpload() {
    const shouldUpload = window.confirm(
      hasCloudSnapshot
        ? 'Wysłanie danych lokalnych zastąpi snapshot znajdujący się w chmurze.\n\nCzy na pewno zachować wersję z tego urządzenia?'
        : 'Czy utworzyć pierwszy snapshot na podstawie danych z tego urządzenia?'
    );

    if (!shouldUpload) {
      return;
    }

    setLocalActionError(null);
    setLocalActionSuccess(null);

    try {
      await uploadLocalData();

      setLocalActionSuccess('Dane lokalne zostały zapisane w chmurze.');
    } catch (error) {
      setLocalActionError(getActionErrorMessage(error));
    }
  }

  async function handleDownload() {
    const shouldDownload = window.confirm(
      'Pobranie snapshotu zastąpi wszystkie lokalne tygodnie i ustawienia w tej przeglądarce.\n\nCzy na pewno zachować wersję z chmury?'
    );

    if (!shouldDownload) {
      return;
    }

    setLocalActionError(null);
    setLocalActionSuccess(null);

    try {
      await downloadCloudData();

      setLocalActionSuccess('Dane z chmury zostały przywrócone lokalnie.');
    } catch (error) {
      setLocalActionError(getActionErrorMessage(error));
    }
  }

  const displayedError = localActionError ?? errorMessage;

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="Pokaż stan chmury"
        title={`${presentation.label} · ${formatRelativeTime(lastSyncedAt ?? lastCheckedAt, now)}`}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-9 items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] ${presentation.className}`}
      >
        <StatusIcon
          aria-hidden="true"
          className={`size-4 shrink-0 ${
            status === 'checking' || status === 'syncing' ? 'animate-spin' : ''
          }`}
          strokeWidth={1.9}
        />

        <span className="hidden sm:inline">{presentation.label}</span>

        <ChevronDown
          aria-hidden="true"
          className={`hidden size-3.5 transition-transform sm:block ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-[min(24rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/30">
          <div className="border-b border-zinc-700 p-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${presentation.className}`}
              >
                <StatusIcon
                  aria-hidden="true"
                  className={`size-5 ${
                    status === 'checking' || status === 'syncing' ? 'animate-spin' : ''
                  }`}
                />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-zinc-100">{presentation.label}</p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {status === 'syncing'
                    ? syncDirection === 'upload'
                      ? 'Wysyłanie lokalnej bazy do Supabase.'
                      : 'Pobieranie snapshotu do lokalnej bazy.'
                    : presentation.description}
                </p>
              </div>
            </div>
          </div>

          <dl className="space-y-3 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Internet</dt>

              <dd className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Wifi aria-hidden="true" className="size-3.5" />

                {navigator.onLine ? 'Połączono' : 'Offline'}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Urządzenie</dt>

              <dd className="text-right font-medium text-zinc-200">{deviceName}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Konto</dt>

              <dd
                title={user?.email}
                className="max-w-52 truncate text-right font-medium text-zinc-200"
              >
                {user?.email ?? '—'}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Lokalna baza</dt>

              <dd className="flex items-center gap-1.5 font-medium text-emerald-400">
                <HardDrive aria-hidden="true" className="size-3.5" />
                Aktywna
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Ostatnia zmiana lokalna</dt>

              <dd className="text-right font-medium text-zinc-200">
                {formatDateTime(localDataAt)}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Snapshot w chmurze</dt>

              <dd className="text-right font-medium text-zinc-200">
                {hasCloudSnapshot ? formatDateTime(cloudSnapshotAt) : 'Brak'}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Ostatnia synchronizacja</dt>

              <dd className="text-right font-medium text-zinc-200">
                {formatDateTime(lastSyncedAt)}

                {lastSyncedAt && (
                  <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                    {formatRelativeTime(lastSyncedAt, now)}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          {status === 'conflict' && (
            <div className="mx-4 mb-4 rounded-xl border border-red-900/60 bg-red-950/30 px-3 py-3 text-xs leading-5 text-red-300">
              Obie wersje zmieniły się od ostatniej znanej synchronizacji. Wybierz ręcznie, którą
              wersję zachować.
            </div>
          )}

          {localActionSuccess && (
            <div className="mx-4 mb-4 rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-3 py-2.5 text-xs leading-5 text-emerald-300">
              {localActionSuccess}
            </div>
          )}

          {displayedError && (
            <div className="mx-4 mb-4 rounded-xl border border-red-900/60 bg-red-950/30 px-3 py-2.5 text-xs leading-5 text-red-300">
              {displayedError}
            </div>
          )}

          <div className="space-y-2 border-t border-zinc-700 p-3">
            <button
              type="button"
              disabled={isSyncing || !navigator.onLine}
              onClick={() => {
                void handleUpload();
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSyncing && syncDirection === 'upload' ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Upload aria-hidden="true" className="size-4" />
              )}
              Zachowaj dane lokalne
            </button>

            <button
              type="button"
              disabled={isSyncing || !navigator.onLine || !hasCloudSnapshot}
              onClick={() => {
                void handleDownload();
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSyncing && syncDirection === 'download' ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Download aria-hidden="true" className="size-4" />
              )}
              Zachowaj dane z chmury
            </button>

            <button
              type="button"
              disabled={isChecking || isSyncing || !navigator.onLine}
              onClick={() => {
                void checkConnection();
              }}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                aria-hidden="true"
                className={`size-3.5 ${isChecking ? 'animate-spin' : ''}`}
              />
              Porównaj ponownie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
