import dayjs from "dayjs";
import { useTripsGetTripsList } from "@/services/api/generated/trips/trips";
import type { TripRow } from "@/components/trips-list/types";

type TripsApiResponse = {
  current_page?: number;
  data?: TripRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useTripsData({
  search,
  filters,
  activePost,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
  activePost: number;
}) {
  const { data, isPending, refetch } = useTripsGetTripsList<TripsApiResponse>(
    String(search.per_page || 25),
    {
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      post: activePost,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(search.created_at
        ? (() => {
            const values = (search.created_at || "").split(",");
            const from = values[0] ? dayjs(Number(values[0])).format("YYYY-MM-DD") : undefined;
            const to = values[1] ? dayjs(Number(values[1])).format("YYYY-MM-DD") : undefined;
            return {
              ...(from ? ({ from_date: from } as any) : {}),
              ...(to ? ({ to_date: to } as any) : {}),
            };
          })()
        : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const trips: TripRow[] = (data?.data as TripRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    trips,
    total,
    page,
    per_page,
    isPending,
    refetch,
  } as const;
}
