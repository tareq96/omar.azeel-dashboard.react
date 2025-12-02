import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export type DriversSearchState = {
  page?: number;
  per_page?: number;
  q?: string;
  sort?: string;
  direction?: string;
  [key: string]: any;
};

export function useDriversSearch(initial?: DriversSearchState) {
  const [search, setSearch] = useState<DriversSearchState>({
    page: 1,
    per_page: 25,
    ...(initial || {}),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const filters = useMemo(
    () => Object.fromEntries(Object.entries(search).filter(([_, value]) => Boolean(value))),
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
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
  } as const;
}
