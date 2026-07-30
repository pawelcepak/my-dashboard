import { LoaderCircle } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import LoginPage from '@/app/auth/LoginPage';
import { useAuth } from '@/app/auth/useAuth';
import BottomNavigation from '@/app/layout/BottomNavigation';
import Header from '@/app/layout/Header';

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="text-center">
        <LoaderCircle
          aria-hidden="true"
          className="mx-auto size-8 animate-spin text-[var(--app-accent)]"
        />
        <p className="mt-4 text-sm font-semibold text-zinc-300">Sprawdzanie sesji</p>
        <p className="mt-1 text-xs text-zinc-500">Łączenie z prywatną chmurą CHB.</p>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthLoadingScreen />;
  if (!user) return <LoginPage />;

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 md:pl-[13.5rem]">
      <BottomNavigation />

      <div className="min-w-0">
        <Header />

        <main className="min-w-0 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-[1800px] px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 xl:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
