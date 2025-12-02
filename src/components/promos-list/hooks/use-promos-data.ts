import { usePromosPromosList } from "@/services/api/generated/promos/promos";
import type { PromoRow } from "@/components/promos-list/types";

type PromosApiResponse = {
  current_page?: number;
  data?: PromoRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function usePromosData({
  search,
  filters,
  created_at_from,
  created_at_to,
  start_from_date,
  start_to_date,
  end_from_date,
  end_to_date,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
  created_at_from?: string;
  created_at_to?: string;
  start_from_date?: string;
  start_to_date?: string;
  end_from_date?: string;
  end_to_date?: string;
}) {
  const { data, isPending } = usePromosPromosList<PromosApiResponse>(
    {
      per_page: search.per_page,
      status: search.status as any,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(created_at_from ? ({ from_date: created_at_from } as any) : {}),
      ...(created_at_to ? ({ to_date: created_at_to } as any) : {}),
      ...(start_from_date ? ({ start_from_date } as any) : {}),
      ...(start_to_date ? ({ start_to_date } as any) : {}),
      ...(end_from_date ? ({ end_from_date } as any) : {}),
      ...(end_to_date ? ({ end_to_date } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const promos = (data?.data as PromoRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    promos,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
