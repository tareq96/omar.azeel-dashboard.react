import {
  DASHBOARD_SUMMARY_CACHE_TIME,
  type DashboardTabType,
} from "@/components/dashboard-summary/constants/constants";
import {
  useDashboardSummaryOperationsSummary,
  useDashboardSummaryFinanceSummary,
} from "@/services/api/generated/dashboard-summary/dashboard-summary";

export function useDashboardData(tab: DashboardTabType, from_date?: string, to_date?: string) {
  const queryOptions = { query: { staleTime: DASHBOARD_SUMMARY_CACHE_TIME } };

  const operations = useDashboardSummaryOperationsSummary(
    { from_date, to_date, type: tab },
    queryOptions,
  );

  const finance = useDashboardSummaryFinanceSummary(
    { from_date, to_date, type: tab },
    queryOptions,
  );

  return {
    operations,
    finance,
    isLoading: operations.isLoading || finance.isLoading,
    error: operations.error || finance.error,
  };
}
