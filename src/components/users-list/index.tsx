import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useUsersTable } from "@/components/users-list/hooks/use-users-table";
import {
  USERS_TABLE_EXTRA_FILTER_COLUMNS,
  USERS_TABLE_STORAGE_PREFIX,
} from "@/components/users-list/constants";
import UserDialog from "@/components/users-list/components/user-dialog";
import AddUserDialog from "@/components/users-list/components/add-user-dialog/add-user-dialog";
import EditUserDialog from "@/components/users-list/components/edit-user-dialog/edit-user-dialog";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const UsersList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    dateRange,
    t,
    clearExternalFilters,
    rowAction,
    setRowAction,
  } = useUsersTable();

  const queryClient = useQueryClient();

  // State for view dialog
  const [viewUserId, setViewUserId] = useState<number | undefined>(undefined);

  // State for edit dialog
  const [editUserId, setEditUserId] = useState<number | undefined>(undefined);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInitialUser, setEditInitialUser] = useState<any | undefined>(undefined);

  useEffect(() => {
    const handler = () => setRowAction(null);
    window.addEventListener("userDialog.closed", handler);
    return () => window.removeEventListener("userDialog.closed", handler);
  }, [setRowAction]);

  // Handle row actions
  useEffect(() => {
    if (!rowAction) {
      setViewUserId(undefined);
      setEditUserId(undefined);
      setEditDialogOpen(false);
      return;
    }

    const userId = rowAction.row?.original?.id;

    if (rowAction.variant === "edit") {
      setEditUserId(userId);
      setEditDialogOpen(true);
      setEditInitialUser(rowAction.row?.original);
    } else {
      // For other actions like delete or default view
      setViewUserId(userId);
    }
  }, [rowAction]);

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={[...USERS_TABLE_EXTRA_FILTER_COLUMNS]}
          extraIsFiltered={Boolean(dateRange)}
          onResetExtraFilters={clearExternalFilters}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: USERS_TABLE_STORAGE_PREFIX,
          }}
        >
          <AddUserDialog onCreated={() => queryClient.invalidateQueries()} />
        </DataTableToolbar>
      </DataTable>

      <UserDialog userId={viewUserId} />

      <EditUserDialog
        userId={editUserId}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditUserId(undefined);
            setEditInitialUser(undefined);
            setRowAction(null);
          }
        }}
        onUpdated={() => {
          queryClient.invalidateQueries();
        }}
        initialUser={editInitialUser}
      />
    </>
  );
};

export default UsersList;
