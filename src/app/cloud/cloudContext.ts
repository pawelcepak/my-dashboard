import { createContext } from 'react';

import type { CloudStatusDetails } from '@/app/cloud/cloud.types';

export type CloudContextValue = CloudStatusDetails & {
  isChecking: boolean;
  isSyncing: boolean;
  checkConnection: () => Promise<void>;
  uploadLocalData: () => Promise<void>;
  downloadCloudData: () => Promise<void>;
};

export const CloudContext = createContext<CloudContextValue | null>(null);
