import { ArrowUpRight, type LucideIcon } from 'lucide-react';
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
      className="app-panel group flex min-w-0 items-center gap-3 px-3.5 py-3 transition hover:-translate-y-px hover:border-[var(--app-accent-border)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/55 text-zinc-400 transition group-hover:border-[var(--app-accent-border)] group-hover:text-[var(--app-accent)]">
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium text-zinc-500">{title}</p>
        <p className="mt-0.5 truncate text-lg font-bold tracking-tight text-zinc-100">{value}</p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">{description}</p>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-zinc-600 transition group-hover:text-[var(--app-accent)]"
      />
    </Link>
  );
}
