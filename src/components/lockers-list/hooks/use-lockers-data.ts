import { useLockersLockersList } from "@/services/api/generated/lockers/lockers";
import type { LockerRow } from "@/components/lockers-list/types";

type LockersApiResponse = {
  current_page?: number;
  data?: LockerRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useLockersData({
  search,
  filters,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
}) {
  const { data, isPending } = useLockersLockersList<LockersApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      status: search.status,
      sort: search.sort,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const lockers = (data?.data as LockerRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    lockers,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
