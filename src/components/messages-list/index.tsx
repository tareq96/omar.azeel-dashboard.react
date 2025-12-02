import CreateMessageForm from "@/components/messages-list/components/create-message-form";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useMessagesTable } from "@/components/messages-list/hooks/use-messages-table";
import { MESSAGES_TABLE_STORAGE_PREFIX } from "@/components/messages-list/constants";

const MessagesList = () => {
  const { table, isPending, globalSearchInput, handleGlobalSearchChange, t } = useMessagesTable();

  return (
    <>
      <CreateMessageForm />
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar
          table={table}
          singleSearchInput
          globalSearchValue={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchChange}
          globalSearchPlaceholder={t("search")}
          extraFilterColumnIds={["type", "created_at"]}
          settingsMenuConfig={{
            allowColumnReorder: true,
            allowColumnVisibility: true,
            allowColumnResizing: true,
            storagePrefix: MESSAGES_TABLE_STORAGE_PREFIX,
          }}
        />
      </DataTable>
    </>
  );
};

export default MessagesList;
