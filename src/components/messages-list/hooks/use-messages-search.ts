import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export type MessagesSearchState = {
  page?: number;
  per_page?: number;
  type?: string;
  q?: string;
  sort?: string;
  direction?: string;
  created_at?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

export function useMessagesSearch() {
  const [search, setSearch] = useState<MessagesSearchState>({
    page: 1,
    per_page: 25,
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const { from_date, to_date } = useMemo(() => {
    if (!search.created_at) return { from_date: undefined, to_date: undefined };
    const values = (search.created_at || "").split(",");
    const from = values[0] ? dayjs(Number(values[0])).format("YYYY-MM-DD") : undefined;
    const to = values[1] ? dayjs(Number(values[1])).format("YYYY-MM-DD") : undefined;
    return { from_date: from, to_date: to };
  }, [search.created_at]);

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

  return {
    search,
    setSearch,
    filters,
    from_date,
    to_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
  } as const;
}
