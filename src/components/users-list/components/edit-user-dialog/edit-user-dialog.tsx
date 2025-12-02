import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ResponsiveDialog, StepperFooterControls } from "@/components/common";
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
import { Check, UserIcon, ImageIcon, Shield, ClipboardList, LoaderCircleIcon } from "lucide-react";
import {
  useAdminUsersUpdate1,
  useUsersShow,
  getUsersGetUsersQueryKey,
} from "@/services/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { UsersStoreBodyStatus } from "@/services/api/generated/azeel.schemas";

import { updateUserSchema, type UpdateUserFormValues } from "./schema";
import InfoStep from "../add-user-dialog/steps/info";
import ImageStep from "../add-user-dialog/steps/image";
import PermissionsStep from "../add-user-dialog/steps/permissions";
import ConfirmationStep from "../add-user-dialog/steps/confirmation";

type EditUserDialogProps = {
  userId: number | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
  initialUser?: any;
};

export default function EditUserDialog({
  userId,
  open,
  onOpenChange,
  onUpdated,
  initialUser,
}: EditUserDialogProps) {
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [activeStep, setActiveStep] = useState(1);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema(t)),
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

  // Fetch user data
  const { data: userData, isFetching: isLoadingUser } = useUsersShow<any>(Number(userId || 0), {
    query: { enabled: open && !!userId },
  });

  const user = useMemo(() => {
    const apiUser = (userData as any) || {};
    return {
      ...apiUser,
      ...(initialUser || {}),
    };
  }, [userData, initialUser]);

  // Populate form with user data when it's loaded
  useEffect(() => {
    if (user && user.id) {
      const statusValue =
        user.status === UsersStoreBodyStatus.Active || user.status === UsersStoreBodyStatus.Inactive
          ? user.status
          : UsersStoreBodyStatus.Active;

      form.reset({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        password_confirmation: "",
        status: statusValue,
        job_title: user.job_title || "",
        image: user.image || "",
        permissions: Array.isArray(user.permissions)
          ? user.permissions.map((p: any) =>
              typeof p === "object" && p !== null && "id" in p ? String(p.id) : String(p),
            )
          : [],
      });
    }
  }, [user, form]);

  const usersUpdateJson = useAdminUsersUpdate1();
  const usersUpdateMultipart = useAdminUsersUpdate1({
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
  const watchedPassword = form.watch("password") || "";
  const watchedPasswordConfirmation = form.watch("password_confirmation") || "";

  // Step validations
  const canProceedInfo =
    watchedName &&
    watchedEmail &&
    watchedMobile &&
    // If password is provided, both must be >= 8 and match
    ((!watchedPassword && !watchedPasswordConfirmation) ||
      (watchedPassword.length >= 8 &&
        watchedPasswordConfirmation.length >= 8 &&
        watchedPassword === watchedPasswordConfirmation));

  const isSubmitting = usersUpdateJson.isPending || usersUpdateMultipart.isPending;

  async function onSubmit(values: UpdateUserFormValues) {
    if (!userId) return;

    try {
      if (imageFile) {
        // Use FormData when an image file is present
        const fd = new FormData();
        fd.append("name", values.name.trim());
        fd.append("email", values.email.trim());
        fd.append("mobile", values.mobile.trim());

        // Only include password if it's provided
        if (values.password && values.password.length > 0) {
          fd.append("password", values.password);
          fd.append("password_confirmation", values.password_confirmation || "");
        }

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

        await usersUpdateMultipart.mutateAsync({ user: userId, data: fd as any });
      } else {
        // Use JSON when no image file
        const userData: any = {
          name: values.name.trim(),
          email: values.email.trim(),
          mobile: values.mobile.trim(),
          type: "Customer",
          status: values.status as any,
        };

        // Only include password if it's provided
        if (values.password && values.password.length > 0) {
          userData.password = values.password;
          userData.password_confirmation = values.password_confirmation;
        }

        if (values.job_title && values.job_title.trim().length > 0) {
          userData.job_title = values.job_title.trim();
        }

        if (values.permissions && values.permissions.length > 0) {
          userData.permissions = values.permissions;
        }

        await usersUpdateJson.mutateAsync({ user: userId, data: userData });
      }

      toast.success(t("users.editDialog.success", { defaultValue: "User updated successfully" }));

      // Invalidate users query to refresh the list
      try {
        queryClient.invalidateQueries({ queryKey: getUsersGetUsersQueryKey() as any });
      } catch {}

      onOpenChange(false);
      onUpdated?.();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage || t("users.editDialog.error", { defaultValue: "Failed to update user" });
      toast.error(translated);
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("users.editDialog.title", { defaultValue: "Edit User" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          {isLoadingUser ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircleIcon className="size-8 animate-spin" />
            </div>
          ) : (
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
                      <InfoStep form={form} canProceed={!!canProceedInfo} isEdit={true} />
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
          )}
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
              submit: t("users.editDialog.confirmation.update", { defaultValue: "Update User" }),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
