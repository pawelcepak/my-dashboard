import MessageRateThresholdBar from '@/modules/work/components/MessageRateThresholdBar';
import type { WorkProgress } from '@/modules/work/types/work.types';

type WorkProgressCardProps = {
  totalMessages: number;
  progress: WorkProgress;
};

const statusStyles: Record<WorkProgress['status'], { badge: string; label: string }> = {
  red: { badge: 'border-red-900/70 bg-red-950/50 text-red-300', label: 'Poniżej pierwszego progu' },
  yellow: {
    badge: 'border-amber-900/70 bg-amber-950/50 text-amber-300',
    label: 'Pierwszy próg osiągnięty',
  },
  'light-green': {
    badge: 'border-lime-900/70 bg-lime-950/50 text-lime-300',
    label: 'Drugi próg osiągnięty',
  },
  green: {
    badge: 'border-emerald-900/70 bg-emerald-950/50 text-emerald-300',
    label: 'Najwyższy próg osiągnięty',
  },
};

export default function WorkProgressCard({ totalMessages, progress }: WorkProgressCardProps) {
  const styles = statusStyles[progress.status];

  return (
    <section className="mx-auto w-full max-w-[72rem] rounded-xl border border-zinc-700 bg-zinc-900/55">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2">
        <h2 className="text-[11px] font-semibold text-zinc-100">Postęp tygodnia</h2>
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${styles.badge}`}>
          {styles.label}
        </span>
      </div>
      <div className="border-t border-zinc-700 px-3 py-2">
        <MessageRateThresholdBar totalMessages={totalMessages} compact />
      </div>
    </section>
  );
}
