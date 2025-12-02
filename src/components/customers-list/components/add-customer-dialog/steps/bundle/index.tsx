import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { CreateCustomerFormValues } from "../../schema";
import { useBundlesBundlesList } from "@/services/api/generated/bundles/bundles";
import { useAddressesGetZones } from "@/services/api/generated/addresses/addresses";
import { DateTimeField } from "@/components/common/DateTimeField";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BundleStepProps = {
  form: UseFormReturn<CreateCustomerFormValues>;
  canProceed: boolean;
};

export default function BundleStep({ form }: BundleStepProps) {
  const { t } = useTranslation();
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [isActivationDateOpen, setIsActivationDateOpen] = useState(false);

  // Fetch bundles list
  const { data: bundlesData } = useBundlesBundlesList(
    { per_page: 100 },
    { query: { staleTime: 5 * 60 * 1000 } }, // Cache for 5 minutes
  );

  // Fetch zones for dropdown
  const { data: zonesData } = useAddressesGetZones({}, { query: { staleTime: 5 * 60 * 1000 } });

  // Extract bundles from paginated response
  const bundles = Array.isArray(bundlesData?.data) ? bundlesData.data : [];
  const zones = zonesData?.data || [];

  const bundleId = form.watch("bundle_id");

  // Update selected bundle when bundle_id changes
  useEffect(() => {
    if (bundleId) {
      const bundle = bundles.find((b: any) => b.id === bundleId);
      setSelectedBundle(bundle);
    } else {
      setSelectedBundle(null);
    }
  }, [bundleId, bundles]);

  return (
    <div className="space-y-6">
      {/* Bundle Selection Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t("customers.addDialog.sections.bundleSelection")}
        </h3>

        <FormField
          control={form.control}
          name="bundle_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customers.addDialog.fields.bundle")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "none") {
                    field.onChange(undefined);
                  } else {
                    field.onChange(parseInt(value));
                  }
                }}
                value={field.value?.toString() || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("customers.addDialog.placeholders.bundle")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-9999">
                  <SelectItem value="none">{t("common.none")}</SelectItem>
                  {bundles.map((bundle: any) => (
                    <SelectItem key={bundle.id} value={bundle.id.toString()}>
                      {bundle.name || `Bundle ${bundle.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t("customers.addDialog.descriptions.bundle")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show bundle details when selected - Read-only fields like old implementation */}
        <div className="grid grid-cols-4 gap-4">
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.bundleName")}</FormLabel>
            <Input
              className="bg-muted"
              value={
                selectedBundle?.name || t("customers.addDialog.placeholders.selectBundleFirst")
              }
              readOnly
            />
          </FormItem>
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.bundlePrice")}</FormLabel>
            <Input
              className="bg-muted"
              value={
                selectedBundle?.price || t("customers.addDialog.placeholders.selectBundleFirst")
              }
              readOnly
            />
          </FormItem>
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.bundleUpto")}</FormLabel>
            <Input
              className="bg-muted"
              value={
                selectedBundle?.upto || t("customers.addDialog.placeholders.selectBundleFirst")
              }
              readOnly
            />
          </FormItem>
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.bundleContinuous")}</FormLabel>
            <Input
              className="bg-muted"
              value={
                selectedBundle
                  ? selectedBundle.cont
                    ? t("common.yes")
                    : t("common.no")
                  : t("customers.addDialog.placeholders.selectBundleFirst")
              }
              readOnly
            />
          </FormItem>
        </div>
      </div>

      {/* Date Fields */}
      <div className="grid grid-cols-1 gap-4">
        {/* Activation Date - Date only picker */}
        <div className="grid gap-2">
          <span className="text-sm font-medium">
            {t("customers.addDialog.fields.activationDate")}
          </span>
          <Popover open={isActivationDateOpen} onOpenChange={setIsActivationDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-between font-normal", "rtl:flex-row")}
              >
                <span className="flex-1 text-start">
                  {form.watch("activation_date")
                    ? dayjs(form.watch("activation_date")).format("YYYY-MM-DD")
                    : t("calendar.selectDate", { defaultValue: "Select date" })}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-9999 w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  form.watch("activation_date")
                    ? new Date(form.watch("activation_date")!)
                    : undefined
                }
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  form.setValue(
                    "activation_date",
                    selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                  );
                  setIsActivationDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Installation Date - Date and time picker */}
        <DateTimeField
          label={t("customers.addDialog.fields.installationDate")}
          date={
            form.watch("installation_date") ? new Date(form.watch("installation_date")!) : undefined
          }
          time={form.watch("installation_time") || ""}
          onDateChange={(date) => {
            form.setValue("installation_date", date ? date.toISOString().split("T")[0] : "");
          }}
          onTimeChange={(time) => {
            form.setValue("installation_time", time);
          }}
        />
      </div>
    </div>
  );
}
