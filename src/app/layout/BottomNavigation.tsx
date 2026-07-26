import { MoreHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { navigationItems } from '@/app/layout/navigation';

function getNavigationLinkClasses(isActive: boolean): string {
  const baseClasses =
    'group flex min-w-0 items-center justify-center gap-2 rounded-lg border font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]';

  if (isActive) {
    return `${baseClasses} border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] shadow-sm shadow-[var(--app-accent-shadow)]`;
  }

  return `${baseClasses} border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100`;
}

function DesktopNavigation() {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-5 lg:px-6 xl:px-8">
      <nav
        aria-label="Główna nawigacja"
        className="hidden h-14 items-center justify-start gap-1 md:flex"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `${getNavigationLinkClasses(isActive)} h-10 px-3.5 text-sm`
              }
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.9} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function MobileNavigation() {
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryItems = navigationItems.filter((item) => item.mobilePrimary);

  const secondaryItems = navigationItems.filter((item) => !item.mobilePrimary);

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
      {isMoreOpen && (
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
            {secondaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${getNavigationLinkClasses(isActive)} h-11 justify-start px-3 text-sm`
                  }
                >
                  <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.9} />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      <nav
        aria-label="Mobilna nawigacja"
        className="grid h-[4.25rem] grid-cols-5 items-stretch px-1 pb-[env(safe-area-inset-bottom)]"
      >
        {primaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `${getNavigationLinkClasses(isActive)} my-1 flex-col gap-0.5 px-1 text-[10px]`
              }
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />

              <span className="max-w-full truncate">{item.shortLabel}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          aria-expanded={isMoreOpen}
          aria-label={isMoreOpen ? 'Zamknij dodatkowe zakładki' : 'Otwórz dodatkowe zakładki'}
          onClick={() => setIsMoreOpen((current) => !current)}
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
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-700 bg-zinc-950/96 shadow-[0_-8px_24px_rgb(0_0_0_/_8%)] backdrop-blur-xl">
      <DesktopNavigation />
      <MobileNavigation />
    </footer>
  );
}
