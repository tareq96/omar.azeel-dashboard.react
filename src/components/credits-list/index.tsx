import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useCreditsTable } from "@/components/credits-list/hooks/use-credits-table";
import { CREDITS_TABLE_STORAGE_PREFIX } from "@/components/credits-list/constants";

const CreditsList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = useCreditsTable();

  return (
    <DataTable table={table} isLoading={isPending}>
      <DataTableToolbar
        table={table}
        singleSearchInput
        globalSearchValue={globalSearchInput}
        onGlobalSearchChange={handleGlobalSearchChange}
        globalSearchPlaceholder={t("search")}
        extraFilterColumnIds={["type", "date"]}
        settingsMenuConfig={{
          allowColumnReorder: true,
          allowColumnVisibility: true,
          allowColumnResizing: true,
          storagePrefix: CREDITS_TABLE_STORAGE_PREFIX,
        }}
      />
    </DataTable>
  );
};

export default CreditsList;
