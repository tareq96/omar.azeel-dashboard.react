import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export type TripsSearchState = {
  page?: number;
  per_page?: number;
  q?: string;
  sort?: string;
  direction?: "asc" | "desc";
  created_at?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

export function useTripsSearch() {
  const startOfMonth = dayjs().startOf("month");
  const today = dayjs();

  const [activePost, setActivePost] = useState<number>(1);

  const [search, setSearch] = useState<TripsSearchState>({
    page: 1,
    per_page: 25,
    created_at: [startOfMonth.valueOf(), today.valueOf()].join(","),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");

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

  const selectPost = useCallback((postId: number) => {
    setActivePost(postId);
    setSearch((prev) => ({ ...prev, page: 1 }));
  }, []);

  const initializedRef = useRef(false);

  return {
    search,
    setSearch,
    filters,
    globalSearchInput,
    handleGlobalSearchChange,
    handleRefetch,
    activePost,
    setActivePost,
    selectPost,
    initializedRef,
  } as const;
}
