import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useItemsListTableColumns } from "@/components/items-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { ItemsDataTableRowAction, ItemRow } from "@/components/items-list/types";
import { useItemsSearch } from "@/components/items-list/hooks/use-items-search";
import { useItemsData } from "@/components/items-list/hooks/use-items-data";
import { ITEMS_TABLE_COLUMN_ORDER } from "@/components/items-list/constants";

export function useItemsTable() {
  const { t } = useTranslation();

  const { search, setSearch, filters, globalSearchInput, handleGlobalSearchChange, handleRefetch } =
    useItemsSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    ItemRow,
    ItemsDataTableRowAction
  > | null>(null);

  const {
    items: rawItems,
    total,
    page,
    per_page,
    isPending,
  } = useItemsData({
    search,
    filters,
  });

  const items: ItemRow[] = (rawItems as ItemRow[]) || [];

  const columns = useItemsListTableColumns({ setRowAction, items });

  const tableConfig = useMemo(
    () => ({
      data: items,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: ItemRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...ITEMS_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [items, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<ItemRow>(tableConfig);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    search,
    setSearch,
    t,
    // expose if needed
    rowAction,
    setRowAction,
  } as const;
}
