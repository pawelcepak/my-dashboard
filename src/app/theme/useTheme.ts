import { useContext } from 'react';

import { ThemeContext } from '@/app/theme/themeContext';
import type { ThemeContextValue } from '@/app/theme/theme.types';

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme musi być używany wewnątrz ThemeProvider.');
  }

  return context;
}
