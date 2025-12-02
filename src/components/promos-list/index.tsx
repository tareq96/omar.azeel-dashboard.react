import { DataTable, DataTableToolbar } from "@/components/data-table";
import { usePromosTable } from "@/components/promos-list/hooks/use-promos-table";
import { PROMOS_TABLE_STORAGE_PREFIX } from "@/components/promos-list/constants";

const PromosList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = usePromosTable();

  return (
    <>
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={["status", "start_date", "end_date", "created_at"]}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: PROMOS_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default PromosList;
