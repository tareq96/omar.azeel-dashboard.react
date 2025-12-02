import { useMessagesMessagesList } from "@/services/api/generated/messages/messages";
import type { MessageRow } from "@/components/messages-list/types";

type MessagesApiResponse = {
  current_page?: number;
  data?: MessageRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useMessagesData({
  search,
  filters,
  from_date,
  to_date,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
  from_date?: string;
  to_date?: string;
}) {
  const { data, isPending } = useMessagesMessagesList<MessagesApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(search.sort ? ({ sort: search.sort } as any) : {}),
      ...(search.direction ? ({ direction: search.direction } as any) : {}),
      ...(from_date ? ({ from_date } as any) : {}),
      ...(to_date ? ({ to_date } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const messages: MessageRow[] = (data?.data as MessageRow[]) || [];
  const total = Number(data?.total || 0);
  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    messages,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
