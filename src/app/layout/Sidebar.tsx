import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { navigationItems } from '@/app/layout/navigation';

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Główna nawigacja" className="flex flex-col gap-1.5">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) => {
              const baseClasses =
                'group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors';

              if (isActive) {
                return `${baseClasses} bg-zinc-800 text-zinc-50`;
              }

              return `${baseClasses} text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100`;
            }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  aria-hidden="true"
                  className={`size-5 shrink-0 transition-colors ${
                    isActive ? 'text-zinc-50' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 lg:flex">
        <div className="flex h-16 items-center border-b border-zinc-800/80 px-5">
          <div>
            <p className="text-sm font-semibold tracking-wide text-zinc-100">My Dashboard</p>

            <p className="mt-0.5 text-xs text-zinc-500">Panel osobisty</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <NavigationLinks />
        </div>

        <div className="border-t border-zinc-800/80 px-5 py-4">
          <p className="text-xs text-zinc-600">Wersja 0.2.1</p>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        aria-label="Menu mobilne"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col border-r border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-200 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5">
          <div>
            <p className="text-sm font-semibold text-zinc-100">My Dashboard</p>

            <p className="mt-0.5 text-xs text-zinc-500">Panel osobisty</p>
          </div>

          <button
            type="button"
            aria-label="Zamknij menu"
            onClick={onMobileClose}
            className="flex size-10 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <NavigationLinks onNavigate={onMobileClose} />
        </div>

        <div className="border-t border-zinc-800 px-5 py-4">
          <p className="text-xs text-zinc-600">Wersja 0.2.1</p>
        </div>
      </aside>
    </>
  );
}
