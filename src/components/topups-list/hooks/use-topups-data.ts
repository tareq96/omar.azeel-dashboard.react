import { useTopupsTopupsList } from "@/services/api/generated/topups/topups";
import type { TopupRow } from "@/components/topups-list/types";

type TopupsApiResponse = {
  current_page?: number;
  data?: TopupRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useTopupsData({
  search,
  filters,
  created_at_from,
  created_at_to,
  from_charge_date,
  to_charge_date,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
  created_at_from?: string;
  created_at_to?: string;
  from_charge_date?: string;
  to_charge_date?: string;
}) {
  const { data, isPending } = useTopupsTopupsList<TopupsApiResponse>(
    {
      per_page: search.per_page,
      status: search.status as any,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(created_at_from ? ({ from_date: created_at_from } as any) : {}),
      ...(created_at_to ? ({ to_date: created_at_to } as any) : {}),
      ...(from_charge_date ? ({ from_charge_date } as any) : {}),
      ...(to_charge_date ? ({ to_charge_date } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const topups = (data?.data as TopupRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    topups,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
