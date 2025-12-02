import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useInvoicesListTableColumns } from "@/components/invoices-list/components/columns";
import type { InvoiceRow } from "@/components/invoices-list/types";
import { useInvoicesSearch } from "@/components/invoices-list/hooks/use-invoices-search";
import { useInvoicesData } from "@/components/invoices-list/hooks/use-invoices-data";
import { INVOICES_TABLE_COLUMN_ORDER } from "@/components/invoices-list/constants";
import type { ExtendedColumnSort } from "@/types/data-table";

export function useInvoicesTable() {
  const { t } = useTranslation();

  const { search, filters, globalSearchInput, handleGlobalSearchChange, handleRefetch } =
    useInvoicesSearch();

  const {
    invoices: rawInvoices,
    total,
    page,
    per_page,
    isPending,
  } = useInvoicesData({
    search,
    filters,
  });

  const invoices: InvoiceRow[] = (rawInvoices as InvoiceRow[]) || [];

  const columns = useInvoicesListTableColumns({ invoices });

  const tableConfig = useMemo(
    () => ({
      data: invoices,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page),
      getRowId: (row: InvoiceRow) => String(row.id ?? row.code ?? Math.random()),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...INVOICES_TABLE_COLUMN_ORDER],
        columnVisibility: {},
        columnPinning: {
          right: ["actions"],
        },
        sorting: [{ id: "due_date", desc: true }] as ExtendedColumnSort<InvoiceRow>[],
      },
    }),
    [invoices, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<InvoiceRow>(tableConfig);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
  } as const;
}
