import * as React from "react";
import { useTranslation } from "react-i18next";
import { useTripsOrders } from "@/services/api/generated/trips/trips";
import { Button } from "@/components/ui/button";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";

export function TripLocationMap({ trip }: { trip: any }) {
  const { t } = useTranslation();
  const tripId = Number(trip?.id || 0);
  const { data: ordersRaw } = useTripsOrders<any>(tripId, { per_page: 50 } as any, {
    query: { enabled: !!tripId },
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  const toggleFullscreen = React.useCallback(() => {
    if (!isFullscreen) {
      const el = containerRef.current as any;
      if (el?.requestFullscreen) el.requestFullscreen();
    } else {
      if ((document as any).exitFullscreen) (document as any).exitFullscreen();
    }
  }, [isFullscreen]);

  React.useEffect(() => {
    const handler = () => {
      const active =
        !!document.fullscreenElement && document.fullscreenElement === containerRef.current;
      setIsFullscreen(active);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const tripCoords = React.useMemo(() => {
    const latRaw = (trip as any)?.lat;
    const lngRaw = (trip as any)?.lng;
    if (latRaw == null || lngRaw == null) return undefined;
    const lat = typeof latRaw === "string" ? Number(latRaw) : latRaw;
    const lng = typeof lngRaw === "string" ? Number(lngRaw) : lngRaw;
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    )
      return undefined;
    return { lat, lng } as const;
  }, [trip?.lat, trip?.lng]);

  const orderCoords = React.useMemo(() => {
    const root = ordersRaw as any;
    const list = Array.isArray(root) ? root : (root?.data ?? root?.items ?? root?.list ?? []);
    const first = (list || []).find(
      (r: any) => (r?.lat ?? r?.latitude) && (r?.lng ?? r?.longitude),
    );
    if (!first) return undefined;
    const latRaw = first?.lat ?? first?.latitude;
    const lngRaw = first?.lng ?? first?.longitude;
    const lat = typeof latRaw === "string" ? Number(latRaw) : latRaw;
    const lng = typeof lngRaw === "string" ? Number(lngRaw) : lngRaw;
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    )
      return undefined;
    return { lat, lng } as const;
  }, [ordersRaw]);

  const pathCoords = React.useMemo(() => {
    const p = trip?.path;
    if (!p || typeof p !== "string") return undefined;
    const parts = p.split(",").map((s) => s.trim());
    if (parts.length < 2) return undefined;
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return undefined;
    return { lat, lng } as const;
  }, [trip?.path]);

  const fallbackAddress = React.useMemo(() => {
    const root = ordersRaw as any;
    const list = Array.isArray(root) ? root : (root?.data ?? root?.items ?? root?.list ?? []);
    const addr = (list || []).find((r: any) => r?.address)?.address;
    const p = trip?.path;
    return addr || (typeof p === "string" ? p : undefined);
  }, [ordersRaw, trip?.path]);

  const mapQuery = React.useMemo(() => {
    if (tripCoords) return `${tripCoords.lat},${tripCoords.lng}`;
    if (orderCoords) return `${orderCoords.lat},${orderCoords.lng}`;
    if (pathCoords) return `${pathCoords.lat},${pathCoords.lng}`;
    if (fallbackAddress) return String(fallbackAddress);
    return undefined;
  }, [tripCoords, orderCoords, pathCoords, fallbackAddress]);

  const mapCenter = React.useMemo(() => {
    if (tripCoords) return tripCoords;
    if (orderCoords) return orderCoords;
    if (pathCoords) return pathCoords;
    return undefined;
  }, [tripCoords, orderCoords, pathCoords]);

  if (!mapQuery) {
    return (
      <div className="text-muted-foreground mt-4 text-sm">
        {t("trips.details.general.noLocation", { defaultValue: "No location data" })}
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <div
        ref={containerRef}
        className="relative h-[300px] w-full overflow-hidden rounded-md border"
      >
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            aria-label={t("common.fullscreen", { defaultValue: "Fullscreen" })}
            size="icon"
            variant="secondary"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2Icon className="size-4" />
            ) : (
              <Maximize2Icon className="size-4" />
            )}
          </Button>
        </div>
        <iframe
          title="trip-map"
          key={mapCenter ? `@${mapCenter.lat},${mapCenter.lng}` : `q-${mapQuery}`}
          src={
            mapCenter
              ? `https://www.google.com/maps/@${mapCenter.lat},${mapCenter.lng},14z?hl=en&output=embed`
              : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery!)}&output=embed`
          }
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
