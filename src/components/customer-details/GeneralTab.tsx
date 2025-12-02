import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUsersShowCustomer,
  useAdminUsersUpdateCustomer1,
} from "@/services/api/generated/users/users";
import { useAddressesGetZones } from "@/services/api/generated/addresses/addresses";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const customerSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    mobile: z.string().min(1),
    status: z.string(),
    dynamic_id: z.union([z.string(), z.number()]).optional(), // Sometimes API returns number
    grace_period: z.coerce.number().optional(),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    recurs: z.array(z.string()).optional(),
    home_zone: z.coerce.number().optional(),
    home_lat: z.coerce.number().optional(),
    home_lng: z.coerce.number().optional(),
    work_zone: z.coerce.number().optional(),
    work_lat: z.coerce.number().optional(),
    work_lng: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["password_confirmation"],
        message: "Passwords do not match",
      });
    }
  });

type CustomerFormValues = z.infer<typeof customerSchema>;

interface GeneralTabProps {
  customerId: number;
  isEditMode: boolean;
  onEditModeChange: (isEdit: boolean) => void;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function GeneralTab({ customerId, isEditMode, onEditModeChange }: GeneralTabProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: customerData, isLoading } = useUsersShowCustomer(customerId);
  const updateMutation = useAdminUsersUpdateCustomer1();
  const { data: zonesData } = useAddressesGetZones();

  const customer = customerData?.data;
  const zones = zonesData?.data || [];

  const accountTypeLabel = useMemo(() => {
    if (!customer?.type) return undefined;
    return t(`customer.types.${customer.type}`, {
      defaultValue: customer.type,
    });
  }, [customer?.type, t]);

  const currencyLabel = useMemo(() => {
    if (customer?.currency) return customer.currency;
    return t("customer.summary.currency", { defaultValue: "SAR" });
  }, [customer?.currency, t]);

