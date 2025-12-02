import { useBundlesBundlesList } from "@/services/api/generated/bundles/bundles";
import type { BundleRow } from "@/components/bundles-list/types";

type BundlesApiResponse = {
  current_page?: number;
  data?: BundleRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useBundlesData({
  search,
  filters,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
}) {
  const { data, isPending } = useBundlesBundlesList<BundlesApiResponse>(
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

  const bundles = (data?.data as BundleRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    bundles,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
