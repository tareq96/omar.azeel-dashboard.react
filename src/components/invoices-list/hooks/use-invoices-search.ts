import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export type InvoicesSearchState = {
  page?: number;
  per_page?: number;
  q?: string;
  sort?: string;
  direction?: string;
  due_date?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

export function useInvoicesSearch(initial?: InvoicesSearchState) {
  const [search, setSearch] = useState<InvoicesSearchState>({
    page: 1,
    per_page: 25,
    ...(initial || {}),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(
          ([key, value]) => key !== "due_date" && key !== "q" && Boolean(value),
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
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
  } as const;
}
