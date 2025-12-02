import { format } from "date-fns";
import { ChevronDownIcon, ChevronsRight } from "lucide-react";
import React from "react";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { ResponsiveDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeftIcon, CalendarIcon, XIcon } from "@/components/ui/icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type ResponsiveDateRangePickerDialogProps = {
  dateRange?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  numberOfMonths?: number;
  iconOnlyOnMobile?: boolean;
};

const DateRangePickerDialog = ({
  dateRange,
  onDateChange,
  disabled,
  placeholder,
  title,
  numberOfMonths = 1,
  iconOnlyOnMobile = true,
}: ResponsiveDateRangePickerDialogProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [date, setDate] = React.useState<DateRange | undefined>(dateRange);

  const formatDateRange = (dateRange?: DateRange) => {
    if (!dateRange?.from) return placeholder;

    if (dateRange.to) {
      return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
    }

    return format(dateRange.from, "LLL dd, y");
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setDate(undefined);
    } else {
      setDate(dateRange);
    }
  };

  return (
    <ResponsiveDialog onOpenChange={onOpenChange}>
      <ResponsiveDialog.Trigger
        variant="outline"
        className={cn("relative text-sm font-normal", !dateRange?.from && "text-muted-foreground")}
        disabled={disabled}
      >
        <div className="flex flex-row items-center gap-1 text-start font-normal">
          <CalendarIcon
            className={cn("size-5 md:size-4", !dateRange?.from && "text-muted-foreground")}
          />
          {!(isMobile && iconOnlyOnMobile) && (
            <span className={cn("text-sm", !dateRange?.from && "text-muted-foreground")}>
              {formatDateRange(dateRange)}
            </span>
          )}
        </div>
        {!(isMobile && iconOnlyOnMobile) && <ChevronDownIcon className="size-4 opacity-50" />}
        {isMobile && iconOnlyOnMobile && dateRange?.from && (
          <span className="bg-primary absolute top-2 right-2 size-2 rounded-full" />
        )}
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="md:w-fit md:max-w-5xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>{title}</ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body className="flex items-center justify-center">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(14)]"
            components={{
              MonthGrid: ({ children }) => (
                <div>
                  {date?.from || date?.to ? (
                    <div className="mb-10 flex w-full flex-row items-center justify-between gap-2 px-8 md:px-15">
                      {date?.from && (
                        <div className="text-sm text-[#515766]">
                          {format(date.from, "dd-MM-yyyy")}
                        </div>
                      )}
                      <ChevronsRight className="size-6 text-[#515766] rtl:rotate-180" />
                      {date?.to && (
                        <div className="text-sm text-[#515766]">
                          {format(date.to, "dd-MM-yyyy")}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {children}
                </div>
              ),
            }}
          />
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className={"h-12 p-3 text-sm text-[#3F434F] md:w-36"}
              disabled={!date?.from}
              onClick={() => {
                setDate(undefined);
                onDateChange(undefined);
              }}
            >
              <XIcon className="size-6" />
              {t("common.cancelSelection")}
            </Button>
            <div className={"flex flex-row items-center gap-2"}>
              <ResponsiveDialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className={"h-12 w-auto p-3 text-sm text-[#3F434F] md:w-16"}
                >
                  {t("common.cancel")}
                </Button>
              </ResponsiveDialog.Close>
              <ResponsiveDialog.Close
                variant="secondary"
                size="lg"
                className="h-12 flex-1 text-sm md:min-w-38"
                disabled={!date?.from}
                onClick={() => onDateChange(date)}
              >
                {t("common.actions.confirm")}
                <ArrowLeftIcon className="size-6 ltr:rotate-180" />
              </ResponsiveDialog.Close>
            </div>
          </div>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
};

export { DateRangePickerDialog };
