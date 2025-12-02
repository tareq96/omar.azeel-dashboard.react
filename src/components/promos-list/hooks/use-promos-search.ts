import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export type PromosSearchState = {
  page?: number;
  per_page?: number;
  status?: string;
  q?: string;
  sort?: string;
  direction?: string;
  created_at?: string; // comma-separated timestamps (ms): from,to
  start_date?: string; // comma-separated timestamps (ms): from,to
  end_date?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

export function usePromosSearch() {
  const startOfMonth = dayjs().startOf("month");
  const today = dayjs();

  const [search, setSearch] = useState<PromosSearchState>({
    page: 1,
    per_page: 25,
    created_at: [startOfMonth.valueOf(), today.valueOf()].join(","),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");
  const initializedRef = useRef(false);

  const createdAtFilterValues = search.created_at?.split(",");
  const created_at_from = createdAtFilterValues?.[0]
    ? dayjs(Number(createdAtFilterValues[0])).format("YYYY-MM-DD")
    : undefined;
  const created_at_to = createdAtFilterValues?.[1]
    ? dayjs(Number(createdAtFilterValues?.[1])).format("YYYY-MM-DD")
    : undefined;

  const startDateFilterValues = search.start_date?.split(",");
  const start_from_date = startDateFilterValues?.[0]
    ? dayjs(Number(startDateFilterValues[0])).format("YYYY-MM-DD")
    : undefined;
  const start_to_date = startDateFilterValues?.[1]
    ? dayjs(Number(startDateFilterValues[1])).format("YYYY-MM-DD")
    : undefined;

  const endDateFilterValues = search.end_date?.split(",");
  const end_from_date = endDateFilterValues?.[0]
    ? dayjs(Number(endDateFilterValues[0])).format("YYYY-MM-DD")
    : undefined;
  const end_to_date = endDateFilterValues?.[1]
    ? dayjs(Number(endDateFilterValues[1])).format("YYYY-MM-DD")
    : undefined;

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(
          ([key, value]) =>
            !["created_at", "start_date", "end_date"].includes(key) && Boolean(value),
        ),
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
    created_at_from,
    created_at_to,
    start_from_date,
    start_to_date,
    end_from_date,
    end_to_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
    initializedRef,
  } as const;
}