  const accountBalanceDisplay = useMemo(() => {
    if (customer?.balance === undefined || customer?.balance === null) return undefined;
    const raw = customer.balance as unknown as string | number;
    const num = Number(raw);
    if (Number.isNaN(num)) {
      return String(raw);
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [customer?.balance]);

  const accountStatusVariant =
    customer?.status === "Active"
      ? "default"
      : customer?.status === "Pending"
        ? "secondary"
        : "outline";

  const membershipStatusVariant = (() => {
    const ms = customer?.membership_status?.toLowerCase();
    if (ms === "active") return "default" as const;
    if (ms === "pending") return "secondary" as const;
    return "destructive" as const;
  })();

  const form = useForm<CustomerFormValues>({
    // The resolver types are slightly stricter than our schema, so cast to any to avoid noise.
    // Validation behaviour is still fully enforced at runtime by Zod.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      status: "Active",
      dynamic_id: "",
      grace_period: 0,
      recurs: [],
      home_zone: undefined,
      home_lat: undefined,
      home_lng: undefined,
      work_zone: undefined,
      work_lat: undefined,
      work_lng: undefined,
    },
  });

  // Reset form when data loads
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email ?? "",
        mobile: customer.mobile ?? "",
        status: customer.status,
        dynamic_id: customer.dynamic_id ?? "",
        grace_period: customer.grace_period,
        recurs:
          ((customer as any).recurring_days as string[] | undefined) ||
          ((customer as any).recurs as string[] | undefined) ||
          [],
        home_zone: customer.home_zone ?? undefined,
        home_lat:
          customer.home_lat === null || customer.home_lat === undefined
            ? undefined
            : Number(customer.home_lat),
        home_lng:
          customer.home_lng === null || customer.home_lng === undefined
            ? undefined
            : Number(customer.home_lng),
        work_zone: customer.work_zone ?? undefined,
        work_lat:
          customer.work_lat === null || customer.work_lat === undefined
            ? undefined
            : Number(customer.work_lat),
        work_lng:
          customer.work_lng === null || customer.work_lng === undefined
            ? undefined
            : Number(customer.work_lng),
      });
    }
  }, [customer, form]);

  // When entering edit mode, if no zones are selected yet but zones exist,
  // pre-select the first available zone for both home and work.
  useEffect(() => {
    if (!isEditMode || !zones.length) return;

    const currentHome = form.getValues("home_zone");
    const currentWork = form.getValues("work_zone");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstZoneValue = (zones[0] as any)?.value;

    if (firstZoneValue == null) return;

    if (!currentHome) {
      form.setValue("home_zone", Number(firstZoneValue));
    }
    if (!currentWork) {
      form.setValue("work_zone", Number(firstZoneValue));
    }
  }, [isEditMode, zones, form]);

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      // @ts-ignore
      await updateMutation.mutateAsync({ user: customerId, data: values });
      toast.success(t("common.saved", { defaultValue: "Saved successfully" }));
      // Refetch latest customer profile after update so UI reflects new data
      queryClient.invalidateQueries({ queryKey: [`/customers/${customerId}`] });
      onEditModeChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save");
    }
  };

  const MapView = ({ lat, lng }: { lat?: number; lng?: number }) => {
    if (!lat || !lng)
      return (
        <div className="bg-muted flex h-[200px] items-center justify-center rounded-md">
          {t("trips.details.general.noLocation", { defaultValue: "No location data" })}
        </div>
      );
    return (
      <div className="h-[200px] w-full overflow-hidden rounded-md border">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
        ></iframe>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-2 pb-2 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle>
                {t("customer.details.general.title", { defaultValue: "General Information" })}
              </CardTitle>
              {customer && (
                <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-sm">
                  {accountBalanceDisplay && (
                    <>
                      <span className="font-medium" data-testid="customer-balance">
                        {currencyLabel} {accountBalanceDisplay}
                      </span>
                    </>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {customer.status && (
                      <Badge variant={accountStatusVariant} data-testid="customer-status-badge">
                        {t(`customer.statusOptions.${customer.status}`, {
                          defaultValue: customer.status,
                        })}
                      </Badge>
                    )}
                    {!!customer.suspension && (
                      <Badge variant="destructive" data-testid="customer-freeze-badge">
                        {t("customer.summary.freeze", { defaultValue: "Freeze" })}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <Button type="button" variant="outline" onClick={() => onEditModeChange(false)}>
                    {t("common.cancel", { defaultValue: "Cancel" })}
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("common.save", { defaultValue: "Save" })}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => onEditModeChange(true)}>
                  {t("common.edit", { defaultValue: "Edit" })}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("customer.fields.name", { defaultValue: "Name" })}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("customer.fields.email", { defaultValue: "Email" })}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("customer.fields.mobile", { defaultValue: "Mobile" })}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dynamic_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("customer.fields.dynamic_id", { defaultValue: "Dynamic ID" })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value?.toString() || ""}
                      disabled={!isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grace_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("customer.fields.grace_period", { defaultValue: "Grace Period (Days)" })}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={!isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("customer.fields.status")}</FormLabel>
                    <Select
                      key={`status-${customer?.id}-${field.value}`}
                      onValueChange={field.onChange}
                      value={field.value || "Active"}
                      disabled={!isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("customers.addDialog.placeholders.status")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">{t("customer.statusOptions.Active")}</SelectItem>
                        <SelectItem value="Inactive">
                          {t("customer.statusOptions.Inactive")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {isEditMode && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("customer.fields.password", { defaultValue: "Password" })}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("customer.fields.password_confirmation", {
                          defaultValue: "Confirm Password",
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="col-span-2">
              <FormLabel className="my-4 block">
                {t("customer.fields.recurs", { defaultValue: "Recur" })}
              </FormLabel>
              <div className="flex flex-wrap gap-4">
                {WEEK_DAYS.map((day) => (
                  <FormField
                    key={day}
                    control={form.control}
                    name="recurs"
                    render={({ field }) => {
                      return (
                        <FormItem key={day} className="flex flex-row items-start">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day)}
                              disabled={!isEditMode}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), day])
                                  : field.onChange(field.value?.filter((value) => value !== day));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t(`customer.recurs.days.${day}`, { defaultValue: day })}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Home Address */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("customer.details.homeAddress", { defaultValue: "Home Address" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="home_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("customer.fields.home_zone", { defaultValue: "Home Zone" })}
                    </FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={!isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("customer.map.selectZone", {
                              defaultValue: "Select Zone",
                            })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zones.map((zone: any) => (
                          <SelectItem key={zone.value} value={String(zone.value)}>
                            {zone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="home_lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("customer.fields.latitude", { defaultValue: "Latitude" })}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} disabled={!isEditMode} />
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
                      <FormLabel>
                        {t("customer.fields.longitude", { defaultValue: "Longitude" })}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <MapView lat={form.watch("home_lat")} lng={form.watch("home_lng")} />
            </CardContent>
          </Card>

          {/* Work Address */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("customer.details.workAddress", { defaultValue: "Work Address" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="work_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("customer.fields.work_zone", { defaultValue: "Work Zone" })}
                    </FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={!isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("customer.map.selectZone", {
                              defaultValue: "Select Zone",
                            })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zones.map((zone: any) => (
                          <SelectItem key={zone.value} value={String(zone.value)}>
                            {zone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="work_lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("customer.fields.latitude", { defaultValue: "Latitude" })}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} disabled={!isEditMode} />
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
                      <FormLabel>
                        {t("customer.fields.longitude", { defaultValue: "Longitude" })}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <MapView lat={form.watch("work_lat")} lng={form.watch("work_lng")} />
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
