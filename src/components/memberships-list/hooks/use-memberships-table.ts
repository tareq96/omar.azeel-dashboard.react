import dayjs from "dayjs";
import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useUsersGetMemberships } from "@/services/api/generated/users/users";
import { useMembershipsListTableColumns } from "@/components/users-list/components/memberships-columns";
import type { MembershipRow } from "@/components/users-list/components/memberships-columns";
import { MEMBERSHIPS_TABLE_COLUMN_ORDER } from "@/components/memberships-list/constants";

type MembershipsApiResponse = {
  current_page?: number;
  data?: MembershipRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useMembershipsTable() {
  const { t } = useTranslation();

  const [search, setSearch] = useState<{
    page?: number;
    per_page?: number;
    q?: string;
    sort?: string;
    direction?: "asc" | "desc";
    activation_date?: string; // from,to (ms)
  }>({
    page: 1,
    per_page: 25,
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const activationFilter = search.activation_date as string | undefined;
  const activationFilterValues = activationFilter?.split(",");
  const activation_from = activationFilterValues?.[0]
    ? dayjs(Number(activationFilterValues[0])).format("YYYY-MM-DD")
    : undefined;
  const activation_to = activationFilterValues?.[1]
    ? dayjs(Number(activationFilterValues?.[1])).format("YYYY-MM-DD")
    : undefined;

  const { data, isPending } = useUsersGetMemberships<MembershipsApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(search.sort ? ({ sort: search.sort } as any) : {}),
      ...(search.direction ? ({ direction: search.direction } as any) : {}),
      ...(activation_from ? ({ from_date: activation_from } as any) : {}),
      ...(activation_to ? ({ to_date: activation_to } as any) : {}),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const memberships: MembershipRow[] = ((data?.data as MembershipRow[]) || []).map((m) => ({
    ...m,
    remaining_items:
      typeof m.remaining_items === "number" && m.remaining_items < 0 ? 0 : m.remaining_items,
  }));
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  const columns = useMembershipsListTableColumns({ setRowAction: () => {}, memberships });

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
    setSearch((prev) => ({ ...prev, activation_date: range, page: 1 }));
  }, []);

  const clearExternalFilters = useCallback(() => {
    handleDateRangeChange(undefined);
  }, [handleDateRangeChange]);

  const { table } = useDataTable<MembershipRow>({
    data: memberships || [],
    refetch: handleRefetch,
    isLoading: isPending,
    columns,
    pageCount: Math.ceil(total / per_page),
    getRowId: (row) => String(row.user_id),
    enableColumnResizing: true,
    initialState: {
      pagination: {
        pageIndex: page - 1,
        pageSize: per_page,
      },
      columnOrder: [...MEMBERSHIPS_TABLE_COLUMN_ORDER],
      columnVisibility: {},
    },
  });

  return {
    table,
    isPending,
    globalSearchInput,
    handleGlobalSearchChange,
    t,
    dateRange: search.activation_date,
    handleDateRangeChange,
    clearExternalFilters,
  } as const;
}
