import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  Settings,
  WalletCards,
} from 'lucide-react';

export type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  available: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    available: true,
  },
  {
    label: 'Praca',
    path: '/work',
    icon: BriefcaseBusiness,
    available: true,
  },
  {
    label: 'Wydatki',
    path: '/expenses',
    icon: CreditCard,
    available: true,
  },
  {
    label: 'Długi',
    path: '/debts',
    icon: HandCoins,
    available: true,
  },
  {
    label: 'Portfel',
    path: '/portfolio',
    icon: WalletCards,
    available: true,
  },
  {
    label: 'Statystyki',
    path: '/statistics',
    icon: BarChart3,
    available: true,
  },
  {
    label: 'Ustawienia',
    path: '/settings',
    icon: Settings,
    available: true,
  },
];
