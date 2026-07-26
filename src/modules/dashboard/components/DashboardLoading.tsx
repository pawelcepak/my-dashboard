import { LoaderCircle } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[28rem] items-center justify-center">
      <div className="text-center">
        <LoaderCircle aria-hidden="true" className="mx-auto size-8 animate-spin text-zinc-500" />

        <p className="mt-4 text-sm font-medium text-zinc-300">Wczytywanie Dashboardu</p>

        <p className="mt-1 text-sm text-zinc-600">Pobieranie danych z lokalnej bazy.</p>
      </div>
    </div>
  );
}
