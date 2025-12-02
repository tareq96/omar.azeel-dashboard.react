import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useInvoicesTable } from "@/components/invoices-list/hooks/use-invoices-table";
import { INVOICES_TABLE_STORAGE_PREFIX } from "@/components/invoices-list/constants";

const InvoicesList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = useInvoicesTable();

  return (
    <DataTable table={table} isLoading={isPending}>
      <DataTableToolbar
        table={table}
        singleSearchInput
        globalSearchValue={globalSearchInput}
        onGlobalSearchChange={handleGlobalSearchChange}
        globalSearchPlaceholder={t("search")}
        extraFilterColumnIds={["due_date"]}
        settingsMenuConfig={{
          allowColumnReorder: true,
          allowColumnVisibility: true,
          allowColumnResizing: true,
          storagePrefix: INVOICES_TABLE_STORAGE_PREFIX,
        }}
      />
    </DataTable>
  );
};

export default InvoicesList;
