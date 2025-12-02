import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useItemsTable } from "@/components/items-list/hooks/use-items-table";
import { ITEMS_TABLE_STORAGE_PREFIX } from "@/components/items-list/constants";
import AddItemDialog from "@/components/items-list/components/add-item-dialog/add-item-dialog";
import EditItemDialog from "@/components/items-list/components/edit-item-dialog/edit-item-dialog";
import DeleteItemDialog from "@/components/items-list/components/delete-item-dialog";
import { useQueryClient } from "@tanstack/react-query";

const ItemsList = () => {
  const {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    search,
    setSearch,
    t,
    rowAction,
    setRowAction,
  } = useItemsTable();
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
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: ITEMS_TABLE_STORAGE_PREFIX,
          }}
        >
          <AddItemDialog onCreated={() => queryClient.invalidateQueries()} />
        </DataTableToolbar>
        <EditItemDialog rowAction={rowAction} onClose={() => setRowAction(null)} />
        <DeleteItemDialog rowAction={rowAction} onClose={() => setRowAction(null)} />
      </DataTable>
    </>
  );
};

export default ItemsList;
