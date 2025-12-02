import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { TripGeneralSection } from "@/components/trips-details/TripGeneralSection";
import { TripOrdersSection } from "@/components/trips-details/TripOrdersSection";
import { TripAuditsSection } from "@/components/trips-details/TripAuditsSection";

function TripDetailsPage() {
  const { tripId } = Route.useParams();
  const id = Number(tripId);
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs defaultValue="general" className="flex h-full flex-col">
        <TabsList>
          <TabsTrigger value="general">
            {t("trips.details.tabs.general", { defaultValue: "General" })}
          </TabsTrigger>
          <TabsTrigger value="orders">
            {t("trips.details.tabs.allOrders", { defaultValue: "All Orders" })}
          </TabsTrigger>
          <TabsTrigger value="audits">
            {t("trips.details.tabs.tripAudits", { defaultValue: "Trip Audits" })}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-2">
          <TripGeneralSection tripId={id} />
        </TabsContent>
        <TabsContent value="orders" className="mt-2">
          <TripOrdersSection tripId={id} />
        </TabsContent>
        <TabsContent value="audits" className="mt-2">
          <TripAuditsSection tripId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/trips/$tripId")({
  component: TripDetailsPage,
});
