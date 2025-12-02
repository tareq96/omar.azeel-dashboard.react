import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useCreditsCardsTable } from "@/components/credits-cards-list/hooks/use-credits-cards-table";
import { CREDITS_CARDS_TABLE_STORAGE_PREFIX } from "@/components/credits-cards-list/constants";

const CreditsCardsList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } =
    useCreditsCardsTable();

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
          storagePrefix: CREDITS_CARDS_TABLE_STORAGE_PREFIX,
        }}
      />
    </DataTable>
  );
};

export default CreditsCardsList;
