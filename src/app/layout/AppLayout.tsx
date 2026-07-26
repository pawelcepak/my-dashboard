import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/app/layout/BottomNavigation';
import Header from '@/app/layout/Header';

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <Header />

      <main className="min-w-0 pb-24 md:pb-20">
        <div className="mx-auto w-full max-w-[1920px] px-3 py-3 sm:px-5 sm:py-4 lg:px-6 xl:px-8">
          <Outlet />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
