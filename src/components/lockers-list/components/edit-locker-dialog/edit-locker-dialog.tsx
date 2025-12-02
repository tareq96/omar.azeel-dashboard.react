import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResponsiveDialog, StepperFooterControls } from "@/components/common";
import { Button } from "@/components/ui/button";
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
import { useQueryClient } from "@tanstack/react-query";
import { Check, Info, MapPin, ClipboardList, LoaderCircleIcon, Edit2Icon } from "lucide-react";
import {
  useAdminLockersUpdate1,
  getLockersLockersListQueryKey,
  useLockersGetCreateFormData,
  useLockersShow,
} from "@/services/api/generated/lockers/lockers";

import InfoStep from "../add-locker-dialog/steps/info";
import AddressStep from "../add-locker-dialog/steps/address";
import ConfirmationStep from "../add-locker-dialog/steps/confirmation";

type EditLockerDialogProps = {
  locker: any;
  onUpdated?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ApiCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  home_zone: number;
};

type ApiZone = {
  id: number;
  address: string;
  lat: string;
  lng: string;
};

type CustomerOption = {
  id: number;
  name: string;
  zone_id: string;
  zone_address: string;
  zone_lat: string;
  zone_lng: string;
};

type ZoneOption = {
  id: number;
  name: string;
  address?: string;
  lat?: string;
  lng?: string;
};

