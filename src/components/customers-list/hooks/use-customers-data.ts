import { useUsersGetCustomers } from "@/services/api/generated/users/users";

type CustomersApiResponse = {
  current_page?: number;
  data?: any[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useCustomersData({
  search,
  filters,
  created_at_from,
  created_at_to,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
  created_at_from?: string;
  created_at_to?: string;
}) {
  const { data, isPending } = useUsersGetCustomers<CustomersApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(created_at_from ? ({ from_date: created_at_from } as any) : {}),
      ...(created_at_to ? ({ to_date: created_at_to } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const customers = (data?.data as any[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    customers,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
