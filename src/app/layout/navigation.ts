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

export const NAVIGATION_ITEM_IDS = [
  'dashboard',
  'work',
  'expenses',
  'debts',
  'portfolio',
  'statistics',
  'settings',
] as const;

export type NavigationItemId = (typeof NAVIGATION_ITEM_IDS)[number];

export type NavigationItem = {
  id: NavigationItemId;
  label: string;
  shortLabel: string;
  path: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    shortLabel: 'Start',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'work',
    label: 'Praca',
    shortLabel: 'Praca',
    path: '/work',
    icon: BriefcaseBusiness,
  },
  {
    id: 'expenses',
    label: 'Wydatki',
    shortLabel: 'Wydatki',
    path: '/expenses',
    icon: CreditCard,
  },
  {
    id: 'debts',
    label: 'Długi',
    shortLabel: 'Długi',
    path: '/debts',
    icon: HandCoins,
  },
  {
    id: 'portfolio',
    label: 'Portfel',
    shortLabel: 'Portfel',
    path: '/portfolio',
    icon: WalletCards,
  },
  {
    id: 'statistics',
    label: 'Statystyki',
    shortLabel: 'Statystyki',
    path: '/statistics',
    icon: BarChart3,
  },
  {
    id: 'settings',
    label: 'Ustawienia',
    shortLabel: 'Ustawienia',
    path: '/settings',
    icon: Settings,
  },
];

export function getOrderedNavigationItems(order: NavigationItemId[]): NavigationItem[] {
  const itemsById = new Map(navigationItems.map((item) => [item.id, item]));

  const orderedItems = order.flatMap((itemId) => {
    const item = itemsById.get(itemId);
    return item ? [item] : [];
  });

  const orderedIds = new Set(orderedItems.map((item) => item.id));

  return [...orderedItems, ...navigationItems.filter((item) => !orderedIds.has(item.id))];
}