export default function EditLockerDialog({
  locker,
  onUpdated,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: EditLockerDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const [customerId, setCustomerId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string>("");
  const [code, setCode] = useState("");
  const [lockerNumber, setLockerNumber] = useState("");
  const [dynamicId, setDynamicId] = useState("");
  const [lockerPassword, setLockerPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [documentFile, setDocumentFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [documentPreview, setDocumentPreview] = useState<string>("");
  const [customersSearch, setCustomersSearch] = useState<string>("");

  const [zoneId, setZoneId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const lockersUpdateMutation = useAdminLockersUpdate1();

  // Fetch form data including customers, zones, statuses, and unique code
  const formDataQuery = useLockersGetCreateFormData({ query: { enabled: open } });

  // Fetch full locker details
  const lockerDetailsQuery = useLockersShow(locker?.id, {
    query: { enabled: open && !!locker?.id },
  });

  // Map API customers to customer options with zone data
  const customersOptions = useMemo<CustomerOption[]>(() => {
    const apiCustomers = formDataQuery.data?.data?.customers as unknown as
      | ApiCustomer[]
      | undefined;
    const apiZones = formDataQuery.data?.data?.zones as unknown as ApiZone[] | undefined;

    let options: CustomerOption[] = [];

    if (apiCustomers && apiZones) {
      options = apiCustomers.map((customer) => {
        const zone = apiZones.find((z) => z.id === customer.home_zone);
        return {
          id: customer.id,
          name: customer.name,
          zone_id: zone ? String(zone.id) : "",
          zone_address: zone?.address || "",
          zone_lat: zone?.lat || "",
          zone_lng: zone?.lng || "",
        };
      });
    }

    // Ensure current locker user is in the options
    // Accessing data safely with unknown casting if needed, but based on API it should be there
    const responseData = lockerDetailsQuery.data?.data as any;
    const currentUser = responseData?.data?.user;

    if (currentUser && !options.find((o) => o.id === Number(currentUser.id))) {
      const currentZone = responseData?.data?.zone;
      options.push({
        id: Number(currentUser.id),
        name: currentUser.name || String(currentUser.id),
        zone_id: currentZone ? String(currentZone.id) : "",
        zone_address: currentZone?.address || "",
        zone_lat: currentZone?.lat || "",
        zone_lng: currentZone?.lng || "",
      });
    }

    return options;
  }, [formDataQuery.data, lockerDetailsQuery.data]);

  const zonesOptions = useMemo<ZoneOption[]>(() => {
    const apiZones = formDataQuery.data?.data?.zones as unknown as ApiZone[] | undefined;
    if (!apiZones) return [];
    return apiZones.map((zone) => ({
      id: zone.id,
      name: zone.address,
      address: zone.address,
      lat: zone.lat,
      lng: zone.lng,
    }));
  }, [formDataQuery.data]);

  // Filtered customers based on search
  const filteredCustomers = useMemo(() => {
    if (!customersSearch) return customersOptions;
    const search = customersSearch.toLowerCase();
    return customersOptions.filter(
      (c) => c.name.toLowerCase().includes(search) || c.id.toString().includes(search),
    );
  }, [customersOptions, customersSearch]);

  // Initialize form with locker data when dialog opens
  useEffect(() => {
    const responseBody = lockerDetailsQuery.data as any;
    const data = responseBody?.data;

    if (open && data) {
      setCustomerId(data.user_id ? Number(data.user_id) : undefined);
      setStatus(data.status || "");
      setCode(data.code || "");
      setLockerNumber(data.locker_number || "");
      // Handle dynamic_id which can be number or string
      setDynamicId(
        data.dynamic_id !== null && data.dynamic_id !== undefined ? String(data.dynamic_id) : "",
      );
      setLockerPassword(data.locker_password || "");
      setNotes(data.notes || "");
      setZoneId(data.zone_id ? String(data.zone_id) : "");
      setAddress(data.zone?.address || ""); // Prefer zone address from relation
      setLat(data.lat ? String(data.lat) : "");
      setLng(data.lng ? String(data.lng) : "");
      setImagePreview(data.image || "");
      setDocumentPreview(data.document || "");
    } else if (!open) {
      // Reset on close
      setCustomerId(undefined);
      setStatus("");
      setCode("");
      setLockerNumber("");
      setDynamicId("");
      setLockerPassword("");
      setNotes("");
      setZoneId("");
      setAddress("");
      setLat("");
      setLng("");
      setImageFile(undefined);
      setDocumentFile(undefined);
      setImagePreview("");
      setDocumentPreview("");
      setCustomersSearch("");
      setActiveStep(1);
    }
  }, [open, lockerDetailsQuery.data]);

  React.useEffect(() => {
    if (!imageFile) {
      if (open && locker?.image) {
        setImagePreview(locker.image);
      }
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile, open, locker]);

  React.useEffect(() => {
    if (!documentFile) {
      if (open && locker?.document) {
        setDocumentPreview(locker.document);
      }
      return;
    }
    const url = URL.createObjectURL(documentFile);
    setDocumentPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [documentFile, open, locker]);

  const stepIcons = useMemo(
    () => [
      <Info className="size-4" />,
      <MapPin className="size-4" />,
      <ClipboardList className="size-4" />,
    ],
    [],
  );

  const steps = [
    { title: t("lockers.addDialog.step.info", { defaultValue: "Locker Information" }) },
    { title: t("lockers.addDialog.step.address", { defaultValue: "Address" }) },
    { title: t("lockers.addDialog.step.confirmation", { defaultValue: "Confirmation" }) },
  ];

  const statuses = useMemo(() => {
    if (formDataQuery.data?.data?.statuses && formDataQuery.data.data.statuses.length > 0) {
      return formDataQuery.data.data.statuses.map((s) => ({
        value: s.key,
        label: t(`lockers.status.${s.key}`, { defaultValue: s.value }),
      }));
    }
    return [
      { value: "Inactive", label: t("lockers.status.Inactive", { defaultValue: "Inactive" }) },
      { value: "Active", label: t("lockers.status.Active", { defaultValue: "Active" }) },
      { value: "Requested", label: t("lockers.status.Requested", { defaultValue: "Requested" }) },
      { value: "Installed", label: t("lockers.status.Installed", { defaultValue: "Installed" }) },
    ];
  }, [formDataQuery.data, t]);

  const canProceedInfo = Boolean(customerId) && status.trim().length > 0 && code.trim().length > 0;
  const canProceedAddress =
    zoneId.trim().length > 0 && lat.trim().length > 0 && lng.trim().length > 0;

  const isSubmitting = lockersUpdateMutation.isPending;

  const handleCustomerSelected = (id: number) => {
    setCustomerId(id);
    const found = customersOptions.find((d) => d.id === id);
    if (found) {
      setZoneId(found.zone_id || "");
      setAddress(found.zone_address || "");
      setLat(found.zone_lat || "");
      setLng(found.zone_lng || "");
    }
  };

  const statusLabel = React.useMemo(
    () => statuses.find((s) => s.value === status)?.label ?? status,
    [statuses, status],
  );
  const customerName = React.useMemo(() => {
    return (
      customersOptions.find((d) => d.id === customerId)?.name ||
      (customerId ? String(customerId) : "")
    );
  }, [customersOptions, customerId]);

  const handleUpdateLocker = async () => {
    if (!canProceedInfo || !canProceedAddress || !locker?.id) return;
    try {
      await lockersUpdateMutation.mutateAsync({
        locker: locker.id,
        data: {
          _method: "PUT",
          user_id: customerId!,
          status,
          zone_id: Number(zoneId),
          lat: lat ? Number(lat) : null,
          lng: lng ? Number(lng) : null,
          locker_number: lockerNumber.trim().length > 0 ? lockerNumber : null,
          locker_password: lockerPassword.trim().length > 0 ? lockerPassword : null,
          dynamic_id: dynamicId.trim().length > 0 ? dynamicId : null,
          notes: notes.trim().length > 0 ? notes : null,
        } as any,
      });
      toast.success(
        t("lockers.editDialog.success", { defaultValue: "Locker has been updated successfully" }),
      );
      try {
        queryClient.invalidateQueries({ queryKey: getLockersLockersListQueryKey() as any });
      } catch {}
      setOpen(false);
      onUpdated?.();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage || t("lockers.editDialog.error", { defaultValue: "Failed to update locker" });
      toast.error(translated);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={(o) => setOpen(o)}>
      <ResponsiveDialog.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size="icon">
            <Edit2Icon className="size-4" />
          </Button>
        )}
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("lockers.editDialog.title", { defaultValue: "Edit Locker" })}
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
                    <StepperIndicator>{stepIcons[index]}</StepperIndicator>
                    <StepperTitle>{step.title}</StepperTitle>
                  </StepperTrigger>
                  {steps.length > index + 1 && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 right-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="px-2 text-sm">
              <StepperContent value={1}>
                <InfoStep
                  customersOptions={filteredCustomers}
                  customerId={customerId}
                  setCustomerId={handleCustomerSelected}
                  customersSearch={customersSearch}
                  setCustomersSearch={setCustomersSearch}
                  statuses={statuses}
                  status={status}
                  setStatus={setStatus}
                  code={code}
                  setCode={setCode}
                  lockerNumber={lockerNumber}
                  setLockerNumber={setLockerNumber}
                  dynamicId={dynamicId}
                  setDynamicId={setDynamicId}
                  lockerPassword={lockerPassword}
                  setLockerPassword={setLockerPassword}
                  imagePreview={imagePreview}
                  setImageFile={setImageFile}
                  documentPreview={documentPreview}
                  setDocumentFile={setDocumentFile}
                  notes={notes}
                  setNotes={setNotes}
                  canProceedInfo={canProceedInfo}
                />
              </StepperContent>

              <StepperContent value={2}>
                <AddressStep
                  zonesOptions={zonesOptions}
                  zoneId={zoneId}
                  setZoneId={setZoneId}
                  address={address}
                  setAddress={setAddress}
                  lat={lat}
                  setLat={setLat}
                  lng={lng}
                  setLng={setLng}
                  canProceedAddress={canProceedAddress}
                />
              </StepperContent>

              <StepperContent value={3}>
                <ConfirmationStep
                  customerName={customerName}
                  statusLabel={statusLabel}
                  code={code}
                  lockerNumber={lockerNumber}
                  dynamicId={dynamicId}
                  lockerPassword={lockerPassword}
                  imagePreview={imagePreview}
                  documentPreview={documentPreview}
                  notes={notes}
                  address={address}
                  lat={lat}
                  lng={lng}
                />
              </StepperContent>
            </StepperPanel>
          </Stepper>
        </ResponsiveDialog.Body>

        <ResponsiveDialog.Footer>
          <StepperFooterControls
            activeStep={activeStep}
            totalSteps={3}
            setActiveStep={setActiveStep}
            canProceed={activeStep === 1 ? canProceedInfo : canProceedInfo && canProceedAddress}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateLocker}
            t={t}
            labels={{
              submit: t("lockers.editDialog.confirmation.update", {
                defaultValue: "Update Locker",
              }),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
