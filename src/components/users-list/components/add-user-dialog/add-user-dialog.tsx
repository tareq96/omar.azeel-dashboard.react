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
  ImageIcon,
  Shield,
  ClipboardList,
  LoaderCircleIcon,
  PlusIcon,
} from "lucide-react";
import { useUsersStore, getUsersGetUsersQueryKey } from "@/services/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { UsersStoreBodyStatus, UsersStoreBodyType } from "@/services/api/generated/azeel.schemas";

import { createUserSchema, type CreateUserFormValues } from "./schema";
import InfoStep from "./steps/info";
import ImageStep from "./steps/image";
import PermissionsStep from "./steps/permissions";
import ConfirmationStep from "./steps/confirmation";

type AddUserDialogProps = {
  onCreated?: () => void;
};

export default function AddUserDialog({ onCreated }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [activeStep, setActiveStep] = useState(1);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
      status: UsersStoreBodyStatus.Active,
      job_title: "",
      image: "",
      permissions: [],
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const usersStoreJson = useUsersStore();
  const usersStoreMultipart = useUsersStore({
    request: { headers: { "Content-Type": "multipart/form-data" } },
  });

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
      setImageFile(undefined);
      setActiveStep(1);
    }
  }, [open, form]);

  const stepIcons = useMemo(
    () => [
      <UserIcon className="size-4" />,
      <ImageIcon className="size-4" />,
      <Shield className="size-4" />,
      <ClipboardList className="size-4" />,
    ],
    [],
  );

  const steps = [
    { title: t("users.addDialog.step.info") },
    { title: t("users.addDialog.step.image") },
    { title: t("users.addDialog.step.permissions") },
    { title: t("users.addDialog.step.confirmation") },
  ];

  // Watch form values for validation
  const watchedName = form.watch("name");
  const watchedEmail = form.watch("email");
  const watchedMobile = form.watch("mobile");
  const watchedPassword = form.watch("password");
  const watchedPasswordConfirmation = form.watch("password_confirmation");

  // Step validations
  const canProceedInfo =
    watchedName &&
    watchedEmail &&
    watchedMobile &&
    watchedPassword.length >= 8 &&
    watchedPasswordConfirmation.length >= 8 &&
    watchedPassword === watchedPasswordConfirmation;

  const isSubmitting = usersStoreJson.isPending || usersStoreMultipart.isPending;

  async function onSubmit(values: CreateUserFormValues) {
    try {
      if (imageFile) {
        // Use FormData when an image file is present
        const fd = new FormData();
        fd.append("name", values.name.trim());
        fd.append("email", values.email.trim());
        fd.append("mobile", values.mobile.trim());
        fd.append("password", values.password);
        fd.append("password_confirmation", values.password_confirmation);
        fd.append("type", "Customer");
        fd.append("status", values.status as any);

        if (values.job_title && values.job_title.trim().length > 0) {
          fd.append("job_title", values.job_title.trim());
        }

        fd.append("image", imageFile);

        // Add permissions if any
        if (values.permissions && values.permissions.length > 0) {
          values.permissions.forEach((permId) => {
            fd.append("permissions[]", String(permId));
          });
        }

        await usersStoreMultipart.mutateAsync({ data: fd as any });
      } else {
        // Use JSON when no image file
        const userData: any = {
          name: values.name.trim(),
          email: values.email.trim(),
          mobile: values.mobile.trim(),
          password: values.password,
          password_confirmation: values.password_confirmation,
          type: "Customer",
          status: values.status as any,
        };

        if (values.job_title && values.job_title.trim().length > 0) {
          userData.job_title = values.job_title.trim();
        }

        if (values.permissions && values.permissions.length > 0) {
          userData.permissions = values.permissions;
        }

        await usersStoreJson.mutateAsync({ data: userData });
      }

      toast.success(t("users.addDialog.success"));

      // Invalidate users query to refresh the list
      try {
        queryClient.invalidateQueries({ queryKey: getUsersGetUsersQueryKey() as any });
      } catch {}

      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated = rawMessage || t("users.addDialog.error");
      toast.error(translated);
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={(o) => setOpen(o)}>
      <ResponsiveDialog.Trigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          {t("users.addDialog.trigger")}
        </Button>
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>{t("users.addDialog.title")}</ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
              <Stepper
                value={activeStep}
                onValueChange={setActiveStep}
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
                    if (index === 2) stepDisabled = !canProceedInfo;
                    if (index === 3) stepDisabled = !canProceedInfo;

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
                    <ImageStep form={form} setImageFile={setImageFile} />
                  </StepperContent>

                  <StepperContent value={3}>
                    <PermissionsStep form={form} canProceed={true} />
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
            setActiveStep={setActiveStep}
            canProceed={!!canProceedInfo}
            isSubmitting={isSubmitting}
            onSubmit={form.handleSubmit(onSubmit)}
            t={t}
            labels={{
              submit: t("users.addDialog.confirmation.create"),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
