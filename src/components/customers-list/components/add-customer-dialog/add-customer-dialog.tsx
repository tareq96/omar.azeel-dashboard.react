import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ResponsiveDialog, StepperFooterControls } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import {
  Check,
  UserIcon,
  MapPinIcon,
  PackageIcon,
  ClipboardList,
  LoaderCircleIcon,
  PlusIcon,
} from "lucide-react";
import {
  useUsersStoreCustomer,
  getUsersGetCustomersQueryKey,
} from "@/services/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { UsersStoreCustomerBodyStatus } from "@/services/api/generated/azeel.schemas";

import { createCustomerSchema, type CreateCustomerFormValues } from "./schema";
import InfoStep from "./steps/info";
import LocationStep from "./steps/location";
import BundleStep from "./steps/bundle";
import ConfirmationStep from "./steps/confirmation";

type AddCustomerDialogProps = {
  onCreated?: () => void;
};

export default function AddCustomerDialog({ onCreated }: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
      status: UsersStoreCustomerBodyStatus.Active,
      home_zone: 0,
      home_lat: 0,
      home_lng: 0,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const storeCustomerJson = useUsersStoreCustomer();

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
      setActiveStep(1);
    }
  }, [open, form]);

  const stepIcons = useMemo(
    () => [
      <UserIcon className="size-4" />,
      <MapPinIcon className="size-4" />,
      <PackageIcon className="size-4" />,
      <ClipboardList className="size-4" />,
    ],
    [],
  );

  const steps = [
    { title: t("customers.addDialog.step.info") },
    { title: t("customers.addDialog.step.location") },
    { title: t("customers.addDialog.step.bundle") },
    { title: t("customers.addDialog.step.confirmation") },
  ];

  // Watch form values for validation
  const watchedName = form.watch("name");
  const watchedEmail = form.watch("email");
  const watchedMobile = form.watch("mobile");
  const watchedPassword = form.watch("password");
  const watchedPasswordConfirmation = form.watch("password_confirmation");
  const watchedHomeZone = form.watch("home_zone");
  const watchedHomeLat = form.watch("home_lat");
  const watchedHomeLng = form.watch("home_lng");
  const watchedActivationDate = form.watch("activation_date");
  const watchedInstallationDate = form.watch("installation_date");
  const watchedInstallationTime = form.watch("installation_time");

  // Step validations
  const canProceedInfo =
    watchedName &&
    watchedEmail &&
    watchedMobile &&
    watchedPassword.length >= 8 &&
    watchedPasswordConfirmation.length >= 8 &&
    watchedPassword === watchedPasswordConfirmation;

  const canProceedLocation = true; // Location is now optional

  const canProceedBundle =
    watchedActivationDate && watchedInstallationDate && watchedInstallationTime;

  const isSubmitting = storeCustomerJson.isPending;

  // Trigger validation when trying to move from bundle step
  const handleStepChange = async (newStep: number) => {
    if (activeStep === 3 && newStep === 4) {
      // Validate bundle step fields before proceeding to confirmation
      const isValid = await form.trigger([
        "activation_date",
        "installation_date",
        "installation_time",
      ]);
      if (isValid) {
        setActiveStep(newStep);
      }
    } else {
      setActiveStep(newStep);
    }
  };

  async function onSubmit(values: CreateCustomerFormValues) {
    try {
      // Use JSON for customer creation
      const customerData: any = {
        name: values.name.trim(),
        email: values.email.trim(),
        mobile: values.mobile.trim(),
        password: values.password,
        password_confirmation: values.password_confirmation,
        status: values.status as any,
        home_zone: values.home_zone,
        home_lat: values.home_lat,
        home_lng: values.home_lng,
      };

      if (values.dynamic_id) {
        customerData.dynamic_id = values.dynamic_id;
      }
      if (values.work_zone) {
        customerData.work_zone = values.work_zone;
      }
      if (values.work_lat !== undefined) {
        customerData.work_lat = values.work_lat;
      }
      if (values.work_lng !== undefined) {
        customerData.work_lng = values.work_lng;
      }
      if (values.bundle_id) {
        customerData.bundle_id = values.bundle_id;
      }
      if (values.grace_period !== undefined) {
        customerData.grace_period = values.grace_period;
      }
      if (values.activation_date) {
        customerData.activation_date = values.activation_date;
      }
      if (values.installation_date) {
        customerData.installation_date = values.installation_date;
      }
      if (values.installation_time) {
        customerData.installation_time = values.installation_time;
      }

      await storeCustomerJson.mutateAsync({ data: customerData });

      toast.success(t("customers.addDialog.success"));

      // Invalidate customers query to refresh the list
      try {
        queryClient.invalidateQueries({ queryKey: getUsersGetCustomersQueryKey() as any });
      } catch {}

      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      const rawMessage = e?.response?.data?.message || e?.message;

      // Handle field-specific validation errors
      if (errors && typeof errors === "object") {
        let firstErrorStep = 4; // Default to current step

        Object.keys(errors).forEach((fieldName) => {
          const fieldErrors = errors[fieldName];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            const errorMessage = fieldErrors[0];

            // Try to translate the error message
            let translatedError = errorMessage;
            if (errorMessage === "The selected home zone is invalid.") {
              translatedError = t("customers.addDialog.validations.homeZoneInvalid");
            } else if (errorMessage === "The selected work zone is invalid.") {
              translatedError = t("customers.addDialog.validations.workZoneInvalid");
            } else if (errorMessage === "The mobile has already been taken.") {
              translatedError = t("customers.addDialog.validations.mobileTaken");
            }

            // Determine which step the error belongs to
            if (
              [
                "name",
                "email",
                "mobile",
                "password",
                "password_confirmation",
                "status",
                "dynamic_id",
              ].includes(fieldName)
            ) {
              firstErrorStep = Math.min(firstErrorStep, 1);
            } else if (
              ["home_zone", "home_lat", "home_lng", "work_zone", "work_lat", "work_lng"].includes(
                fieldName,
              )
            ) {
              firstErrorStep = Math.min(firstErrorStep, 2);
            } else if (
              [
                "bundle_id",
                "grace_period",
                "activation_date",
                "installation_date",
                "installation_time",
              ].includes(fieldName)
            ) {
              firstErrorStep = Math.min(firstErrorStep, 3);
            }

            // Set the error on the specific field
            form.setError(fieldName as any, {
              type: "manual",
              message: translatedError,
            });
          }
        });

        // Navigate to the first step with errors
        if (firstErrorStep < 4) {
          setActiveStep(firstErrorStep);
        }
      } else {
        // Fallback to general error message
        const translated = rawMessage || t("customers.addDialog.error");
        toast.error(translated);
      }
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={(o) => setOpen(o)}>
      <ResponsiveDialog.Trigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          {t("customers.addDialog.trigger")}
        </Button>
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>{t("customers.addDialog.title")}</ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
              <Stepper
                value={activeStep}
                onValueChange={handleStepChange}
                indicators={{
                  completed: <Check className="size-4" />,
                  loading: <LoaderCircleIcon className="size-4 animate-spin" />,
                }}
                className="flex flex-1 flex-col"
              >
                <StepperNav>
                  {steps.map((step, index) => {
                    let stepDisabled = false;
                    if (index === 1) stepDisabled = !canProceedInfo;
                    if (index === 2) stepDisabled = !canProceedInfo || !canProceedLocation;
                    if (index === 3)
                      stepDisabled = !canProceedInfo || !canProceedLocation || !canProceedBundle;

                    return (
                      <StepperItem
                        key={index}
                        step={index + 1}
                        className="relative flex-1 items-start"
                        disabled={stepDisabled}
                      >
                        <StepperTrigger className="flex flex-col gap-2.5">
                          <StepperIndicator>{stepIcons[index]}</StepperIndicator>
                          <StepperTitle>{step.title}</StepperTitle>
                        </StepperTrigger>
                        {steps.length > index + 1 && (
                          <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 right-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                        )}
                      </StepperItem>
                    );
                  })}
                </StepperNav>

                <StepperPanel className="flex-1 px-2 py-8 text-sm">
                  <StepperContent value={1}>
                    <InfoStep form={form} canProceed={!!canProceedInfo} />
                  </StepperContent>

                  <StepperContent value={2}>
                    <LocationStep form={form} canProceed={!!canProceedLocation} />
                  </StepperContent>

                  <StepperContent value={3}>
                    <BundleStep form={form} canProceed={true} />
                  </StepperContent>

                  <StepperContent value={4}>
                    <ConfirmationStep form={form} />
                  </StepperContent>
                </StepperPanel>
              </Stepper>
            </form>
          </Form>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <StepperFooterControls
            activeStep={activeStep}
            totalSteps={4}
            setActiveStep={handleStepChange}
            canProceed={
              activeStep === 1
                ? !!canProceedInfo
                : activeStep === 2
                  ? !!canProceedLocation
                  : activeStep === 3
                    ? !!canProceedBundle
                    : true
            }
            isSubmitting={isSubmitting}
            onSubmit={form.handleSubmit(onSubmit)}
            t={t}
            labels={{
              submit: t("customers.addDialog.confirmation.create"),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
