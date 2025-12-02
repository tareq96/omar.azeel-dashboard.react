import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { useTripsShow, useAdminTripsUpdate1 } from "@/services/api/generated/trips/trips";
import { useTripForm } from "@/hooks/useTripForm";
import { useDriverSearch } from "@/hooks/useDriverSearch";
import { DateTimeField } from "@/components/common/DateTimeField";
import { TripInfoCard } from "@/components/trips-details/TripInfoCard";
import type { TripsShow200, AdminTripsUpdate1Body } from "@/services/api/generated/azeel.schemas";
import { AdminTripsUpdate1BodyStatus } from "@/services/api/generated/azeel.schemas";

export function TripGeneralSection({ tripId }: { tripId: number }) {
  const { t } = useTranslation();

  const {
    data: tripData,
    isFetching: isLoadingTrip,
    refetch,
  } = useTripsShow<TripsShow200>(tripId, {
    query: { enabled: !!tripId },
  });

  const trip = React.useMemo<TripsShow200 | undefined>(() => tripData ?? undefined, [tripData]);

  const {
    driverOptions,
    isLoading: isLoadingDrivers,
    searchQuery,
    setSearchQuery,
  } = useDriverSearch();
  const { formData, updateField, buildPayload } = useTripForm(trip);
  const updateMutation = useAdminTripsUpdate1();

  const STATUS_OPTIONS = React.useMemo(() => Object.values(AdminTripsUpdate1BodyStatus), []);

  const formatError = React.useCallback(
    (err: unknown) => {
      const anyErr = err as any;
      const msg = anyErr?.response?.data?.message || anyErr?.message;
      if (msg === "Driver already has a pending trip.") {
        return t("api.errors.driver_pending_trip", {
          defaultValue: "Driver already has a pending trip.",
        });
      }
      return msg || t("api.unknownError", { defaultValue: "An unexpected error occurred." });
    },
    [t],
  );

  const handleSave = React.useCallback(async () => {
    const payload = buildPayload() as AdminTripsUpdate1Body;
    try {
      await updateMutation.mutateAsync({ trip: tripId, data: payload });
      toast.success(t("common.saved", { defaultValue: "Saved" }));
      await refetch();
    } catch (error) {
      toast.error(formatError(error));
    }
  }, [buildPayload, updateMutation, tripId, t, refetch, formatError]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("trips.details.tabs.general", { defaultValue: "General" })}</CardTitle>
          <CardDescription>
            {t("trips.details.general.description", { defaultValue: "Edit trip information" })}
          </CardDescription>
          <CardAction>
            <Button onClick={handleSave} disabled={updateMutation.isPending || isLoadingTrip}>
              {t("common.save", { defaultValue: "Save" })}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <span className="text-sm font-medium">
                {t("trips.fields.driver", { defaultValue: "Driver" })}
              </span>
              <Combobox
                options={driverOptions}
                value={formData.driverId}
                onChange={(value) => updateField("driverId", value)}
                placeholder={
                  isLoadingDrivers
                    ? t("trips.addDialog.loadingDrivers", { defaultValue: "Loading drivers..." })
                    : t("trips.addDialog.selectDriver", { defaultValue: "Select a driver" })
                }
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">
                {t("trips.fields.status", { defaultValue: "Status" })}
              </span>
              <Select
                value={formData.status || undefined}
                onValueChange={(v) => updateField("status", v as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("trips.fields.status", { defaultValue: "Status" })} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`tripsTable.columns.status.options.${s}`, {
                        defaultValue: s === "InProgress" ? "In Progress" : s,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DateTimeField
              label={t("trips.fields.startedAt", { defaultValue: "Started at" })}
              date={formData.startedDate}
              time={formData.startedTime}
              onDateChange={(date) => updateField("startedDate", date)}
              onTimeChange={(time) => updateField("startedTime", time)}
            />

            <DateTimeField
              label={t("trips.fields.endedAt", { defaultValue: "Ended at" })}
              date={formData.endedDate}
              time={formData.endedTime}
              onDateChange={(date) => updateField("endedDate", date)}
              onTimeChange={(time) => updateField("endedTime", time)}
            />
          </div>
        </CardContent>
      </Card>

      <TripInfoCard trip={trip} />
    </div>
  );
}
