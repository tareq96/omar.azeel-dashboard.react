import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useAddressesListTableColumns } from "@/components/addresses-list/components/columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { AddressesDataTableRowAction, AddressRow } from "@/components/addresses-list/types";
import { useAddressesSearch } from "@/components/addresses-list/hooks/use-addresses-search";
import { useAddressesData } from "@/components/addresses-list/hooks/use-addresses-data";
import { ADDRESSES_TABLE_COLUMN_ORDER } from "@/components/addresses-list/constants";

export function useAddressesTable() {
  const { t } = useTranslation();

  const { search, filters, globalSearchInput, handleGlobalSearchChange, handleRefetch } =
    useAddressesSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    AddressRow,
    AddressesDataTableRowAction
  > | null>(null);

  const {
    addresses: rawAddresses,
    total,
    page,
    per_page,
    isPending,
  } = useAddressesData({
    search,
    filters,
  });

  const addresses: AddressRow[] = (rawAddresses as AddressRow[]) || [];

  const columns = useAddressesListTableColumns({ setRowAction, addresses });

  const tableConfig = useMemo(
    () => ({
      data: addresses,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: AddressRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...ADDRESSES_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [addresses, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<AddressRow>(tableConfig);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    // rowAction exposed if needed later
    rowAction,
    setRowAction,
  } as const;
}
