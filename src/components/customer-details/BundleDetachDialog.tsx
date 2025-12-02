import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ResponsiveDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  useUsersDetachCustomerBundle,
  getUsersShowCustomerQueryKey,
} from "@/services/api/generated/users/users";

interface BundleDetachDialogProps {
  customerId: number;
  /**
   * Whether the customer currently has an attached bundle.
   * Used to disable the trigger when not applicable.
   */
  hasBundle: boolean;
}

export function BundleDetachDialog({ customerId, hasBundle }: BundleDetachDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const detachBundleMutation = useUsersDetachCustomerBundle();

  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (!hasBundle) return;
    try {
      await detachBundleMutation.mutateAsync({ user: customerId });
      toast.success(
        t("customer.bundle.detached", { defaultValue: "Bundle detached successfully" }),
      );

      await queryClient.invalidateQueries({
        queryKey: getUsersShowCustomerQueryKey(customerId),
        exact: false,
      });

      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to detach bundle");
    }
  }, [customerId, hasBundle, detachBundleMutation, queryClient, t]);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialog.Trigger asChild>
        <Button
          variant="secondary"
          className="bg-amber-500 text-white hover:bg-amber-600"
          disabled={detachBundleMutation.isPending || !hasBundle}
        >
          {t("customer.bundle.detach", { defaultValue: "Detach" })}
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
            {t("customer.bundle.confirmDetach", {
              defaultValue: "Are you sure you want to detach the bundle?",
            })}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <div className="flex w-full flex-col gap-4">
            <ResponsiveDialog.Close asChild disabled={detachBundleMutation.isPending}>
              <Button variant="outline">{t("common.cancel")}</Button>
            </ResponsiveDialog.Close>
            <Button
              className="text-white"
              variant="destructive"
              disabled={detachBundleMutation.isPending}
              onClick={handleConfirm}
            >
              {detachBundleMutation.isPending
                ? t("common.deleting", { defaultValue: "Deleting..." })
                : t("customer.bundle.detach", { defaultValue: "Detach" })}
            </Button>
          </div>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}


