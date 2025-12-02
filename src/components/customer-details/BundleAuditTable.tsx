import * as React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, DataTableToolbar } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsersGetCustomerBundles } from "@/services/api/generated/users/users";
import type { UsersGetCustomerBundlesParams } from "@/services/api/generated/azeel.schemas";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

interface BundleAuditTableProps {
  customerId: number;
}

type BundleAuditRow = {
  id: number | string;
  name?: string;
  price?: string | number | null;
  upto?: number | null;
  status?: string | null;
  extra_items?: number | null;
  extra_items_display?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
};

export function BundleAuditTable({ customerId }: BundleAuditTableProps) {
  const { t } = useTranslation();

  // Remote search/sort/pagination state (mirrors other tables like bundles list)
  const [search, setSearch] = React.useState<
    UsersGetCustomerBundlesParams & { page?: number }
  >({
    per_page: 25,
  });

  const [globalSearchInput, setGlobalSearchInput] = React.useState(search.q ?? "");

  const debouncedGlobalSearchUpdate = useDebouncedCallback((value: string) => {
    setSearch((prev) => ({
      ...prev,
      page: 1,
      q: value && value.trim() ? value : undefined,
    }));
  }, 300);

  const handleGlobalSearchChange = React.useCallback(
    (value: string) => {
      setGlobalSearchInput(value);
      debouncedGlobalSearchUpdate(value);
    },
    [debouncedGlobalSearchUpdate],
  );

  const handleRefetch = React.useCallback((params: Record<string, any>) => {
    setSearch((prev) => ({ ...prev, ...params }));
  }, []);

  const { data: rawData, isPending } = useUsersGetCustomerBundles<any>(
    customerId,
    {
      per_page: search.per_page,
      q: search.q,
      sort: search.sort,
      direction: search.direction,
      ...(search.page ? ({ page: search.page } as any) : {}),
    } as any,
    {
      query: {
        // Always enabled as long as we have a customerId
        enabled: !!customerId,
      },
    },
  );

  const { rows, total, page, per_page } = React.useMemo(() => {
    const root = rawData as any;
    const list = Array.isArray(root)
      ? root
      : root?.data ?? root?.items ?? root?.list ?? [];

    const mapped: BundleAuditRow[] = (list || []).map((item: any) => ({
      id: item?.id ?? `${item?.bundle_id ?? ""}-${item?.start_date ?? ""}`,
      name: item?.name,
      price: item?.price,
      upto: item?.upto ?? null,
      status: item?.status ?? null,
      extra_items: item?.extra_items ?? null,
      extra_items_display: item?.extra_items_display ?? null,
      start_date: item?.start_date ?? null,
      end_date: item?.end_date ?? null,
      created_at: item?.created_at ?? null,
    }));

    const totalCount = Number(root?.total || mapped.length || 0);
    const currentPage = Number(root?.current_page || search.page || 1);
    const perPage = Number(root?.per_page || search.per_page || 25);

    return {
      rows: mapped,
      total: totalCount,
      page: currentPage,
      per_page: perPage,
    } as const;
  }, [rawData, search.page, search.per_page]);

  const columns = React.useMemo<ColumnDef<BundleAuditRow>[]>(() => {
    return [
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("customer.bundle.audit.columns.date", { defaultValue: "Date" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.created_at;
          return (
            <span>{value ? dayjs(value).format("YYYY-MM-DD") : ""}</span>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: t("customer.bundle.audit.columns.name", { defaultValue: "Name" }),
        enableSorting: true,
      },
      {
        id: "service_period",
        header: t("customer.bundle.audit.columns.period", {
          defaultValue: "Service Period",
        }),
        enableSorting: false,
        cell: ({ row }) => {
          const start = row.original.start_date;
          const end = row.original.end_date;
          if (!start && !end) return null;
          return (
            <span>
              {start} - {end}
            </span>
          );
        },
      },
      {
        id: "price",
        accessorKey: "price",
        header: t("customer.bundle.audit.columns.price", { defaultValue: "Price" }),
        enableSorting: true,
      },
      {
        id: "upto",
        accessorKey: "upto",
        header: t("customer.bundle.audit.columns.upto", { defaultValue: "Up To" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.upto;
          return <span>{value != null ? String(value) : ""}</span>;
        },
      },
      {
        id: "extra_items",
        accessorKey: "extra_items",
        header: t("customer.bundle.audit.columns.extraItems", {
          defaultValue: "Extra Items",
        }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.extra_items;
          return <span>{value != null ? String(value) : ""}</span>;
        },
      },
    ];
  }, [t]);

  const tableConfig = React.useMemo(
    () => ({
      data: rows,
      refetch: handleRefetch,
      isLoading: isPending,
      columns,
      pageCount: Math.ceil((total || 1) / (per_page || 25)),
      getRowId: (row: BundleAuditRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: (page || 1) - 1,
          pageSize: per_page || 25,
        },
        columnVisibility: {},
      },
    }),
    [rows, handleRefetch, isPending, columns, total, per_page, page],
  );

  const { table } = useDataTable<BundleAuditRow>(tableConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("customer.bundle.audit.title", { defaultValue: "Bundle Audit" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable table={table} isLoading={isPending}>
          <DataTableToolbar
            table={table}
            singleSearchInput
            globalSearchValue={globalSearchInput}
            onGlobalSearchChange={handleGlobalSearchChange}
            globalSearchPlaceholder={t("search")}
          />
        </DataTable>
      </CardContent>
    </Card>
  );
}


