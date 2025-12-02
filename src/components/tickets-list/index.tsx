import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useTicketsTable } from "@/components/tickets-list/hooks/use-tickets-table";
import {
  TICKETS_TABLE_EXTRA_FILTER_COLUMNS,
  TICKETS_TABLE_STORAGE_PREFIX,
} from "@/components/tickets-list/constants";

const TicketsList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    dateRange,
    hasUpdatedAtFilter,
    clearExternalFilters,
  } = useTicketsTable();

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={[...TICKETS_TABLE_EXTRA_FILTER_COLUMNS]}
          extraIsFiltered={Boolean(dateRange) || Boolean(hasUpdatedAtFilter)}
          onResetExtraFilters={clearExternalFilters}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: TICKETS_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default TicketsList;
