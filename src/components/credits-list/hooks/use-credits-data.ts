import { useCreditsCreditsList } from "@/services/api/generated/credits/credits";
import type { CreditRow } from "@/components/credits-list/types";

type CreditsApiResponse = {
  current_page?: number;
  data?: CreditRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useCreditsData({
  search,
  from_date,
  to_date,
}: {
  search: Record<string, any>;
  from_date?: string;
  to_date?: string;
}) {
  const { data, isPending } = useCreditsCreditsList<CreditsApiResponse>(
    {
      per_page: search.per_page,
      type: search.type as any,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(from_date ? ({ from_date } as any) : {}),
      ...(to_date ? ({ to_date } as any) : {}),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const credits = (data?.data as CreditRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    credits,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
