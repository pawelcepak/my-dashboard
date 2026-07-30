import { MoreHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { getOrderedNavigationItems, type NavigationItem } from '@/app/layout/navigation';
import { useAppSettings } from '@/modules/settings/hooks/useAppSettings';
import type { NavigationTabColor } from '@/modules/settings/types/appSettings.types';

const TAB_COLOR_VALUES: Record<NavigationTabColor, string> = {
  crimson: '#fb7185',
  blue: '#60a5fa',
  emerald: '#4ade80',
  amber: '#fbbf24',
  violet: '#a78bfa',
  cyan: '#22d3ee',
  orange: '#fb923c',
  pink: '#f472b6',
  zinc: '#a1a1aa',
};

function getTabStyle(color: NavigationTabColor): CSSProperties {
  const value = TAB_COLOR_VALUES[color];
  return {
    '--tab-color': value,
    '--tab-soft': `color-mix(in srgb, ${value} 14%, transparent)`,
    '--tab-border': `color-mix(in srgb, ${value} 42%, transparent)`,
  } as CSSProperties;
}

function DesktopLink({ item, color }: { item: NavigationItem; color: NavigationTabColor }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      style={getTabStyle(color)}
      className={({ isActive }) =>
        `group flex h-9 items-center gap-3 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tab-color)] ${
          isActive
            ? 'border-[var(--tab-border)] bg-[var(--tab-soft)] text-zinc-100 shadow-sm'
            : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200'
        }`
      }
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.8} />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

function DesktopSidebar({
  items,
  colors,
}: {
  items: NavigationItem[];
  colors: Record<string, NavigationTabColor>;
}) {
  const { user } = useAuth();
  const accountName =
    (typeof user?.user_metadata?.display_name === 'string' && user.user_metadata.display_name) ||
    user?.email?.split('@')[0] ||
    'Użytkownik';

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[13.5rem] flex-col border-r border-zinc-700/80 bg-zinc-950 md:flex">
      <div className="flex h-14 items-center border-b border-zinc-700/80 px-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 rounded-lg text-base font-extrabold tracking-[0.08em] text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-xs text-[var(--app-accent)]">
            C
          </span>
          CHB
        </NavLink>
      </div>

      <nav aria-label="Główna nawigacja" className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <DesktopLink key={item.id} item={item} color={colors[item.id] ?? 'crimson'} />
        ))}
      </nav>

      <div className="border-t border-zinc-700/80 p-3">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900/70 p-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--app-accent-soft)] text-xs font-bold text-[var(--app-accent)]">
            {accountName.slice(0, 2).toLocaleUpperCase('pl-PL')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-200">{accountName}</p>
            <p className="mt-0.5 truncate text-[10px] text-zinc-500">CHB v0.8.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function getMobileLinkClasses(isActive: boolean): string {
  const base =
    'group my-1 flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 text-[10px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tab-color)]';
  return isActive
    ? `${base} border-[var(--tab-border)] bg-[var(--tab-soft)] text-[var(--tab-color)]`
    : `${base} border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-[var(--tab-color)]`;
}

function MobileLink({ item, color }: { item: NavigationItem; color: NavigationTabColor }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      style={getTabStyle(color)}
      className={({ isActive }) => getMobileLinkClasses(isActive)}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
      <span className="max-w-full truncate">{item.shortLabel}</span>
    </NavLink>
  );
}

function MobileNavigation({
  items,
  colors,
}: {
  items: NavigationItem[];
  colors: Record<string, NavigationTabColor>;
}) {
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const primaryItems = items.slice(0, 4);
  const secondaryItems = items.slice(4);
  const hasActiveSecondaryItem = secondaryItems.some(
    (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  );

  useEffect(() => setIsMoreOpen(false), [location.pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target)) {
        setIsMoreOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMoreOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMoreOpen]);

  return (
    <div ref={panelRef} className="relative md:hidden">
      {isMoreOpen && secondaryItems.length > 0 && (
        <div className="absolute right-2 bottom-full mb-2 w-64 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between px-2 py-2">
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Więcej</p>
            <button
              type="button"
              aria-label="Zamknij dodatkowe zakładki"
              onClick={() => setIsMoreOpen(false)}
              className="app-icon-button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <nav aria-label="Dodatkowe zakładki" className="space-y-1">
            {secondaryItems.map((item) => (
              <DesktopLink key={item.id} item={item} color={colors[item.id] ?? 'crimson'} />
            ))}
          </nav>
        </div>
      )}

      <nav
        aria-label="Mobilna nawigacja"
        className="grid h-[4.25rem] grid-cols-5 items-stretch px-1 pb-[env(safe-area-inset-bottom)]"
      >
        {primaryItems.map((item) => (
          <MobileLink key={item.id} item={item} color={colors[item.id] ?? 'crimson'} />
        ))}
        <button
          type="button"
          aria-expanded={isMoreOpen}
          onClick={() => setIsMoreOpen((current) => !current)}
          style={getTabStyle('zinc')}
          className={getMobileLinkClasses(hasActiveSecondaryItem || isMoreOpen)}
        >
          <MoreHorizontal aria-hidden="true" className="size-5" strokeWidth={1.9} />
          <span>Więcej</span>
        </button>
      </nav>
    </div>
  );
}

export default function BottomNavigation() {
  const { preferences } = useAppSettings();
  const items = useMemo(
    () => getOrderedNavigationItems(preferences.navigationOrder),
    [preferences.navigationOrder]
  );

  return (
    <>
      <DesktopSidebar items={items} colors={preferences.navigationTabColors} />
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-700 bg-zinc-950/96 shadow-[0_-8px_24px_rgb(0_0_0_/_8%)] backdrop-blur-xl md:hidden">
        <MobileNavigation items={items} colors={preferences.navigationTabColors} />
      </footer>
    </>
  );
}
