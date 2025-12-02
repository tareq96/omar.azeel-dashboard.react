import * as React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeFieldProps {
  label: string;
  date?: Date;
  time: string;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimeField({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeFieldProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const fieldId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="z-9999 grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${fieldId}-date`} className="px-1">
            {t("common.date", { defaultValue: "Date" })}
          </Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={`${fieldId}-date`}
                className={cn("w-full justify-between font-normal", "rtl:flex-row-reverse")}
              >
                <span className="flex-1 text-right">
                  {date
                    ? dayjs(date).format("YYYY-MM-DD")
                    : t("calendar.selectDate", { defaultValue: "Select date" })}
                </span>
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-9999 w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  onDateChange(selectedDate ?? undefined);
                  setIsOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${fieldId}-time`} className="px-1">
            {t("common.time", { defaultValue: "Time" })}
          </Label>
          <Input
            type="time"
            id={`${fieldId}-time`}
            step="1"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className={cn(
              "bg-background w-full appearance-none justify-end",
              "[&::-webkit-calendar-picker-indicator]:hidden",
              "[&::-webkit-calendar-picker-indicator]:appearance-none",
            )}
          />
        </div>
      </div>
    </div>
  );
}
