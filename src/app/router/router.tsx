import { Navigate, createHashRouter } from 'react-router-dom';

import AppLayout from '@/app/layout/AppLayout';
import AlcoholPage from '@/modules/alcohol';
import DashboardPage from '@/modules/dashboard';
import DebtsPage from '@/modules/debts';
import PortfolioPage from '@/modules/portfolio';
import SettingsPage from '@/modules/settings';
import ShoppingPage from '@/modules/shopping';
import WorkPage from '@/modules/work';

export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/work', element: <WorkPage /> },
      { path: '/debts', element: <DebtsPage /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '/alcohol', element: <AlcoholPage /> },
      { path: '/shopping', element: <ShoppingPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/expenses', element: <Navigate to="/" replace /> },
      { path: '/statistics', element: <Navigate to="/" replace /> },
    ],
  },
]);
