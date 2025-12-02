import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useItemsDestroy, getItemsItemsListQueryKey } from "@/services/api/generated/items/items";
import { useQueryClient } from "@tanstack/react-query";
import type { DataTableRowAction } from "@/types/data-table";
import type { ItemRow, ItemsDataTableRowAction } from "@/components/items-list/types";

type DeleteItemDialogProps = {
  rowAction: DataTableRowAction<ItemRow, ItemsDataTableRowAction> | null;
  onClose: () => void;
};

export default function DeleteItemDialog({ rowAction, onClose }: DeleteItemDialogProps) {
  const open = Boolean(rowAction && rowAction.variant === "delete");
  const current = rowAction?.row?.original as ItemRow | undefined;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const destroyMutation = useItemsDestroy();

  const isSubmitting = destroyMutation.isPending;

  const onConfirm = async () => {
    if (!current) return;
    try {
      await destroyMutation.mutateAsync({ item: current.id });
      toast.success(
        t("items.deleteDialog.toast.success", { defaultValue: "Item deleted successfully" }),
      );
      try {
        queryClient.invalidateQueries({ queryKey: getItemsItemsListQueryKey() as any });
      } catch {}
      onClose();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage ||
        t("items.deleteDialog.toast.error", { defaultValue: "Failed to delete item" });
      toast.error(translated);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("items.deleteDialog.title", { defaultValue: "Delete Item" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <ResponsiveDialog.Description>
            {t("items.deleteDialog.description", {
              defaultValue: "Are you sure you want to delete item {{name}}?",
              name: current?.name ?? String(current?.id ?? ""),
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
