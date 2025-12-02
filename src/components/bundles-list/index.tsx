import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useBundlesTable } from "@/components/bundles-list/hooks/use-bundles-table";
import { BUNDLES_TABLE_STORAGE_PREFIX } from "@/components/bundles-list/constants";

const BundlesList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = useBundlesTable();

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: BUNDLES_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default BundlesList;
