import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';
import { CloudContext, type CloudContextValue } from '@/app/cloud/cloudContext';
import { cloudDirtyTracker, type CloudDirtyState } from '@/app/cloud/services/cloudDirtyTracker';
import { cloudSyncService } from '@/app/cloud/services/cloudSyncService';
import type {
  CloudConnectionStatus,
  CloudInspectionResult,
  CloudStatusDetails,
  CloudSyncDirection,
} from '@/app/cloud/cloud.types';
import { supabase } from '@/lib/supabase';

type CloudProviderProps = {
  children: ReactNode;
};

const AUTO_UPLOAD_DELAY_MS = 2500;

function createInitialStatus(): CloudStatusDetails {
  return {
    status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'checking',
    syncDirection: null,
    lastCheckedAt: null,
    lastSyncedAt: null,
    cloudSnapshotAt: null,
    localDataAt: null,
    hasCloudSnapshot: false,
    deviceName: 'Przeglądarka CHB',
    errorMessage: null,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Nie udało się wykonać operacji chmurowej.';
}

function createDetailsFromInspection(inspection: CloudInspectionResult): CloudStatusDetails {
  return {
    status: inspection.state,
    syncDirection: null,
    lastCheckedAt: new Date().toISOString(),
    lastSyncedAt: inspection.lastSyncedAt,
    cloudSnapshotAt: inspection.cloudSnapshotAt,
    localDataAt: inspection.localDataAt,
    hasCloudSnapshot: inspection.hasCloudSnapshot,
    deviceName: inspection.deviceName,
    errorMessage: null,
  };
}

export default function CloudProvider({ children }: CloudProviderProps) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [details, setDetails] = useState<CloudStatusDetails>(createInitialStatus);

  const [isChecking, setIsChecking] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);

  const [dirtyState, setDirtyState] = useState<CloudDirtyState>(() => cloudDirtyTracker.getState());

  const automaticUploadTimeoutRef = useRef<number | null>(null);

  const automaticStartupRef = useRef(false);

  const setOperationError = useCallback((error: unknown) => {
    const status: CloudConnectionStatus = navigator.onLine ? 'error' : 'offline';

    setDetails((currentDetails) => ({
      ...currentDetails,
      status,
      syncDirection: null,
      lastCheckedAt: new Date().toISOString(),
      errorMessage: status === 'error' ? getErrorMessage(error) : null,
    }));
  }, []);

  const applyInspection = useCallback((inspection: CloudInspectionResult) => {
    setDetails(createDetailsFromInspection(inspection));
  }, []);

  const showSyncingStatus = useCallback((direction: Exclude<CloudSyncDirection, null>) => {
    setDetails((currentDetails) => ({
      ...currentDetails,
      status: 'syncing',
      syncDirection: direction,
      errorMessage: null,
    }));
  }, []);

  const runStartupSynchronization = useCallback(async (): Promise<void> => {
    if (!user || !navigator.onLine || isSyncing) {
      return;
    }

    setIsChecking(true);

    setDetails((currentDetails) => ({
      ...currentDetails,
      status: 'checking',
      syncDirection: null,
      errorMessage: null,
    }));

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Nie znaleziono aktywnego użytkownika chmury.');
      }

      const initialInspection = await cloudSyncService.inspect(data.user.id);

      applyInspection(initialInspection);

      if (initialInspection.state === 'cloud-empty') {
        setIsSyncing(true);
        showSyncingStatus('upload');

        const synchronizedInspection = await cloudSyncService.upload(data.user.id);

        applyInspection(synchronizedInspection);

        return;
      }

      if (initialInspection.state === 'local-newer') {
        setIsSyncing(true);
        showSyncingStatus('upload');

        const synchronizedInspection = await cloudSyncService.upload(data.user.id);

        applyInspection(synchronizedInspection);

        return;
      }

      if (initialInspection.state === 'cloud-newer') {
        setIsSyncing(true);
        showSyncingStatus('download');

        const synchronizedInspection = await cloudSyncService.download(data.user.id);

        applyInspection(synchronizedInspection);

        return;
      }

      applyInspection(initialInspection);
    } catch (error) {
      setOperationError(error);
    } finally {
      setIsChecking(false);
      setIsSyncing(false);
    }
  }, [applyInspection, isSyncing, setOperationError, showSyncingStatus, user]);

  const checkConnection = useCallback(async (): Promise<void> => {
    if (!navigator.onLine) {
      setDetails((currentDetails) => ({
        ...currentDetails,
        status: 'offline',
        syncDirection: null,
        lastCheckedAt: new Date().toISOString(),
        errorMessage: null,
      }));

      return;
    }

    if (!user) {
      setDetails(createInitialStatus());
      return;
    }

    setIsChecking(true);

    setDetails((currentDetails) => ({
      ...currentDetails,
      status: 'checking',
      syncDirection: null,
      errorMessage: null,
    }));

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Nie znaleziono aktywnego użytkownika chmury.');
      }

      const inspection = await cloudSyncService.inspect(data.user.id);

      applyInspection(inspection);
    } catch (error) {
      setOperationError(error);
    } finally {
      setIsChecking(false);
    }
  }, [applyInspection, setOperationError, user]);

  const uploadLocalData = useCallback(async (): Promise<void> => {
    if (!user) {
      throw new Error('Musisz być zalogowany.');
    }

    if (!navigator.onLine) {
      const error = new Error('Brak internetu. Dane nadal są bezpieczne lokalnie.');

      setOperationError(error);
      throw error;
    }

    setIsSyncing(true);
    showSyncingStatus('upload');

    try {
      const inspection = await cloudSyncService.upload(user.id);

      applyInspection(inspection);
    } catch (error) {
      setOperationError(error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [applyInspection, setOperationError, showSyncingStatus, user]);

  const downloadCloudData = useCallback(async (): Promise<void> => {
    if (!user) {
      throw new Error('Musisz być zalogowany.');
    }

    if (!navigator.onLine) {
      const error = new Error('Brak internetu. Nie można pobrać danych.');

      setOperationError(error);
      throw error;
    }

    setIsSyncing(true);
    showSyncingStatus('download');

    try {
      const inspection = await cloudSyncService.download(user.id);

      applyInspection(inspection);
    } catch (error) {
      setOperationError(error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [applyInspection, setOperationError, showSyncingStatus, user]);

  const runAutomaticUpload = useCallback(async (): Promise<void> => {
    if (!user || !navigator.onLine || isChecking || isSyncing) {
      return;
    }

    try {
      const inspection = await cloudSyncService.inspect(user.id);

      applyInspection(inspection);

      if (inspection.state !== 'local-newer' && inspection.state !== 'cloud-empty') {
        return;
      }

      setIsSyncing(true);
      showSyncingStatus('upload');

      const synchronizedInspection = await cloudSyncService.upload(user.id);

      applyInspection(synchronizedInspection);
    } catch (error) {
      setOperationError(error);
    } finally {
      setIsSyncing(false);
    }
  }, [applyInspection, isChecking, isSyncing, setOperationError, showSyncingStatus, user]);

  useEffect(() => {
    return cloudDirtyTracker.subscribe((nextDirtyState) => {
      setDirtyState(nextDirtyState);

      if (nextDirtyState.isDirty) {
        setDetails((currentDetails) => {
          if (
            currentDetails.status === 'conflict' ||
            currentDetails.status === 'cloud-newer' ||
            currentDetails.status === 'offline' ||
            currentDetails.status === 'error'
          ) {
            return currentDetails;
          }

          return {
            ...currentDetails,
            status: 'local-newer',
            localDataAt: nextDirtyState.changedAt,
            errorMessage: null,
          };
        });
      }
    });
  }, []);

  useEffect(() => {
    if (automaticUploadTimeoutRef.current !== null) {
      window.clearTimeout(automaticUploadTimeoutRef.current);
      automaticUploadTimeoutRef.current = null;
    }

    if (
      !dirtyState.isDirty ||
      !user ||
      isAuthLoading ||
      !navigator.onLine ||
      isChecking ||
      isSyncing ||
      details.status === 'conflict' ||
      details.status === 'cloud-newer'
    ) {
      return;
    }

    automaticUploadTimeoutRef.current = window.setTimeout(() => {
      automaticUploadTimeoutRef.current = null;

      void runAutomaticUpload();
    }, AUTO_UPLOAD_DELAY_MS);

    return () => {
      if (automaticUploadTimeoutRef.current !== null) {
        window.clearTimeout(automaticUploadTimeoutRef.current);
        automaticUploadTimeoutRef.current = null;
      }
    };
  }, [details.status, dirtyState, isAuthLoading, isChecking, isSyncing, runAutomaticUpload, user]);

  useEffect(() => {
    if (isAuthLoading || !user || automaticStartupRef.current) {
      return;
    }

    automaticStartupRef.current = true;

    void runStartupSynchronization();
  }, [isAuthLoading, runStartupSynchronization, user]);

  useEffect(() => {
    if (user) {
      return;
    }

    automaticStartupRef.current = false;
  }, [user]);

  useEffect(() => {
    function handleOnline() {
      void runStartupSynchronization();
    }

    function handleOffline() {
      setIsChecking(false);
      setIsSyncing(false);

      setDetails((currentDetails) => ({
        ...currentDetails,
        status: 'offline',
        syncDirection: null,
        lastCheckedAt: new Date().toISOString(),
        errorMessage: null,
      }));
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [runStartupSynchronization]);

  useEffect(() => {
    return () => {
      if (automaticUploadTimeoutRef.current !== null) {
        window.clearTimeout(automaticUploadTimeoutRef.current);
      }
    };
  }, []);

  const value = useMemo<CloudContextValue>(
    () => ({
      ...details,
      isChecking,
      isSyncing,
      checkConnection,
      uploadLocalData,
      downloadCloudData,
    }),
    [checkConnection, details, downloadCloudData, isChecking, isSyncing, uploadLocalData]
  );

  return <CloudContext.Provider value={value}>{children}</CloudContext.Provider>;
}
