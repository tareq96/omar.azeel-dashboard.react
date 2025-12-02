import { useAddressesAddressesList } from "@/services/api/generated/addresses/addresses";
import type { AddressRow } from "@/components/addresses-list/types";

type AddressesApiResponse = {
  current_page?: number;
  data?: AddressRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useAddressesData({
  search,
  filters,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
}) {
  const { data, isPending } = useAddressesAddressesList<AddressesApiResponse>(
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

  const addresses = (data?.data as AddressRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    addresses,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
