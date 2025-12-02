import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import {
  useLockersGetGeolocationMap,
  useLockersSpecifyLocation,
} from "@/services/api/generated/lockers/lockers";
import { toast } from "sonner";

type MapFilters = {
  zones?: string[];
  drivers?: string[];
  status?: string;
  days?: string;
};

type Props = {
  filters: MapFilters;
};

// Default center: Riyadh, Saudi Arabia
const DEFAULT_CENTER = { lat: 24.6818476, lng: 46.6821369 };

export default function LockersMapView({ filters }: Props) {
  const { t } = useTranslation();
  const [searchLat, setSearchLat] = useState("");
  const [searchLng, setSearchLng] = useState("");
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);

  // Prepare params for API
  const params = useMemo(() => {
    const p: any = {};
    if (filters.zones && filters.zones.length > 0) {
      p.zones = filters.zones;
    }
    if (filters.drivers && filters.drivers.length > 0) {
      p.drivers = filters.drivers;
    }
    if (filters.status) {
      p.status = filters.status;
    }
    if (filters.days) {
      p.days = filters.days;
    }
    return p;
  }, [filters]);

  const mapQuery = useLockersGetGeolocationMap(params);
  const specifyLocationMutation = useLockersSpecifyLocation();

  const lockers = mapQuery.data?.data || [];

  // Calculate center from lockers or use default
  useEffect(() => {
    if (lockers.length > 0) {
      const lats = lockers.map((l: any) => parseFloat(l.lat)).filter((lat) => !isNaN(lat));
      const lngs = lockers.map((l: any) => parseFloat(l.lng)).filter((lng) => !isNaN(lng));

      if (lats.length > 0 && lngs.length > 0) {
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }, [lockers]);

  const handleSearchLocation = async () => {
    if (!searchLat.trim() || !searchLng.trim()) {
      toast.error(
        t("lockers.map.errors.emptyLocation", {
          defaultValue: "Please enter both latitude and longitude",
        }),
      );
      return;
    }

    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error(
        t("lockers.map.errors.invalidCoordinates", { defaultValue: "Invalid coordinates" }),
      );
      return;
    }

    try {
      const result = await specifyLocationMutation.mutateAsync({
        data: { lat, lng },
      });

      if (result.data?.lat && result.data?.lng) {
        setMapCenter({
          lat: result.data.lat,
          lng: result.data.lng,
        });
        toast.success(t("lockers.map.messages.locationFound", { defaultValue: "Location found" }));
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      let handled = false;

      if (errors) {
        if (errors.lat) {
          toast.error(
            t("lockers.map.errors.latRange", {
              defaultValue: "The latitude must be between -90 and 90.",
            }),
          );
          handled = true;
        }
        if (errors.lng) {
          toast.error(
            t("lockers.map.errors.lngRange", {
              defaultValue: "The longitude must be between -180 and 180.",
            }),
          );
          handled = true;
        }
      }

      if (!handled) {
        const message =
          error?.response?.data?.message ||
          t("lockers.map.errors.locationNotFound", { defaultValue: "Location not found" });
        toast.error(message);
      }
    }
  };

  // Note: The standard Google Maps embed URL doesn't support multiple custom markers like the Embed API.
  // We will center the map and show a marker at the center location.
  const mapUrl = useMemo(() => {
    if (!mapCenter) return null;

    return `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=12&output=embed`;
  }, [mapCenter]);

  if (mapQuery.isLoading) {
    return (
      <Card className="flex h-[600px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search Location */}
      <Card className="p-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-1 flex-col gap-2 md:flex-row">
            <Input
              placeholder={t("lockers.fields.lat", { defaultValue: "Latitude" })}
              value={searchLat}
              onChange={(e) => setSearchLat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchLocation();
                }
              }}
              type="number"
              step="any"
              className="w-full"
            />
            <Input
              placeholder={t("lockers.fields.lng", { defaultValue: "Longitude" })}
              value={searchLng}
              onChange={(e) => setSearchLng(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchLocation();
                }
              }}
              type="number"
              step="any"
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSearchLocation}
            disabled={specifyLocationMutation.isPending}
            className="w-full gap-2 md:w-auto"
          >
            {specifyLocationMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {t("common.search", { defaultValue: "Search" })}
          </Button>
        </div>
      </Card>

      {/* Map Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-semibold">
            {t("lockers.map.legend.title", { defaultValue: "Legend:" })}
          </span>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500" />
            <span>{t("lockers.map.legend.blue", { defaultValue: "Sun, Tue, Thu" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
            <span>{t("lockers.map.legend.yellow", { defaultValue: "Sat, Mon, Wed" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-orange-500" />
            <span>{t("lockers.map.legend.orange", { defaultValue: "Other Days" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-pink-500" />
            <span>{t("lockers.map.legend.pink", { defaultValue: "No Recurring" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500" />
            <span>{t("lockers.map.legend.red", { defaultValue: "Suspended" })}</span>
          </div>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <div className="relative h-[600px] w-full">
          {mapUrl ? (
            <iframe
              title="lockers-geolocation-map"
              src={mapUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              {t("lockers.map.noLockers", { defaultValue: "No lockers to display" })}
            </div>
          )}
        </div>
      </Card>

      {/* Lockers Count */}
      <div className="text-muted-foreground text-sm">
        {t("lockers.map.totalLockers", {
          defaultValue: "Total Lockers: {{count}}",
          count: lockers.length,
        })}
      </div>
    </div>
  );
}
