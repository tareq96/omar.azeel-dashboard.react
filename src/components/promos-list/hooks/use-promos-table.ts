import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { usePromosListTableColumns } from "@/components/promos-list/components/columns";
import type { PromoRow } from "@/components/promos-list/types";
import type { ExtendedColumnSort } from "@/types/data-table";
import { usePromosSearch } from "@/components/promos-list/hooks/use-promos-search";
import { usePromosData } from "@/components/promos-list/hooks/use-promos-data";
import { PROMOS_TABLE_COLUMN_ORDER } from "@/components/promos-list/constants";

export function usePromosTable() {
  const { t } = useTranslation();

  const {
    search,
    filters,
    created_at_from,
    created_at_to,
    start_from_date,
    start_to_date,
    end_from_date,
    end_to_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
    initializedRef,
  } = usePromosSearch();

  const { promos, total, page, per_page, isPending } = usePromosData({
    search,
    filters,
    created_at_from,
    created_at_to,
    start_from_date,
    start_to_date,
    end_from_date,
    end_to_date,
  });

  const columns = usePromosListTableColumns({ setRowAction: () => {}, promos });

  const tableConfig = useMemo(
    () => ({
      data: promos,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page || 1),
      getRowId: (row: PromoRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        sorting: [{ id: "created_at", desc: true } as ExtendedColumnSort<PromoRow>],
        columnOrder: [...PROMOS_TABLE_COLUMN_ORDER],
        columnVisibility: {
          created_at: false as any,
        },
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [promos, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<PromoRow>(tableConfig);

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
  } as const;
}
