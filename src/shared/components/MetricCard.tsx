import { ArrowRight, type LucideIcon } from 'lucide-react';
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
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950/40 px-3 py-3 transition hover:border-[var(--app-accent-border)] hover:bg-[var(--app-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 transition group-hover:border-[var(--app-accent-border)] group-hover:text-[var(--app-accent)]">
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-zinc-200">{title}</p>

          <p className="shrink-0 text-sm font-bold text-zinc-100">{value}</p>
        </div>

        <p className="mt-0.5 truncate text-xs text-zinc-500">{description}</p>
      </div>

      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-[var(--app-accent)]"
      />
    </Link>
  );
}
