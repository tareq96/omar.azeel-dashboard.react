import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useUsersListTableColumns } from "@/components/users-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { UsersDataTableRowAction } from "@/components/users-list/types";
import { useDriversTabs } from "@/components/drivers-list/hooks/use-drivers-tabs";
import { useDriversSearch } from "@/components/drivers-list/hooks/use-drivers-search";
import { useDriversData } from "@/components/drivers-list/hooks/use-drivers-data";
import { DRIVERS_TABLE_COLUMN_ORDER } from "@/components/drivers-list/constants";

export type DriverRow = {
  id: number;
  name: string;
  email: string | null;
  mobile: string | null;
  status: string;
  type: string | null;
  dynamic_id: string | null;
  created_at: string;
  image?: string | null;
  suspension?: boolean;
  zones?: string[] | null;
  balance?: number | null;
  canDelete?: boolean;
};

export function useDriversTable() {
  const { t } = useTranslation();
  const tabs = useDriversTabs(t);

  const [activePost, setActivePost] = useState<number>(1);

  const { search, setSearch, filters, globalSearchInput, handleGlobalSearchChange, handleRefetch } =
    useDriversSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    DriverRow,
    UsersDataTableRowAction
  > | null>(null);

  const { users, total, page, per_page, isPending } = useDriversData(activePost, search, filters);

  const columns = useUsersListTableColumns({
    setRowAction,
    users: users as unknown as DriverRow[],
  });

  const tableConfig = useMemo(
    () => ({
      data: (users as unknown as DriverRow[]) || [],
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: DriverRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...DRIVERS_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [users, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<DriverRow>(tableConfig);

  const onTabChange = useCallback(
    (id: number) => {
      setActivePost(id);
      setSearch((prev) => ({ ...prev, page: 1 }));
    },
    [setSearch],
  );

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    tabs,
    activePost,
    onTabChange,
    t,
    rowAction,
    setRowAction,
  } as const;
}
