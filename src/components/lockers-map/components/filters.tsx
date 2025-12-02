import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

type Zone = {
  id: number;
  address: string;
};

type Driver = {
  id: number;
  name: string;
};

type CustomerStatus = {
  key: string;
  label: string;
};

type DaysOption = {
  key: string;
  label: string;
};

type Props = {
  zones: Zone[];
  drivers: Driver[];
  customerStatuses: CustomerStatus[];
  daysOptions: DaysOption[];
  selectedZones: string[];
  setSelectedZones: (zones: string[]) => void;
  selectedDrivers: string[];
  setSelectedDrivers: (drivers: string[]) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDays: string;
  setSelectedDays: (days: string) => void;
  onReset: () => void;
};

export default function LockersMapFilters({
  zones,
  drivers,
  customerStatuses,
  daysOptions,
  selectedZones,
  setSelectedZones,
  selectedDrivers,
  setSelectedDrivers,
  selectedStatus,
  setSelectedStatus,
  selectedDays,
  setSelectedDays,
  onReset,
}: Props) {
  const { t } = useTranslation();

  const zoneOptions = zones.map((zone) => ({
    value: String(zone.id),
    label: zone.address,
  }));

  const driverOptions = drivers.map((driver) => ({
    value: String(driver.id),
    label: driver.name,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t("lockers.map.filters.title", { defaultValue: "Filters" })}
        </h2>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {t("common.reset", { defaultValue: "Reset" })}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Zones Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {t("lockers.map.filters.zones", { defaultValue: "Zones" })}
          </label>
          <MultiSelect
            options={zoneOptions}
            selected={selectedZones}
            onChange={setSelectedZones}
            placeholder={t("common.selectAll", { defaultValue: "Select All" })}
            searchPlaceholder={t("common.search", { defaultValue: "Search..." })}
            emptyMessage={t("common.noResults", { defaultValue: "No results found" })}
          />
        </div>

        {/* Drivers Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {t("lockers.map.filters.drivers", { defaultValue: "Drivers" })}
          </label>
          <MultiSelect
            options={driverOptions}
            selected={selectedDrivers}
            onChange={setSelectedDrivers}
            placeholder={t("common.selectAll", { defaultValue: "Select All" })}
            searchPlaceholder={t("common.search", { defaultValue: "Search..." })}
            emptyMessage={t("common.noResults", { defaultValue: "No results found" })}
          />
        </div>

        {/* Customer Status Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {t("lockers.map.filters.customerStatus", { defaultValue: "Customer Status" })}
          </label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">{t("common.all", { defaultValue: "All" })}</SelectItem>
              {customerStatuses
                .filter((status) => status.key.toLowerCase() !== "all")
                .map((status) => (
                  <SelectItem key={status.key} value={status.key}>
                    {status.key === "0"
                      ? t("lockers.map.filters.options.active", { defaultValue: "Active" })
                      : status.key === "1"
                        ? t("lockers.map.filters.options.suspended", { defaultValue: "Suspended" })
                        : status.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Days Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {t("lockers.map.filters.days", { defaultValue: "Recurring Days" })}
          </label>
          <Select value={selectedDays} onValueChange={setSelectedDays}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">{t("common.all", { defaultValue: "All" })}</SelectItem>
              {daysOptions
                .filter((option) => option.key.toLowerCase() !== "all")
                .map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.key === "Sun, Tue, Thu"
                      ? t("lockers.map.filters.options.sunTueThu", {
                          defaultValue: "Sun, Tue, Thu",
                        })
                      : option.key === "Sat, Mon, Wed"
                        ? t("lockers.map.filters.options.satMonWed", {
                            defaultValue: "Sat, Mon, Wed",
                          })
                        : option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
