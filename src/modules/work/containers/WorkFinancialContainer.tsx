import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import WorkProgressCard from '@/modules/work/components/WorkProgressCard';
import type {
  FinancialPlanItem,
  WorkProgress,
  WorkWeek,
  WorkWeekSummary,
} from '@/modules/work/types/work.types';

type WorkWeekUpdater = (week: WorkWeek) => WorkWeek;

type WorkFinancialContainerProps = {
  activeWeek: WorkWeek;
  summary: WorkWeekSummary;
  progress: WorkProgress;
  updateWeek: (updater: WorkWeekUpdater) => Promise<void>;
};

export default function WorkFinancialContainer({
  activeWeek,
  summary,
  progress,
  updateWeek,
}: WorkFinancialContainerProps) {
  function updateFinancialPlan(items: FinancialPlanItem[]) {
    void updateWeek((currentWeek) => ({
      ...currentWeek,
      financialPlan: items,
    }));
  }

  return (
    <>
      <WorkProgressCard
        totalMessages={summary.totalMessages}
        progress={progress}
        goals={activeWeek.goals}
      />

      <FinancialPlanSummary
        items={activeWeek.financialPlan}
        summary={summary}
        exchangeRateEurPln={activeWeek.exchangeRateEurPln}
        onItemsChange={updateFinancialPlan}
      />
    </>
  );
}
