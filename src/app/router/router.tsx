import { createHashRouter } from 'react-router-dom';

import AppLayout from '@/app/layout/AppLayout';
import AlcoholPage from '@/modules/alcohol';
import DashboardPage from '@/modules/dashboard';
import DebtsPage from '@/modules/debts';
import ExpensesPage from '@/modules/expenses';
import PortfolioPage from '@/modules/portfolio';
import SettingsPage from '@/modules/settings';
import StatisticsPage from '@/modules/statistics';
import WorkPage from '@/modules/work';

export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/work',
        element: <WorkPage />,
      },
      {
        path: '/expenses',
        element: <ExpensesPage />,
      },
      {
        path: '/debts',
        element: <DebtsPage />,
      },
      {
        path: '/portfolio',
        element: <PortfolioPage />,
      },
      {
        path: '/alcohol',
        element: <AlcoholPage />,
      },
      {
        path: '/statistics',
        element: <StatisticsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
