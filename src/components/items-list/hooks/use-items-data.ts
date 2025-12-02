import { useItemsItemsList } from "@/services/api/generated/items/items";
import type { ItemRow } from "@/components/items-list/types";

type ItemsApiResponse = {
  current_page?: number;
  data?: ItemRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useItemsData({
  search,
  filters,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
}) {
  const { data, isPending } = useItemsItemsList<ItemsApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const items = (data?.data as ItemRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    items,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
