import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import type { TripRow } from "@/components/trips-list/types";
import { useTripsDestroy } from "@/services/api/generated/trips/trips";
import { toast } from "sonner";

type Props = {
  trip?: TripRow | null;
  refetch?: () => Promise<any> | void;
  onClose?: () => void;
};

export default function TripDeleteDialog({ trip, refetch, onClose }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const destroy = useTripsDestroy();

  const tripId = useMemo(() => (trip?.id != null ? Number(trip.id) : undefined), [trip?.id]);
  const tripCode = useMemo(() => trip?.code ?? "", [trip?.code]);

  const handleClose = useCallback(() => {
    setOpen(false);
    try {
      onClose?.();
    } catch {}
  }, [onClose]);

  const handleConfirm = useCallback(async () => {
    if (!tripId) return;
    try {
      await destroy.mutateAsync({ trip: tripId });
      toast.success(
        t("trips.deleteDialog.toast.success", { defaultValue: "Trip deleted successfully" }),
      );
      try {
        await refetch?.();
      } catch {}
      setOpen(false);
      try {
        onClose?.();
      } catch {}
    } catch (_) {
      toast.error(t("trips.deleteDialog.toast.error", { defaultValue: "Failed to delete trip" }));
    }
  }, [destroy, tripId, refetch, t, onClose]);

  useEffect(() => {
    if (trip && !open) setOpen(true);
  }, [trip]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      if (!val) {
        try {
          onClose?.();
        } catch {}
      }
    },
    [onClose],
  );

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>{t("trips.deleteDialog.title")}</ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <ResponsiveDialog.Description>
            {t("trips.deleteDialog.description", {
              defaultValue: "Are you sure you want to delete trip {{code}}?",
              code: tripCode || "",
            })}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <div className="flex w-full flex-col gap-4">
            <ResponsiveDialog.Close asChild disabled={destroy.isPending}>
              <Button variant="outline">{t("common.cancel")}</Button>
            </ResponsiveDialog.Close>
            <Button
              className="text-white"
              variant="destructive"
              disabled={destroy.isPending}
              onClick={handleConfirm}
            >
              {destroy.isPending ? t("common.deleting") : t("common.delete")}
            </Button>
          </div>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
