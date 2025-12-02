import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useLockersListTableColumns } from "@/components/lockers-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { LockersDataTableRowAction, LockerRow } from "@/components/lockers-list/types";
import { useLockersSearch } from "@/components/lockers-list/hooks/use-lockers-search";
import { useLockersData } from "@/components/lockers-list/hooks/use-lockers-data";
import { LOCKERS_TABLE_COLUMN_ORDER } from "@/components/lockers-list/constants";

export function useLockersTable() {
  const { t } = useTranslation();

  const { search, filters, globalSearchInput, handleGlobalSearchChange, handleRefetch } =
    useLockersSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    LockerRow,
    LockersDataTableRowAction
  > | null>(null);

  const {
    lockers: rawLockers,
    total,
    page,
    per_page,
    isPending,
  } = useLockersData({
    search,
    filters,
  });

  const lockers: LockerRow[] = (rawLockers as LockerRow[]) || [];

  const columns = useLockersListTableColumns({ setRowAction, lockers });

  const tableConfig = useMemo(
    () => ({
      data: lockers,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil((total || 1) / per_page),
      getRowId: (row: LockerRow) => String(row.dynamic_id ?? row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...LOCKERS_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [lockers, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<LockerRow>(tableConfig);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    // expose if needed later
    rowAction,
    setRowAction,
  } as const;
}
