import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useCustomersListTableColumns } from "@/components/users-list/components/customers-columns";
import type { DataTableRowAction } from "@/types/data-table";
import type { UsersDataTableRowAction, CustomerRow } from "@/components/users-list/types";
import { useCustomersSearch } from "@/components/customers-list/hooks/use-customers-search";
import { useCustomersData } from "@/components/customers-list/hooks/use-customers-data";
import { CUSTOMERS_TABLE_COLUMN_ORDER } from "@/components/customers-list/constants";

export function useCustomersTable() {
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
  } = useCustomersSearch();

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    CustomerRow,
    UsersDataTableRowAction
  > | null>(null);

  const {
    customers: rawCustomers,
    total,
    page,
    per_page,
    isPending,
  } = useCustomersData({
    search,
    filters,
    created_at_from,
    created_at_to,
  });

  const customers: CustomerRow[] = (rawCustomers as CustomerRow[]) || [];

  const columns = useCustomersListTableColumns({ setRowAction, customers });

  const tableConfig = useMemo(
    () => ({
      data: customers,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: CustomerRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...CUSTOMERS_TABLE_COLUMN_ORDER],
        columnVisibility: {
          dynamic_id: true,
        },
        columnPinning: {
          right: ["actions"],
        },
      },
    }),
    [customers, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<CustomerRow>(tableConfig);

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
