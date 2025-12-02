import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ReadonlyField } from "@/components/common/ReadonlyField";
import { TripLocationMap } from "@/components/trips-details/TripLocationMap";

export function TripInfoCard({ trip }: { trip: any }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("trips.details.general.prefixedTitle", { defaultValue: "Code & Path" })}
        </CardTitle>
        <CardDescription>
          {t("trips.details.general.prefixed", { defaultValue: "Prefixed (read-only)" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField
            label={t("trips.fields.code", { defaultValue: "Code" })}
            value={trip?.code ? String(trip.code) : "-"}
          />
          <ReadonlyField
            label={t("trips.fields.path", { defaultValue: "Path" })}
            value={trip?.path ? String(trip.path) : "-"}
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField
            label={t("trips.fields.pickupOrders", { defaultValue: "Pickup Orders" })}
            value={trip?.pickup_orders_count ? String(trip.pickup_orders_count) : "0"}
          />
          <ReadonlyField
            label={t("trips.fields.dropOffOrders", { defaultValue: "Drop Off Orders" })}
            value={trip?.drop_off_orders_count ? String(trip.drop_off_orders_count) : "0"}
          />
        </div>
      </CardContent>
      <CardFooter>
        <TripLocationMap trip={trip} />
      </CardFooter>
    </Card>
  );
}
