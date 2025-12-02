import dayjs from "dayjs";
import { useInvoicesGetInvoicesList } from "@/services/api/generated/invoices/invoices";
import type { InvoiceRow } from "@/components/invoices-list/types";

type InvoicesApiResponse = {
  current_page?: number;
  data?: InvoiceRow[];
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
};

export function useInvoicesData({
  search,
  filters,
}: {
  search: Record<string, any>;
  filters: Record<string, any>;
}) {
  const dueDateFilter = search.due_date as string | undefined;
  const dueDateFilterValues = dueDateFilter?.split(",");
  const from_date = dueDateFilterValues?.[0]
    ? dayjs(Number(dueDateFilterValues[0])).format("YYYY-MM-DD")
    : undefined;

  const to_date = dueDateFilterValues?.[1]
    ? dayjs(Number(dueDateFilterValues[1])).format("YYYY-MM-DD")
    : undefined;

  const { data, isPending } = useInvoicesGetInvoicesList<InvoicesApiResponse>(
    {
      per_page: search.per_page,
      q: search.q,
      sort: search.sort as any,
      direction: search.direction as any,
      ...(search.page ? ({ page: search.page } as any) : {}),
      ...(from_date ? ({ from_date } as any) : {}),
      ...(to_date ? ({ to_date } as any) : {}),
      ...(filters as any),
    } as any,
    {
      query: { enabled: true },
    },
  );

  const invoices = (data?.data as InvoiceRow[]) || [];
  const total = Number(data?.total || 0);

  const page = Number(data?.current_page || search.page || 1);
  const per_page = Number(data?.per_page || search.per_page || 25);

  return {
    invoices,
    total,
    page,
    per_page,
    isPending,
  } as const;
}
