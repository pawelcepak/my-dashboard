import { BriefcaseBusiness, CreditCard, HandCoins, History, WalletCards } from 'lucide-react';

import MetricCard from '@/shared/components/MetricCard';
import PageHeader from '@/shared/components/PageHeader';
import SectionCard from '@/shared/components/SectionCard';

const dashboardMetrics = [
  {
    title: 'Praca',
    value: '0 godz.',
    description: 'Brak zarejestrowanych tygodni pracy',
    icon: BriefcaseBusiness,
    to: '/work',
  },
  {
    title: 'Wydatki',
    value: '0,00 zł',
    description: 'Brak zarejestrowanych wydatków',
    icon: CreditCard,
    to: '/expenses',
  },
  {
    title: 'Długi',
    value: '0,00 zł',
    description: 'Brak aktywnych zobowiązań',
    icon: HandCoins,
    to: '/debts',
  },
  {
    title: 'Portfel',
    value: '0,00 zł',
    description: 'Brak dodanych składników portfela',
    icon: WalletCards,
    to: '/portfolio',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Główne podsumowanie pracy, finansów i pozostałych obszarów aplikacji."
      />

      <section
        aria-label="Najważniejsze podsumowania"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            to={metric.to}
          />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]">
        <SectionCard
          title="Ostatnia aktywność"
          description="Najnowsze operacje wykonane w aplikacji"
        >
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
              <History aria-hidden="true" className="size-5" />
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-300">Brak aktywności</p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
              Pierwsze operacje pojawią się tutaj po dodaniu danych w module Praca.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Stan aplikacji" description="Informacje o aktualnej wersji">
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">Wersja</dt>

              <dd className="text-sm font-medium text-zinc-200">0.2.1</dd>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">Przechowywanie</dt>

              <dd className="text-sm font-medium text-zinc-200">Lokalne</dd>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">Synchronizacja</dt>

              <dd className="text-sm font-medium text-amber-400">Jeszcze niedostępna</dd>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">Aktywny moduł</dt>

              <dd className="text-sm font-medium text-zinc-200">Dashboard</dd>
            </div>
          </dl>
        </SectionCard>
      </div>
    </div>
  );
}
