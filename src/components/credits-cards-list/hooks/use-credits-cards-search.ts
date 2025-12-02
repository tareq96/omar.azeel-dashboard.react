import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { CREDITS_CARDS_DEFAULT_SORT } from "@/components/credits-cards-list/constants";

export type CreditsCardsSearchState = {
  page?: number;
  per_page?: number;
  type?: string;
  q?: string;
  sort?: string;
  direction?: string;
  date?: string; // comma-separated timestamps (ms): from,to
  [key: string]: any;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 25;

export const getInitialDateRange = () => {
  const startOfMonth = dayjs().startOf("month");
  const today = dayjs();
  return [startOfMonth.valueOf(), today.valueOf()].join(",");
};

export const parseDateFilter = (dateFilter?: string) => {
  if (!dateFilter) return { from_date: undefined, to_date: undefined };
  const [from, to] = dateFilter.split(",");
  return {
    from_date: from ? dayjs(Number(from)).format("YYYY-MM-DD") : undefined,
    to_date: to ? dayjs(Number(to)).format("YYYY-MM-DD") : undefined,
  };
};

export function useCreditsCardsSearch(initial?: CreditsCardsSearchState) {
  const [search, setSearch] = useState<CreditsCardsSearchState>({
    page: DEFAULT_PAGE,
    per_page: DEFAULT_PER_PAGE,
    sort: CREDITS_CARDS_DEFAULT_SORT,
    direction: "desc",
    date: getInitialDateRange(),
    ...(initial || {}),
  });

  const [globalSearchInput, setGlobalSearchInput] = useState<string>(search.q ?? "");
  const initializedRef = useRef(false);

  const { from_date, to_date } = useMemo(() => parseDateFilter(search.date), [search.date]);

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(
          ([key, value]) => !["page", "date"].includes(key) && Boolean(value),
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
      page: DEFAULT_PAGE,
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
    initializedRef,
  } as const;
}
