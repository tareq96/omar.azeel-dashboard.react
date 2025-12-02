import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, Loader2 } from "lucide-react";
import { useLockersGetGeolocationFilters } from "@/services/api/generated/lockers/lockers";
import LockersMapFilters from "./components/filters";
import LockersMapView from "./components/map-view";
import LockersListView from "./components/list-view";

export default function LockersMap() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");

  // Filter states
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDays, setSelectedDays] = useState<string>("all");

  // Fetch filters data
  const filtersQuery = useLockersGetGeolocationFilters();

  const filters = useMemo(() => {
    return {
      zones: selectedZones,
      drivers: selectedDrivers,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      days: selectedDays !== "all" ? selectedDays : undefined,
    };
  }, [selectedZones, selectedDrivers, selectedStatus, selectedDays]);

  const handleResetFilters = () => {
    setSelectedZones([]);
    setSelectedDrivers([]);
    setSelectedStatus("all");
    setSelectedDays("all");
  };

  if (filtersQuery.isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t("lockers.map.title", { defaultValue: "Lockers Geolocation" })}
        </h1>
      </div>

      {/* Filters Section */}
      <Card className="p-6">
        <LockersMapFilters
          zones={filtersQuery.data?.data?.zones || []}
          drivers={filtersQuery.data?.data?.drivers || []}
          customerStatuses={filtersQuery.data?.data?.customer_statuses || []}
          daysOptions={filtersQuery.data?.data?.days_options || []}
          selectedZones={selectedZones}
          setSelectedZones={setSelectedZones}
          selectedDrivers={selectedDrivers}
          setSelectedDrivers={setSelectedDrivers}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          onReset={handleResetFilters}
        />
      </Card>

      {/* Map/List View Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "map" | "list")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            {t("lockers.map.tabs.map", { defaultValue: "Map View" })}
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t("lockers.map.tabs.list", { defaultValue: "List View" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <LockersMapView filters={filters} />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <LockersListView filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
