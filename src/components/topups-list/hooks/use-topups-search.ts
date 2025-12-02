import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export type TopupsSearchState = {
  page?: number;
  per_page?: number;
  status?: string;
  q?: string;
  sort?: string;
  direction?: string;
  created_at?: string; // comma-separated timestamps (ms): from,to
  charge_date?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

export function useTopupsSearch() {
  const startOfMonth = dayjs().startOf("month");
  const today = dayjs();

  const [search, setSearch] = useState<TopupsSearchState>({
    page: 1,
    per_page: 25,
    created_at: [startOfMonth.valueOf(), today.valueOf()].join(","),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const createdAtFilterValues = search.created_at?.split(",");
  const created_at_from = createdAtFilterValues?.[0]
    ? dayjs(Number(createdAtFilterValues[0])).format("YYYY-MM-DD")
    : undefined;
  const created_at_to = createdAtFilterValues?.[1]
    ? dayjs(Number(createdAtFilterValues?.[1])).format("YYYY-MM-DD")
    : undefined;

  const chargeDateFilterValues = search.charge_date?.split(",");
  const from_charge_date = chargeDateFilterValues?.[0]
    ? dayjs(Number(chargeDateFilterValues[0])).format("YYYY-MM-DD")
    : undefined;
  const to_charge_date = chargeDateFilterValues?.[1]
    ? dayjs(Number(chargeDateFilterValues?.[1])).format("YYYY-MM-DD")
    : undefined;

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(
          ([key, value]) => key !== "created_at" && key !== "charge_date" && Boolean(value),
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
    from_charge_date,
    to_charge_date,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
  } as const;
}
