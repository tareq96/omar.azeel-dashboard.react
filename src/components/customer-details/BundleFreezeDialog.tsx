import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ResponsiveDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  useUsersUpdateSuspension,
  getUsersShowCustomerQueryKey,
} from "@/services/api/generated/users/users";

interface BundleFreezeDialogProps {
  customerId: number;
  /**
   * Current suspension state for this customer (derived from membership)
   */
  isSuspended: boolean;
  /**
   * Disable the trigger (e.g. while customer is still loading)
   */
  disabled?: boolean;
}

export function BundleFreezeDialog({
  customerId,
  isSuspended,
  disabled,
}: BundleFreezeDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const updateSuspensionMutation = useUsersUpdateSuspension();

  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(async () => {
    try {
      const nextSuspension = !isSuspended;

      const res = (await updateSuspensionMutation.mutateAsync({
        user: customerId,
        data: { suspension: nextSuspension },
      })) as unknown as { success?: string };

      const apiSuccessMsg = res?.success || undefined;

      toast.success(
        t("usersTable.columns.suspension.toast.apiSuccess", {
          defaultValue:
            apiSuccessMsg ||
            t("usersTable.columns.suspension.toast.success", {
              defaultValue: "Suspension updated",
            }),
        }),
      );

      await queryClient.invalidateQueries({
        queryKey: getUsersShowCustomerQueryKey(customerId),
        exact: false,
      });

      setOpen(false);
    } catch (error: any) {
      toast.error(
        t("usersTable.columns.suspension.toast.error", {
          defaultValue: "Failed to update suspension",
        }),
      );
    }
  }, [customerId, isSuspended, t, updateSuspensionMutation, queryClient]);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialog.Trigger asChild>
        <Button
          variant="destructive"
          disabled={disabled || updateSuspensionMutation.isPending}
        >
          {t("customer.summary.freeze", { defaultValue: "Freeze" })}
        </Button>
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="max-w-md">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("common.confirm", { defaultValue: "Confirm" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <ResponsiveDialog.Description>
            {t("customer.bundle.freezeConfirm", {
              defaultValue:
                "Are you sure you want to update the freeze status for this customer?",
            })}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <div className="flex w-full flex-col gap-4">
            <ResponsiveDialog.Close asChild disabled={updateSuspensionMutation.isPending}>
              <Button variant="outline">{t("common.cancel")}</Button>
            </ResponsiveDialog.Close>
            <Button
              className="text-white"
              variant="destructive"
              disabled={updateSuspensionMutation.isPending}
              onClick={handleConfirm}
            >
              {updateSuspensionMutation.isPending
                ? t("common.saving", { defaultValue: "Saving..." })
                : t("customer.summary.freeze", { defaultValue: "Freeze" })}
            </Button>
          </div>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}


