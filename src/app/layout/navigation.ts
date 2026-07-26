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
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  mobilePrimary: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    shortLabel: 'Start',
    path: '/',
    icon: LayoutDashboard,
    mobilePrimary: true,
  },
  {
    label: 'Praca',
    shortLabel: 'Praca',
    path: '/work',
    icon: BriefcaseBusiness,
    mobilePrimary: true,
  },
  {
    label: 'Wydatki',
    shortLabel: 'Wydatki',
    path: '/expenses',
    icon: CreditCard,
    mobilePrimary: true,
  },
  {
    label: 'Długi',
    shortLabel: 'Długi',
    path: '/debts',
    icon: HandCoins,
    mobilePrimary: true,
  },
  {
    label: 'Portfel',
    shortLabel: 'Portfel',
    path: '/portfolio',
    icon: WalletCards,
    mobilePrimary: false,
  },
  {
    label: 'Statystyki',
    shortLabel: 'Statystyki',
    path: '/statistics',
    icon: BarChart3,
    mobilePrimary: false,
  },
  {
    label: 'Ustawienia',
    shortLabel: 'Ustawienia',
    path: '/settings',
    icon: Settings,
    mobilePrimary: false,
  },
];
