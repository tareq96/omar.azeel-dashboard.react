import React from "react";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useCustomersTable } from "@/components/customers-list/hooks/use-customers-table";
import {
  CUSTOMERS_TABLE_EXTRA_FILTER_COLUMNS,
  CUSTOMERS_TABLE_STORAGE_PREFIX,
} from "@/components/customers-list/constants";
import { DateRangeFilter } from "@/components/dashboard-summary/components/DateRangeFilter";
import AddCustomerDialog from "@/components/customers-list/components/add-customer-dialog";
import { useQueryClient } from "@tanstack/react-query";

const CustomersList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    handleDateRangeChange,
    dateRange,
    t,
    clearExternalFilters,
  } = useCustomersTable();

  const queryClient = useQueryClient();

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={[...CUSTOMERS_TABLE_EXTRA_FILTER_COLUMNS]}
          extraIsFiltered={Boolean(dateRange)}
          onResetExtraFilters={clearExternalFilters}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: CUSTOMERS_TABLE_STORAGE_PREFIX,
          }}
          leftChildren={
            <DateRangeFilter
              label={t("customersTable.columns.registrationDate.label")}
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              defaultInitial={false}
            />
          }
        >
          <AddCustomerDialog onCreated={() => queryClient.invalidateQueries()} />
        </DataTableToolbar>
      </DataTable>
    </>
  );
};

export default CustomersList;
