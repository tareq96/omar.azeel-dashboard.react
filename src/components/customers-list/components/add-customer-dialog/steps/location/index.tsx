import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useAddressesGetZones } from "@/services/api/generated/addresses/addresses";
import { useEffect, useState } from "react";

type LocationStepProps = {
  form: UseFormReturn<CreateCustomerFormValues>;
  canProceed: boolean;
};

export default function LocationStep({ form }: LocationStepProps) {
  const { t } = useTranslation();

  // Fetch zones from the new zones API
  const { data: zonesData } = useAddressesGetZones(
    {},
    {
      query: { staleTime: 5 * 60 * 1000 }, // Cache for 5 minutes
    },
  );

  const zones = zonesData?.data || [];

  // Default center (Amman, Jordan coordinates from old implementation)
  const defaultCenter: [number, number] = [31.9449557, 35.9292774];

  // Watch zone selections and coordinates
  const [homeZoneDetails, setHomeZoneDetails] = useState<any>(null);
  const [workZoneDetails, setWorkZoneDetails] = useState<any>(null);

  const homeZoneValue = form.watch("home_zone");
  const workZoneValue = form.watch("work_zone");
  const homeLat = form.watch("home_lat");
  const homeLng = form.watch("home_lng");
  const workLat = form.watch("work_lat");
  const workLng = form.watch("work_lng");

  // Initialize with default coordinates if not set
  useEffect(() => {
    if (!homeLat || homeLat === 0) {
      form.setValue("home_lat", defaultCenter[0]);
    }
    if (!homeLng || homeLng === 0) {
      form.setValue("home_lng", defaultCenter[1]);
    }
  }, []);

  // Update coordinates when zone is selected
  useEffect(() => {
    if (homeZoneValue) {
      const zone = zones.find((z: any) => z.value === homeZoneValue);
      if (zone && zone.lat !== null && zone.lng !== null) {
        setHomeZoneDetails(zone);
        const lat = typeof zone.lat === "string" ? parseFloat(zone.lat) : zone.lat;
        const lng = typeof zone.lng === "string" ? parseFloat(zone.lng) : zone.lng;
        form.setValue("home_lat", lat);
        form.setValue("home_lng", lng);
      }
    }
  }, [homeZoneValue, zones, form]);

  useEffect(() => {
    if (workZoneValue) {
      const zone = zones.find((z: any) => z.value === workZoneValue);
      if (zone && zone.lat !== null && zone.lng !== null) {
        setWorkZoneDetails(zone);
        const lat = typeof zone.lat === "string" ? parseFloat(zone.lat) : zone.lat;
        const lng = typeof zone.lng === "string" ? parseFloat(zone.lng) : zone.lng;
        form.setValue("work_lat", lat);
        form.setValue("work_lng", lng);
      }
    } else {
      setWorkZoneDetails(null);
    }
  }, [workZoneValue, zones, form]);

  return (
    <div className="space-y-6">
      {/* Home Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("customers.addDialog.sections.homeAddress")}</h3>

        <FormField
          control={form.control}
          name="home_zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customers.addDialog.fields.homeZone")}</FormLabel>
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
                    <SelectValue placeholder={t("customers.addDialog.placeholders.homeZone")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-9999">
                  <SelectItem value="none">{t("common.none")}</SelectItem>
                  {zones.map((zone: any) => (
                    <SelectItem key={zone.value} value={zone.value.toString()}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="home_lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("customers.addDialog.fields.homeLat")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder={t("customers.addDialog.placeholders.homeLat")}
                    value={field.value || ""}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="home_lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("customers.addDialog.fields.homeLng")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder={t("customers.addDialog.placeholders.homeLng")}
                    value={field.value || ""}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Home coordinates display */}
        {homeLat !== undefined && homeLat !== 0 && homeLng !== undefined && homeLng !== 0 && (
          <div className="text-muted-foreground bg-muted/50 rounded-md p-3 text-sm">
            <p>
              <strong>{t("customers.addDialog.fields.homeLat")}:</strong> {homeLat}
            </p>
            <p>
              <strong>{t("customers.addDialog.fields.homeLng")}:</strong> {homeLng}
            </p>
          </div>
        )}
      </div>

      {/* Work Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("customers.addDialog.sections.workAddress")}</h3>

        <FormField
          control={form.control}
          name="work_zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customers.addDialog.fields.workZone")}</FormLabel>
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
                    <SelectValue placeholder={t("customers.addDialog.placeholders.workZone")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-9999">
                  <SelectItem value="none">{t("common.none")}</SelectItem>
                  {zones.map((zone: any) => (
                    <SelectItem key={zone.value} value={zone.value.toString()}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {workZoneValue && workZoneValue !== undefined && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="work_lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("customers.addDialog.fields.workLat")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder={t("customers.addDialog.placeholders.workLat")}
                        value={field.value || ""}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("customers.addDialog.fields.workLng")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder={t("customers.addDialog.placeholders.workLng")}
                        value={field.value || ""}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Work coordinates display */}
            {workLat !== undefined && workLng !== undefined && workLat !== 0 && workLng !== 0 && (
              <div className="text-muted-foreground bg-muted/50 rounded-md p-3 text-sm">
                <p>
                  <strong>{t("customers.addDialog.fields.workLat")}:</strong> {workLat}
                </p>
                <p>
                  <strong>{t("customers.addDialog.fields.workLng")}:</strong> {workLng}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
