import { useUsersGetUsers } from "@/services/api/generated/users/users";

type UsersApiResponse = {
  current_page?: number;
  data?: any[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useDriversData(
  activePost: number,
  search: Record<string, any>,
  filters: Record<string, any>,
) {
  const { data, isPending } = useUsersGetUsers<UsersApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      post: activePost,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const users = (data?.data as any[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    users,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
