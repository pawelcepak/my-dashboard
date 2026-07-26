import { createContext } from 'react';

import type { ThemeContextValue } from '@/app/theme/theme.types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);
