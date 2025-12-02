import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useAddressesTable } from "@/components/addresses-list/hooks/use-addresses-table";
import { ADDRESSES_TABLE_STORAGE_PREFIX } from "@/components/addresses-list/constants";

const AddressesList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = useAddressesTable();

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
            storagePrefix: ADDRESSES_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default AddressesList;
