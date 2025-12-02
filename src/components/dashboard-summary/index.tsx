import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DateRangeFilter } from "@/components/dashboard-summary/components/DateRangeFilter";
import { TabSelector } from "@/components/dashboard-summary/components/TabSelector";
import { ErrorDisplay } from "@/components/dashboard-summary/components/ErrorDisplay";
import { MetricGrid } from "@/components/dashboard-summary/components/MetricGrid";
import { parseDateRange, getInitialDateRange, extractApiErrorMessage } from "@/lib/utils";
import { type DashboardTabType } from "@/components/dashboard-summary/constants/constants";
import { useDashboardData } from "@/components/dashboard-summary/hooks/use-dashboard-data";
import { useMetricCards } from "@/components/dashboard-summary/hooks/use-metric-cards";

export function DashboardSummary() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<DashboardTabType>("Mobile");
  const [dateRange, setDateRange] = useState<string | undefined>(getInitialDateRange());

  const { from, to } = parseDateRange(dateRange);
  const { operations, finance, isLoading, error } = useDashboardData(tab, from, to);
  const cards = useMetricCards(operations.data, finance.data, t);
  const errorText = extractApiErrorMessage(error, t);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <TabSelector activeTab={tab} onTabChange={setTab} />
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <ErrorDisplay errorText={errorText} />
      <MetricGrid isLoading={isLoading} cards={cards} />
    </div>
  );
}
