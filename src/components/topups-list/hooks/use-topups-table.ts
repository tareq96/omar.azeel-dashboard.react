import { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useTopupsListTableColumns } from "@/components/topups-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { TopupsDataTableRowAction, TopupRow } from "@/components/topups-list/types";
import type { ExtendedColumnSort } from "@/types/data-table";
import { useTopupsSearch } from "@/components/topups-list/hooks/use-topups-search";
import { useTopupsData } from "@/components/topups-list/hooks/use-topups-data";
import { TOPUPS_TABLE_COLUMN_ORDER } from "@/components/topups-list/constants";

export function useTopupsTable() {
  const { t } = useTranslation();

  const {
    search,
    filters,
    created_at_from,
    created_at_to,
    from_charge_date,
    to_charge_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
  } = useTopupsSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    TopupRow,
    TopupsDataTableRowAction
  > | null>(null);

  const {
    topups: rawTopups,
    total,
    page,
    per_page,
    isPending,
  } = useTopupsData({
    search,
    filters,
    created_at_from,
    created_at_to,
    from_charge_date,
    to_charge_date,
  });

  const topups: TopupRow[] = (rawTopups as TopupRow[]) || [];

  const columns = useTopupsListTableColumns({ setRowAction, topups });

  const tableConfig = useMemo(
    () => ({
      data: topups,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: TopupRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        sorting: [{ id: "created_at", desc: true } as ExtendedColumnSort<TopupRow>],
        columnOrder: [...TOPUPS_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [topups, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<TopupRow>(tableConfig);

  const initializedRef = useRef(false);
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
    rowAction,
    setRowAction,
  } as const;
}
