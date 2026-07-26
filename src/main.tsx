import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import AuthProvider from '@/app/auth/AuthProvider';
import CloudProvider from '@/app/cloud/CloudProvider';
import { router } from '@/app/router/router';
import ThemeProvider from '@/app/theme/ThemeProvider';

import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Nie znaleziono elementu #root.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CloudProvider>
          <RouterProvider router={router} />
        </CloudProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
