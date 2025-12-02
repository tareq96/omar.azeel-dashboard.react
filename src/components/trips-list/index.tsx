import TabSelector from "@/components/drivers-list/TabSelector";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useTripsTable } from "@/components/trips-list/hooks/use-trips-table";
import { TRIPS_TABLE_STORAGE_PREFIX } from "@/components/trips-list/constants";
import AddTripDialog from "@/components/trips-list/components/add-trip-dialog";
import TripDeleteDialog from "@/components/trips-list/components/trip-delete-dialog";
import UserDialog from "@/components/users-list/components/user-dialog";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { TripRow } from "@/components/trips-list/types";

const TripsList = () => {
  const [userDialogUserId, setUserDialogUserId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  const onDriverClick = useCallback((row: TripRow) => {
    const idCandidate = (row as any)?.user_id;
    setUserDialogUserId(typeof idCandidate === "number" ? idCandidate : undefined);
  }, []);

  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    activePost,
    selectPost,
    handleRefetch,
    rowAction,
    setRowAction,
    refetch,
  } = useTripsTable(onDriverClick);

  useEffect(() => {
    const handler = () => setUserDialogUserId(undefined);
    window.addEventListener("userDialog.closed", handler);
    return () => window.removeEventListener("userDialog.closed", handler);
  }, []);

  useEffect(() => {
    if (rowAction?.variant === "edit") {
      const id = rowAction.row?.original?.id;
      if (typeof id === "number" || typeof id === "string") {
        navigate({ to: "/trips/$tripId", params: { tripId: String(id) } });
        setRowAction(null);
      }
    }
  }, [rowAction, navigate, setRowAction]);

  const tabs: { id: number; label: string }[] = [
    {
      id: 1,
      label: t("trips.tabs.orderPickupDropoff", { defaultValue: "Order - Pick up, Drop off" }),
    },
    { id: 2, label: t("trips.tabs.lockerInstallation", { defaultValue: "Locker Installation" }) },
    { id: 3, label: t("trips.tabs.topups", { defaultValue: "Topup Cards" }) },
    { id: 4, label: t("trips.tabs.lockerMaintenance", { defaultValue: "Locker Maintenance" }) },
    { id: 5, label: t("trips.tabs.lockerRemoval", { defaultValue: "Locker Removal" }) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <TabSelector tabs={tabs} activeId={activePost} onChange={selectPost} />

      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={["status", "created_at"]}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: `${TRIPS_TABLE_STORAGE_PREFIX}.post_${activePost}`,
          }}
        >
          <AddTripDialog
            onCreated={async () => {
              await refetch();
            }}
          />
        </DataTableToolbar>
      </DataTable>

      <TripDeleteDialog
        trip={rowAction?.row?.original ?? null}
        refetch={refetch}
        onClose={() => setRowAction(null)}
      />
      <UserDialog userId={userDialogUserId} />
    </div>
  );
};

export default TripsList;
