import { DataTable, DataTableToolbar } from "@/components/data-table";
import TabSelector from "@/components/drivers-list/TabSelector";
import { useDriversTable } from "@/components/drivers-list/hooks/use-drivers-table";
import {
  DRIVERS_TABLE_EXTRA_FILTER_COLUMNS,
  DRIVERS_TABLE_STORAGE_PREFIX_BASE,
} from "@/components/drivers-list/constants";

const DriversList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    tabs,
    activePost,
    onTabChange,
    t,
  } = useDriversTable();

  return (
    <div className="flex flex-col gap-4">
      <TabSelector tabs={tabs} activeId={activePost} onChange={onTabChange} />

      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={[...DRIVERS_TABLE_EXTRA_FILTER_COLUMNS]}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: `${DRIVERS_TABLE_STORAGE_PREFIX_BASE}.post_${activePost}`,
          }}
        />
      </DataTable>
    </div>
  );
};

export default DriversList;
