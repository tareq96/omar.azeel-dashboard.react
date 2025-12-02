import dayjs from "dayjs";
import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useTicketsGetTicketsList } from "@/services/api/generated/tickets/tickets";
import { useTicketsListTableColumns } from "@/components/tickets-list/components/tickets-columns";
import type { TicketRow } from "@/components/tickets-list/types";
import type { TicketsDataTableRowAction } from "@/components/tickets-list/types";
import type { DataTableRowAction } from "@/types/data-table";
import { TICKETS_TABLE_COLUMN_ORDER } from "@/components/tickets-list/constants";

type TicketsApiResponse = {
  current_page?: number;
  data?: TicketRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useTicketsTable() {
  const { t } = useTranslation();

  const [search, setSearch] = useState<{
    page?: number;
    per_page?: number;
    q?: string;
    sort?: string;
    direction?: "asc" | "desc" | string;
    created_at?: string; // "from,to" timestamps (ms)
    updated_at?: string; // client-side filter only
    status?: string;
  }>({
    page: 1,
    per_page: 25,
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const createdFilter = search.created_at as string | undefined;
  const createdValues = createdFilter?.split(",");
  const created_from = createdValues?.[0]
    ? dayjs(Number(createdValues[0])).format("YYYY-MM-DD")
    : undefined;
  const created_to = createdValues?.[1]
    ? dayjs(Number(createdValues?.[1])).format("YYYY-MM-DD")
    : undefined;

  const { data, isPending } = useTicketsGetTicketsList<TicketsApiResponse>(
    String(search.per_page || 25),
    {
      q: search.q,
      status: search.status,
      sort: search.sort,
      direction: search.direction as any,
      ...(created_from ? ({ from_date: created_from } as any) : {}),
      ...(created_to ? ({ to_date: created_to } as any) : {}),
      ...(search.page ? ({ page: search.page } as any) : {}),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const tickets: TicketRow[] = (data?.data as TicketRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    TicketRow,
    TicketsDataTableRowAction
  > | null>(null);
  const columns = useTicketsListTableColumns({ setRowAction, tickets });

  // Client-side filter for updated_at (date range in ms, "from,to")
  const filteredTickets = useMemo(() => {
    const updatedFilter = search.updated_at;
    if (!updatedFilter) return tickets;
    const parts = updatedFilter.split(",");
    const from = parts[0] ? Number(parts[0]) : undefined;
    const to = parts[1] ? Number(parts[1]) : undefined;
    if (!from && !to) return tickets;
    return tickets.filter((row) => {
      const ts = row.updated_at ? dayjs(row.updated_at).valueOf() : undefined;
      if (!ts) return false;
      if (from && to) return ts >= from && ts <= to;
      if (from) return ts >= from;
      if (to) return ts <= to;
      return true;
    });
  }, [tickets, search.updated_at]);

  const handleRefetch = useCallback((params: Record<string, any>) => {
    setSearch((prev) => ({ ...prev, ...params }));
  }, []);

  const debouncedGlobalSearchUpdate = useDebouncedCallback((value: string) => {
    setSearch((prev) => ({
      ...prev,
      page: 1,
      q: value && value.trim() ? value : undefined,
    }));
  }, 300);

  const handleGlobalSearchChange = useCallback(
    (value: string) => {
      setGlobalSearchInput(value);
      debouncedGlobalSearchUpdate(value);
    },
    [debouncedGlobalSearchUpdate],
  );

  const handleDateRangeChange = useCallback((range: string | undefined) => {
    setSearch((prev) => ({ ...prev, created_at: range, page: 1 }));
  }, []);

  const clearExternalFilters = useCallback(() => {
    handleDateRangeChange(undefined);
  }, [handleDateRangeChange]);

  const { table } = useDataTable<TicketRow>({
    data: filteredTickets || [],
    refetch: handleRefetch,
    isLoading: isPending,
    columns,
    pageCount: Math.ceil(total / per_page || 1),
    getRowId: (row) => String(row.id),
    enableColumnResizing: true,
    initialState: {
      pagination: {
        pageIndex: page - 1,
        pageSize: per_page,
      },
      columnOrder: [...TICKETS_TABLE_COLUMN_ORDER],
      columnVisibility: {},
      columnPinning: {
        right: ["actions"],
      },
    },
  });

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    dateRange: search.created_at,
    handleDateRangeChange,
    clearExternalFilters,
    hasUpdatedAtFilter: Boolean(search.updated_at),
  } as const;
}
