import { Target } from 'lucide-react';

import WorkSummaryGridBody from '@/modules/work/components/WorkSummaryGridBody';
import type { WorkWeekGoals, WorkWeekSummary } from '@/modules/work/types/work.types';

type WorkSummaryGridProps = {
  summary: WorkWeekSummary;
  goals: WorkWeekGoals;
};

export default function WorkSummaryGrid({ summary, goals }: WorkSummaryGridProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 px-4 py-3.5">
        <h2 className="text-sm font-semibold text-zinc-100">Podsumowanie aktywnego tygodnia</h2>
        <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
          <Target aria-hidden="true" className="size-4" />
        </div>
      </div>
      <div className="p-4">
        <WorkSummaryGridBody summary={summary} goals={goals} />
      </div>
    </section>
  );
}
