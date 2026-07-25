import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  to: string;
};

export default function MetricCard({ title, value, description, icon: Icon, to }: MetricCardProps) {
  return (
    <Link
      to={to}
      className="group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300">
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </div>

        <ArrowRight
          aria-hidden="true"
          className="size-5 -translate-x-1 text-zinc-600 opacity-0 transition group-hover:translate-x-0 group-hover:text-zinc-300 group-hover:opacity-100"
        />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-400">{title}</p>

        <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{value}</p>

        <p className="mt-2 text-sm leading-5 text-zinc-500">{description}</p>
      </div>
    </Link>
  );
}
