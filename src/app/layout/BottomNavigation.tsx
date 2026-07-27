import { MoreHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { getOrderedNavigationItems, type NavigationItem } from '@/app/layout/navigation';
import { useAppSettings } from '@/modules/settings/hooks/useAppSettings';
import type { NavigationTabColor } from '@/modules/settings/types/appSettings.types';

const TAB_COLOR_VALUES: Record<NavigationTabColor, string> = {
  crimson: '#ff315d',
  blue: '#60a5fa',
  emerald: '#34d399',
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
    '--tab-soft': `color-mix(in srgb, ${value} 17%, transparent)`,
    '--tab-border': `color-mix(in srgb, ${value} 58%, transparent)`,
    '--tab-shadow': `color-mix(in srgb, ${value} 20%, transparent)`,
  } as CSSProperties;
}

function getNavigationLinkClasses(isActive: boolean): string {
  const baseClasses =
    'group flex min-w-0 items-center justify-center gap-2 rounded-lg border font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tab-color)]';

  if (isActive) {
    return `${baseClasses} border-[var(--tab-border)] bg-[var(--tab-soft)] text-[var(--tab-color)] shadow-sm shadow-[var(--tab-shadow)]`;
  }

  return `${baseClasses} border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900 hover:text-[var(--tab-color)]`;
}

type NavigationLinkProps = {
  item: NavigationItem;
  color: NavigationTabColor;
  compact?: boolean;
};

function NavigationLink({ item, color, compact = false }: NavigationLinkProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      style={getTabStyle(color)}
      className={({ isActive }) =>
        compact
          ? `${getNavigationLinkClasses(isActive)} my-1 flex-col gap-0.5 px-1 text-[10px]`
          : `${getNavigationLinkClasses(isActive)} h-10 shrink-0 px-3.5 text-sm`
      }
    >
      <Icon
        aria-hidden="true"
        className={compact ? 'size-5' : 'size-4 shrink-0'}
        strokeWidth={1.9}
      />

      <span className={compact ? 'max-w-full truncate' : undefined}>
        {compact ? item.shortLabel : item.label}
      </span>
    </NavLink>
  );
}

function DesktopNavigation({
  items,
  colors,
}: {
  items: NavigationItem[];
  colors: Record<string, NavigationTabColor>;
}) {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-5 lg:px-6 xl:px-8">
      <nav
        aria-label="Główna nawigacja"
        className="hidden h-14 items-center justify-start overflow-x-auto md:flex"
      >
        <div className="flex min-w-max items-center gap-1">
          {items.map((item) => (
            <NavigationLink key={item.id} item={item} color={colors[item.id] ?? 'crimson'} />
          ))}
        </div>
      </nav>
    </div>
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

  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !panelRef.current?.contains(target)) {
        setIsMoreOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
      }
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
        <div className="absolute right-2 bottom-full mb-2 w-64 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 p-2 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between px-2 py-2">
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Więcej zakładek
            </p>

            <button
              type="button"
              aria-label="Zamknij dodatkowe zakładki"
              onClick={() => setIsMoreOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-100"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <nav aria-label="Dodatkowe zakładki" className="space-y-1">
            {secondaryItems.map((item) => (
              <NavigationLink key={item.id} item={item} color={colors[item.id] ?? 'crimson'} />
            ))}
          </nav>
        </div>
      )}

      <nav
        aria-label="Mobilna nawigacja"
        className="grid h-[4.25rem] grid-cols-5 items-stretch px-1 pb-[env(safe-area-inset-bottom)]"
      >
        {primaryItems.map((item) => (
          <NavigationLink key={item.id} item={item} color={colors[item.id] ?? 'crimson'} compact />
        ))}

        <button
          type="button"
          aria-expanded={isMoreOpen}
          aria-label={isMoreOpen ? 'Zamknij dodatkowe zakładki' : 'Otwórz dodatkowe zakładki'}
          onClick={() => setIsMoreOpen((current) => !current)}
          style={getTabStyle('zinc')}
          className={`${getNavigationLinkClasses(
            hasActiveSecondaryItem || isMoreOpen
          )} my-1 flex-col gap-0.5 px-1 text-[10px]`}
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
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-700 bg-zinc-950/96 shadow-[0_-8px_24px_rgb(0_0_0_/_8%)] backdrop-blur-xl">
      <DesktopNavigation items={items} colors={preferences.navigationTabColors} />
      <MobileNavigation items={items} colors={preferences.navigationTabColors} />
    </footer>
  );
}
