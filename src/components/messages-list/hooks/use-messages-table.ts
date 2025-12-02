import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useMessagesListTableColumns } from "@/components/messages-list/components/columns";
import type { MessageRow } from "@/components/messages-list/types";
import { useMessagesSearch } from "@/components/messages-list/hooks/use-messages-search";
import { useMessagesData } from "@/components/messages-list/hooks/use-messages-data";
import { MESSAGES_TABLE_COLUMN_ORDER } from "@/components/messages-list/constants";

export function useMessagesTable() {
  const { t } = useTranslation();

  const {
    search,
    filters,
    from_date,
    to_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
  } = useMessagesSearch();

  const { messages, total, page, per_page, isPending } = useMessagesData({
    search,
    filters,
    from_date,
    to_date,
  });

  const columns = useMessagesListTableColumns();

  const tableConfig = useMemo(
    () => ({
      data: messages,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil(total / per_page || 1),
      getRowId: (row: MessageRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: page - 1,
          pageSize: per_page,
        },
        columnOrder: [...MESSAGES_TABLE_COLUMN_ORDER],
        columnVisibility: {},
      },
    }),
    [messages, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<MessageRow>(tableConfig);

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
  } as const;
}
