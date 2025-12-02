import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/format";
import { parseDateRange, getInitialDateRange } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { useEffect } from "react";

export interface DateRangeFilterProps {
  dateRange: string | undefined;
  onDateRangeChange: (range: string | undefined) => void;
  defaultInitial?: boolean; // when true, sets initial range if empty
  label?: string; // optional label text override
}

export function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  defaultInitial = false,
  label: labelProp,
}: DateRangeFilterProps) {
  const { t } = useTranslation();
  const { fromMs, toMs } = parseDateRange(dateRange);
  const hasValue = Boolean(fromMs || toMs);

  useEffect(() => {
    if (defaultInitial && !dateRange) {
      onDateRangeChange(getInitialDateRange());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultInitial, dateRange]);

  const handleReset = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDateRangeChange(undefined);
  };

  const handleSelect = (date: DateRange | undefined) => {
    if (!date) {
      onDateRangeChange(undefined);
      return;
    }
    const from = date.from?.getTime();
    const to = date.to?.getTime();
    onDateRangeChange(from || to ? [from, to].join(",") : undefined);
  };

  const rangeText = (() => {
    if (fromMs && toMs) {
      return `${formatDate(fromMs, { month: "short", day: "numeric" })} - ${formatDate(toMs, { month: "short", day: "numeric" })}`;
    }
    const single = fromMs ?? toMs;
    return single ? formatDate(single, { month: "short", day: "numeric" }) : undefined;
  })();

  const label = (
    <span className="flex items-center gap-2">
      <span>{labelProp ?? t("dashboard.summary.filters.dateRange")}</span>
      {hasValue && rangeText && (
        <>
          <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
          <span>{rangeText}</span>
        </>
      )}
    </span>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {hasValue ? (
            <div
              role="button"
              aria-label={t("dashboard.summary.filters.dateRange")}
              tabIndex={0}
              onClick={handleReset}
              className="focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none"
            >
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{
            from: fromMs ? new Date(fromMs) : undefined,
            to: toMs ? new Date(toMs) : undefined,
          }}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
