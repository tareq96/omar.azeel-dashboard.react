import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useLockersTable } from "@/components/lockers-list/hooks/use-lockers-table";
import { LOCKERS_TABLE_STORAGE_PREFIX } from "@/components/lockers-list/constants";
import AddLockerDialog from "@/components/lockers-list/components/add-locker-dialog/add-locker-dialog";
import EditLockerDialog from "@/components/lockers-list/components/edit-locker-dialog/edit-locker-dialog";
import DeleteLockerDialog from "@/components/lockers-list/components/delete-locker-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const LockersList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    rowAction,
    setRowAction,
  } = useLockersTable();
  const queryClient = useQueryClient();
  const [editLockerOpen, setEditLockerOpen] = useState(false);
  const [editingLocker, setEditingLocker] = useState<any>(null);

  // Handle edit row action
  useEffect(() => {
    if (rowAction?.variant === "edit" && rowAction.row) {
      setEditingLocker(rowAction.row.original);
      setEditLockerOpen(true);
      setRowAction(null);
    }
  }, [rowAction, setRowAction]);

  const handleEditDialogClose = (open: boolean) => {
    setEditLockerOpen(open);
    if (!open) {
      setEditingLocker(null);
    }
  };

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={["status"]}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: LOCKERS_TABLE_STORAGE_PREFIX,
          }}
        >
          <AddLockerDialog onCreated={() => queryClient.invalidateQueries()} />
        </DataTableToolbar>
      </DataTable>

      {editingLocker && (
        <EditLockerDialog
          locker={editingLocker}
          open={editLockerOpen}
          onOpenChange={handleEditDialogClose}
          onUpdated={() => {
            queryClient.invalidateQueries();
            setEditLockerOpen(false);
            setEditingLocker(null);
          }}
        />
      )}
      <DeleteLockerDialog rowAction={rowAction} onClose={() => setRowAction(null)} />
    </>
  );
};

export default LockersList;
