import { useContext } from 'react';

import { CloudContext, type CloudContextValue } from '@/app/cloud/cloudContext';

export function useCloud(): CloudContextValue {
  const context = useContext(CloudContext);

  if (!context) {
    throw new Error('useCloud musi być używany wewnątrz CloudProvider.');
  }

  return context;
}
