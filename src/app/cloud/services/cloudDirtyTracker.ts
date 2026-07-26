export type CloudDirtyState = {
  isDirty: boolean;
  changedAt: string | null;
  revision: number;
};

type CloudDirtyListener = (state: CloudDirtyState) => void;

const STORAGE_KEY = 'chb-cloud-dirty-state';

const initialState: CloudDirtyState = {
  isDirty: false,
  changedAt: null,
  revision: 0,
};

const listeners = new Set<CloudDirtyListener>();

function isCloudDirtyState(value: unknown): value is CloudDirtyState {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.isDirty === 'boolean' &&
    (record.changedAt === null || typeof record.changedAt === 'string') &&
    typeof record.revision === 'number' &&
    Number.isInteger(record.revision) &&
    record.revision >= 0
  );
}

function readState(): CloudDirtyState {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return initialState;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return isCloudDirtyState(parsedValue) ? parsedValue : initialState;
  } catch {
    return initialState;
  }
}

function notifyListeners(state: CloudDirtyState): void {
  for (const listener of listeners) {
    listener(state);
  }
}

function writeState(state: CloudDirtyState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  notifyListeners(state);
}

function getState(): CloudDirtyState {
  return readState();
}

function markDirty(): CloudDirtyState {
  const currentState = readState();

  const nextState: CloudDirtyState = {
    isDirty: true,
    changedAt: new Date().toISOString(),
    revision: currentState.revision + 1,
  };

  writeState(nextState);

  return nextState;
}

function clearDirty(): CloudDirtyState {
  const currentState = readState();

  const nextState: CloudDirtyState = {
    ...currentState,
    isDirty: false,
  };

  writeState(nextState);

  return nextState;
}

function clearDirtyIfRevision(expectedRevision: number): CloudDirtyState {
  const currentState = readState();

  if (currentState.revision !== expectedRevision) {
    return currentState;
  }

  return clearDirty();
}

function subscribe(listener: CloudDirtyListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export const cloudDirtyTracker = {
  getState,
  markDirty,
  clearDirty,
  clearDirtyIfRevision,
  subscribe,
};
