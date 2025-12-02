import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useTopupsTable } from "@/components/topups-list/hooks/use-topups-table";
import { TOPUPS_TABLE_STORAGE_PREFIX } from "@/components/topups-list/constants";

const TopupsList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = useTopupsTable();

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={["status", "charge_date", "created_at"]}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: TOPUPS_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default TopupsList;
