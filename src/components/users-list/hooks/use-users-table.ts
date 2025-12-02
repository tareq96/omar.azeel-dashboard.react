import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useUsersListTableColumns } from "@/components/users-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { UsersDataTableRowAction, UserRow } from "@/components/users-list/types";
import { useUsersSearch } from "@/components/users-list/hooks/use-users-search";
import { useUsersData } from "@/components/users-list/hooks/use-users-data";
import { USERS_TABLE_COLUMN_ORDER } from "@/components/users-list/constants";

export function useUsersTable() {
  const { t } = useTranslation();

  const {
    search,
    filters,
    created_at_from,
    created_at_to,
    globalSearchInput,
    handleGlobalSearchChange,
    handleDateRangeChange,
    handleRefetch,
  } = useUsersSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    UserRow,
    UsersDataTableRowAction
  > | null>(null);

  const {
    users: rawUsers,
    total,
    page,
    per_page,
    isPending,
  } = useUsersData({
    search,
    filters,
    created_at_from,
    created_at_to,
  });

  const users: UserRow[] = (rawUsers as UserRow[]) || [];

  const columns = useUsersListTableColumns({ setRowAction, users });

  const tableConfig = useMemo(
    () => ({
      data: users,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: UserRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...USERS_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [users, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<UserRow>(tableConfig);

  const clearExternalFilters = useCallback(() => {
    handleDateRangeChange(undefined);
  }, [handleDateRangeChange]);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    handleDateRangeChange,
    dateRange: search.created_at,
    clearExternalFilters,
    t,
    // expose if needed later
    rowAction,
    setRowAction,
  } as const;
}
