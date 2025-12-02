import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { parseDateRange } from "@/lib/utils";

export type CustomersSearchState = {
  page?: number;
  per_page?: number;
  q?: string;
  sort?: string;
  direction?: "asc" | "desc" | string;
  created_at?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

export function useCustomersSearch(initial?: CustomersSearchState) {
  const [search, setSearch] = useState<CustomersSearchState>({
    page: 1,
    per_page: 25,
    created_at: undefined,
    ...(initial || {}),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const createdAt = useMemo(() => parseDateRange(search.created_at), [search.created_at]);
  const created_at_from = createdAt.from;
  const created_at_to = createdAt.to;

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(([key, value]) => key !== "created_at" && Boolean(value)),
      ),
    [search],
  );

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

  return {
    search,
    setSearch,
    filters,
    created_at_from,
    created_at_to,
    globalSearchInput,
    handleGlobalSearchChange,
    handleDateRangeChange,
    handleRefetch,
  } as const;
}
