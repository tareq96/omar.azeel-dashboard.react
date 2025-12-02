import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Check, LoaderCircleIcon, PlusIcon } from "lucide-react";
import { ResponsiveDialog, StepperFooterControls } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import {
  Stepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperPanel,
  StepperContent,
} from "@/components/ui/stepper";
import { useUsersGetDrivers } from "@/services/api/generated/users/users";
import {
  useTripsStore,
  useTripsTripPath,
  useTripsTripCode,
} from "@/services/api/generated/trips/trips";
import { toast } from "sonner";

type AddTripDialogProps = {
  onCreated?: () => void;
};

export default function AddTripDialog({ onCreated }: AddTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const { t } = useTranslation();
  const [driverSearch, setDriverSearch] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | undefined>(undefined);
  const [selectedDriverName, setSelectedDriverName] = useState<string>("");
  const [startedAtLocal, setStartedAtLocal] = useState<string>(() =>
    dayjs().format("YYYY-MM-DDTHH:mm"),
  );

  const { data: driversData, isFetching: driversLoading } = useUsersGetDrivers<any>(
    {
      per_page: 10,
      q: driverSearch && driverSearch.trim() ? driverSearch.trim() : undefined,
      status: "Active",
    } as any,
    {
      query: { enabled: open },
    },
  );

  const driverOptions = useMemo(() => {
    const root = driversData as any;
    const listCandidate = Array.isArray(root)
      ? root
      : (root?.data ?? root?.drivers ?? root?.users ?? root?.list ?? root?.items ?? []);
    return (listCandidate as any[]).map((d) => ({
      label: d?.name ?? String(d?.id),
      value: String(d?.id),
    }));
  }, [driversData]);

  React.useEffect(() => {
    if (!selectedDriverId) {
      setSelectedDriverName("");
      return;
    }
    const match = driverOptions.find((o) => o.value === selectedDriverId);
    setSelectedDriverName(match?.label ?? "");
  }, [selectedDriverId, driverOptions]);

  const tripsMutation = useTripsStore();

  const {
    data: tripPath,
    isFetching: pathLoading,
    isError: pathError,
    error: pathErrorObj,
  } = useTripsTripPath<any>(
    { user_id: selectedDriverId ? Number(selectedDriverId) : undefined } as any,
    {
      query: { enabled: open && !!selectedDriverId },
    },
  );

  const {
    data: tripCode,
    isFetching: codeLoading,
    isError: codeError,
    error: codeErrorObj,
    refetch: refetchCode,
  } = useTripsTripCode<any>({ query: { enabled: open } });

  React.useEffect(() => {
    if (open) refetchCode();
  }, [open, refetchCode]);

  React.useEffect(() => {
    if (open) {
      setDriverSearch("");
      setSelectedDriverId(undefined);
      setSelectedDriverName("");
      setActiveStep(1);
    }
  }, [open]);

  const handleCreateTrip = async () => {
    if (!selectedDriverId) return;
    const startedAtIso = startedAtLocal ? dayjs(startedAtLocal).toISOString() : undefined;
    try {
      await tripsMutation.mutateAsync({
        data: {
          user_id: Number(selectedDriverId),
          code: typeof tripCode === "string" ? tripCode : undefined,
          path: typeof tripPath === "string" ? tripPath : undefined,
          status: "Pending",
          started_at: startedAtIso,
          ended_at: null as any,
        },
      });
      toast.success(
        t("trips.addDialog.success", { defaultValue: "Trip has been created successfully" }),
      );
      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage === "Driver already has a pending trip."
          ? t("api.errors.driver_pending_trip", {
              defaultValue: "Driver already has a pending trip.",
            })
          : rawMessage || t("trips.addDialog.error", { defaultValue: "Failed to create trip" });
      toast.error(translated);
    }
  };

  const steps = [
    { title: t("trips.addDialog.step.driver", { defaultValue: "Driver" }) },
    { title: t("trips.addDialog.step.confirmation", { defaultValue: "Confirmation" }) },
  ];

  return (
    <ResponsiveDialog open={open} onOpenChange={(o) => setOpen(o)}>
      <ResponsiveDialog.Trigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          {t("trips.addDialog.trigger", { defaultValue: "Add Trip" })}
        </Button>
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("trips.addDialog.title", { defaultValue: "Add Trip" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Stepper
            value={activeStep}
            onValueChange={setActiveStep}
            indicators={{
              completed: <Check className="size-4" />,
              loading: <LoaderCircleIcon className="size-4 animate-spin" />,
            }}
            className="space-y-8"
          >
            <StepperNav>
              {steps.map((step, index) => (
                <StepperItem key={index} step={index + 1} className="relative flex-1 items-start">
                  <StepperTrigger className="flex flex-col gap-2.5">
                    <StepperIndicator>{index + 1}</StepperIndicator>
                    <StepperTitle>{step.title}</StepperTitle>
                  </StepperTrigger>
                  {steps.length > index + 1 && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 right-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="text-sm">
              <StepperContent value={1}>
                <Combobox
                  options={driverOptions}
                  value={selectedDriverId}
                  onChange={setSelectedDriverId}
                  placeholder={
                    driversLoading
                      ? t("trips.addDialog.loadingDrivers", { defaultValue: "Loading drivers..." })
                      : t("trips.addDialog.selectDriver", { defaultValue: "Select a driver" })
                  }
                  searchValue={driverSearch}
                  onSearchChange={setDriverSearch}
                  className="w-full"
                />
              </StepperContent>

              <StepperContent value={2}>
                <div className="mb-4 grid grid-cols-[50px_1fr] gap-x-4 gap-y-2">
                  <span className="font-medium">
                    {t("trips.fields.code", { defaultValue: "Code:" })}
                  </span>
                  <span>
                    {codeLoading
                      ? t("common.loading", { defaultValue: "Loading..." })
                      : codeError
                        ? (codeErrorObj as any)?.message ||
                          t("api.unknownError", { defaultValue: "An unexpected error occurred." })
                        : tripCode ||
                          t("trips.addDialog.willBeGenerated", {
                            defaultValue: "Will be generated",
                          })}
                  </span>
                  <span className="font-medium">
                    {t("trips.fields.path", { defaultValue: "Path:" })}
                  </span>
                  <span>
                    {pathLoading
                      ? t("common.loading", { defaultValue: "Loading..." })
                      : pathError
                        ? (pathErrorObj as any)?.message ||
                          t("api.unknownError", { defaultValue: "An unexpected error occurred." })
                        : tripPath ||
                          t("trips.addDialog.willBeGenerated", {
                            defaultValue: "Will be generated",
                          })}
                  </span>
                  <span className="font-medium">
                    {t("trips.fields.driver", { defaultValue: "Driver:" })}
                  </span>
                  <span className="truncate">{selectedDriverName || "-"}</span>
                </div>
              </StepperContent>
            </StepperPanel>
          </Stepper>
        </ResponsiveDialog.Body>

        <ResponsiveDialog.Footer>
          <StepperFooterControls
            activeStep={activeStep}
            totalSteps={2}
            setActiveStep={setActiveStep}
            canProceed={!!selectedDriverId}
            isSubmitting={tripsMutation.isPending}
            onSubmit={handleCreateTrip}
            t={t}
            labels={{
              submit: t("trips.actions.createTrip", { defaultValue: "Create Trip" }),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
