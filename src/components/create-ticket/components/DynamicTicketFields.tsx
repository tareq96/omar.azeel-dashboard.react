import { type UseFormReturn } from "react-hook-form";
import type { CreateTicketFormValues } from "../schemas/createTicketSchema";
import type { TypeFieldConfig } from "../constants/fieldConfigs";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, XCircle } from "lucide-react";
import { formatDate } from "@/lib/format";

interface DynamicTicketFieldsProps {
  form: UseFormReturn<CreateTicketFormValues>;
  selectedType: string;
  configs: Record<string, TypeFieldConfig>;
  t: (key: string, opts?: any) => string;
}

export const DynamicTicketFields = ({
  form,
  selectedType,
  configs,
  t,
}: DynamicTicketFieldsProps) => {
  const fieldConfig = configs[selectedType];
  if (!fieldConfig) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <h2 className="mb-2 text-lg font-medium lg:col-span-2">{t(fieldConfig.title)}</h2>
      {fieldConfig.fields.map((fieldDef) => (
        <FormField
          key={String(fieldDef.name)}
          control={form.control}
          name={fieldDef.name as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(fieldDef.label)}</FormLabel>
              <FormControl>
                {String(fieldDef.name) === "date_of_locker_removal" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {field.value ? (
                          <div
                            role="button"
                            aria-label={t("common.resetSelection", { defaultValue: "Reset" })}
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange("");
                            }}
                            className="mr-2 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                          >
                            <XCircle className="h-4 w-4" />
                          </div>
                        ) : (
                          <CalendarIcon className="mr-2 h-4 w-4" />
                        )}
                        {field.value
                          ? formatDate(field.value)
                          : t("common.select", { defaultValue: "Select" })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input type={fieldDef.type || "text"} step={fieldDef.step} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};
