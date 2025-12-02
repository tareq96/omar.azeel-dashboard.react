import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useBundlesListTableColumns } from "@/components/bundles-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { BundlesDataTableRowAction, BundleRow } from "@/components/bundles-list/types";
import { useBundlesSearch } from "@/components/bundles-list/hooks/use-bundles-search";
import { useBundlesData } from "@/components/bundles-list/hooks/use-bundles-data";
import { BUNDLES_TABLE_COLUMN_ORDER } from "@/components/bundles-list/constants";

export function useBundlesTable() {
  const { t } = useTranslation();

  const { search, filters, globalSearchInput, handleGlobalSearchChange, handleRefetch } =
    useBundlesSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    BundleRow,
    BundlesDataTableRowAction
  > | null>(null);

  const {
    bundles: rawBundles,
    total,
    page,
    per_page,
    isPending,
  } = useBundlesData({
    search,
    filters,
  });

  const bundles: BundleRow[] = (rawBundles as BundleRow[]) || [];

  const columns = useBundlesListTableColumns({ setRowAction, bundles });

  const tableConfig = useMemo(
    () => ({
      data: bundles,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: BundleRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...BUNDLES_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [bundles, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<BundleRow>(tableConfig);

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
