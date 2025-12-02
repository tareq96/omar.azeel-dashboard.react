import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useCreditsListTableColumns } from "@/components/credits-list/components/columns";
import type { CreditRow } from "@/components/credits-list/types";
import type { ExtendedColumnSort } from "@/types/data-table";
import { useCreditsSearch } from "@/components/credits-list/hooks/use-credits-search";
import { useCreditsData } from "@/components/credits-list/hooks/use-credits-data";
import {
  CREDITS_DEFAULT_SORT,
  CREDITS_TABLE_COLUMN_ORDER,
} from "@/components/credits-list/constants";

export function useCreditsTable() {
  const { t } = useTranslation();

  const {
    search,
    from_date,
    to_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
    initializedRef,
  } = useCreditsSearch();

  const { credits, total, page, per_page, isPending } = useCreditsData({
    search,
    from_date,
    to_date,
  });

  const columns = useCreditsListTableColumns({ credits });

  const tableConfig = useMemo(
    () => ({
      data: credits,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page) || 1,
      getRowId: (row: CreditRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        sorting: [
          {
            id: CREDITS_DEFAULT_SORT as Extract<keyof CreditRow, string>,
            desc: true,
          } as ExtendedColumnSort<CreditRow>,
        ],
        columnOrder: [...CREDITS_TABLE_COLUMN_ORDER],
        columnVisibility: {},
      },
    }),
    [credits, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<CreditRow>(tableConfig);

  // Initialize date filter on first render to match previous behavior
  useEffect(() => {
    if (initializedRef.current) return;
    const dateColumn = table.getColumn("date");
    if (dateColumn) {
      dateColumn.setFilterValue(search.date);
      initializedRef.current = true;
    }
  }, [table, search.date, initializedRef]);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
  } as const;
}
