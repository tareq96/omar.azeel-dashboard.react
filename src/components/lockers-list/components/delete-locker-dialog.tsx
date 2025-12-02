import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  useLockersDestroy,
  getLockersLockersListQueryKey,
} from "@/services/api/generated/lockers/lockers";
import { useQueryClient } from "@tanstack/react-query";
import type { DataTableRowAction } from "@/types/data-table";
import type { LockerRow, LockersDataTableRowAction } from "@/components/lockers-list/types";

type DeleteLockerDialogProps = {
  rowAction: DataTableRowAction<LockerRow, LockersDataTableRowAction> | null;
  onClose: () => void;
};

export default function DeleteLockerDialog({ rowAction, onClose }: DeleteLockerDialogProps) {
  const open = Boolean(rowAction && rowAction.variant === "delete");
  const current = rowAction?.row?.original as LockerRow | undefined;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const destroyMutation = useLockersDestroy();

  const isSubmitting = destroyMutation.isPending;

  const onConfirm = async () => {
    if (!current) return;
    try {
      await destroyMutation.mutateAsync({ locker: current.id });
      toast.success(
        t("lockers.deleteDialog.toast.success", { defaultValue: "Locker deleted successfully" }),
      );
      try {
        queryClient.invalidateQueries({ queryKey: getLockersLockersListQueryKey() as any });
      } catch {}
      onClose();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage ||
        t("lockers.deleteDialog.toast.error", { defaultValue: "Failed to delete locker" });
      toast.error(translated);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("lockers.deleteDialog.title", { defaultValue: "Delete Locker" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <ResponsiveDialog.Description>
            {t("lockers.deleteDialog.description", {
              defaultValue: "Are you sure you want to delete locker {{code}}?",
              code: current?.code ?? String(current?.id ?? ""),
            })}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <div className="flex w-full flex-col gap-4">
            <ResponsiveDialog.Close asChild disabled={isSubmitting}>
              <Button variant="outline">{t("common.cancel")}</Button>
            </ResponsiveDialog.Close>
            <Button
              className="text-white"
              variant="destructive"
              disabled={isSubmitting}
              onClick={onConfirm}
            >
              {isSubmitting ? t("common.deleting") : t("common.delete")}
            </Button>
          </div>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
