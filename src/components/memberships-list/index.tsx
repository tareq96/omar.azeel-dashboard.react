import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useMembershipsTable } from "@/components/memberships-list/hooks/use-memberships-table";
import {
  MEMBERSHIPS_TABLE_EXTRA_FILTER_COLUMNS,
  MEMBERSHIPS_TABLE_STORAGE_PREFIX,
} from "@/components/memberships-list/constants";

const MembershipsList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    dateRange,
    clearExternalFilters,
  } = useMembershipsTable();

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={[...MEMBERSHIPS_TABLE_EXTRA_FILTER_COLUMNS]}
          extraIsFiltered={Boolean(dateRange)}
          onResetExtraFilters={clearExternalFilters}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: MEMBERSHIPS_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default MembershipsList;
