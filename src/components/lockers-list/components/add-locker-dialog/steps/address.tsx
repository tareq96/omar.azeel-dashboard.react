import * as React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";

type ZoneOption = {
  id: number;
  name: string;
  address?: string;
  lat?: string;
  lng?: string;
};

type Props = {
  zonesOptions: ZoneOption[];
  zoneId: string;
  setZoneId: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  lat: string;
  setLat: (v: string) => void;
  lng: string;
  setLng: (v: string) => void;
  canProceedAddress: boolean;
};

export default function AddressStep({
  zonesOptions,
  zoneId,
  setZoneId,
  address,
  setAddress,
  lat,
  setLat,
  lng,
  setLng,
  canProceedAddress,
}: Props) {
  const { t } = useTranslation();

  const zoneOptionsUi = React.useMemo(
    () =>
      zonesOptions.map((z) => ({
        label: z.address || z.name,
        value: String(z.id),
      })),
    [zonesOptions],
  );

  const handleZoneChange = React.useCallback(
    (value: string | undefined) => {
      if (!value) {
        setZoneId("");
        setAddress("");
        setLat("");
        setLng("");
        return;
      }

      setZoneId(value);
      const zone = zonesOptions.find((z) => String(z.id) === value);
      if (zone) {
        setAddress(zone.address || "");
        setLat(zone.lat || "");
        setLng(zone.lng || "");
      }
    },
    [zonesOptions, setZoneId, setAddress, setLat, setLng],
  );

  const mapCenter = React.useMemo(() => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      return { lat: latNum, lng: lngNum };
    }
    return undefined;
  }, [lat, lng]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.zone", { defaultValue: "Zone" })}
          </label>
          <Combobox
            options={zoneOptionsUi}
            value={zoneId || undefined}
            onChange={handleZoneChange}
            placeholder={t("common.select", { defaultValue: "Select" })}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              {t("lockers.fields.lat", { defaultValue: "Latitude" })}
            </label>
            <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="31.9449557" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              {t("lockers.fields.lng", { defaultValue: "Longitude" })}
            </label>
            <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="35.9292774" />
          </div>
        </div>

        {mapCenter && (
          <div className="relative h-[300px] w-full overflow-hidden rounded-md border">
            <iframe
              title="locker-location-map"
              key={`${mapCenter.lat},${mapCenter.lng}`}
              src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  );
}
