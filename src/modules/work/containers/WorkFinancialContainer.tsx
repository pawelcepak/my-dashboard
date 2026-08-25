import FinancialPlanSummary from '@/modules/work/components/FinancialPlanSummary';
import type { FinancialPlanItem, WorkWeek, WorkWeekSummary } from '@/modules/work/types/work.types';

type WorkWeekUpdater = (week: WorkWeek) => WorkWeek;

type WorkFinancialContainerProps = {
  activeWeek: WorkWeek;
  summary: WorkWeekSummary;
  updateWeek: (updater: WorkWeekUpdater) => Promise<void>;
};

export default function WorkFinancialContainer({
  activeWeek,
  summary,
  updateWeek,
}: WorkFinancialContainerProps) {
  function updateFinancialPlan(items: FinancialPlanItem[]) {
    void updateWeek((currentWeek) => ({ ...currentWeek, financialPlan: items }));
  }

  return (
    <FinancialPlanSummary
      items={activeWeek.financialPlan}
      summary={summary}
      exchangeRateEurPln={activeWeek.exchangeRateEurPln}
      onItemsChange={updateFinancialPlan}
    />
  );
}
