import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useTripsListTableColumns } from "@/components/trips-list/components/trips-columns";
import type { TripRow } from "@/components/trips-list/types";
import type { TripsDataTableRowAction } from "@/components/trips-list/types";
import type { DataTableRowAction } from "@/types/data-table";
import { useTripsSearch } from "@/components/trips-list/hooks/use-trips-search";
import { useTripsData } from "@/components/trips-list/hooks/use-trips-data";
import { TRIPS_TABLE_COLUMN_ORDER } from "@/components/trips-list/constants";

export function useTripsTable(onDriverClick?: (row: TripRow) => void) {
  const { t } = useTranslation();

  const {
    search,
    filters,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
    activePost,
    selectPost,
    initializedRef,
  } = useTripsSearch();

  const { trips, total, page, per_page, isPending, refetch } = useTripsData({
    search,
    filters,
    activePost,
  });

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    TripRow,
    TripsDataTableRowAction
  > | null>(null);

  const columns = useTripsListTableColumns({ trips, setRowAction, onDriverClick });

  const tableConfig = useMemo(
    () => ({
      data: trips,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil((total || 0) / (per_page || 1)),
      getRowId: (row: TripRow) => String(row.id ?? row.code),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...TRIPS_TABLE_COLUMN_ORDER],
        columnVisibility: { status: false as any },
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [trips, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<TripRow>(tableConfig);

  useEffect(() => {
    if (initializedRef.current) return;
    const col = table.getColumn("created_at");
    if (col) {
      col.setFilterValue(search.created_at);
      initializedRef.current = true;
    }
  }, [table]);

  return {
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
  } as const;
}
