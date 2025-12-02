import * as React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { useTripsAudits } from "@/services/api/generated/trips/trips";
import { DataTable } from "@/components/data-table";
import { useDataTable } from "@/hooks/use-data-table";

type AuditRow = {
  id: string | number;
  event: string | null;
  user: string | null;
  date: string | null;
};

export function TripAuditsSection({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState<{ page?: number; per_page?: number }>({
    page: 1,
    per_page: 25,
  });
  const handleRefetch = React.useCallback((params: Record<string, any>) => {
    setSearch((prev) => ({ ...prev, ...params }));
  }, []);

  const { data: auditsRaw, isPending: auditsLoading } = useTripsAudits<any>(
    Number(tripId || 0),
    {
      per_page: search.per_page,
      ...(search.page ? ({ page: search.page } as any) : {}),
    } as any,
    { query: { enabled: !!tripId } },
  );

  const auditsData = React.useMemo(() => {
    const root = auditsRaw as any;
    const list = Array.isArray(root) ? root : (root?.data ?? root?.items ?? root?.list ?? []);
    const rows: AuditRow[] = (list || []).map((r: any) => ({
      id: r?.id ?? String(r?.event ?? ""),
      event: r?.event ?? r?.type ?? null,
      user: r?.user?.name ?? r?.auditor ?? null,
      date: r?.created_at ?? r?.timestamp ?? null,
    }));
    const total = Number(root?.total || rows.length || 0);
    const page = Number(root?.current_page || search.page || 1);
    const per_page = Number(root?.per_page || search.per_page || 25);
    return { rows, total, page, per_page } as const;
  }, [auditsRaw, search.page, search.per_page]);

  const columns = React.useMemo<ColumnDef<AuditRow>[]>(() => {
    return [
      {
        id: "event",
        accessorKey: "event",
        header: t("trips.audits.columns.event.label", { defaultValue: "Event" }),
        enableSorting: false,
        cell: ({ row }) => {
          const raw = row.original.event ?? "";
          const normalized = String(raw).trim();
          const lower = normalized.toLowerCase().replace(/\s|-/g, "");
          const key =
            lower === "created"
              ? "Created"
              : lower === "updated"
                ? "Updated"
                : lower === "deleted"
                  ? "Deleted"
                  : lower === "restored"
                    ? "Restored"
                    : normalized;
          const label = normalized
            ? t(`trips.audits.columns.event.options.${key}` as const, {
                defaultValue:
                  key === "Created"
                    ? "Created"
                    : key === "Updated"
                      ? "Updated"
                      : key === "Deleted"
                        ? "Deleted"
                        : key === "Restored"
                          ? "Restored"
                          : normalized,
              })
            : "";
          return <span>{label}</span>;
        },
      },
      {
        id: "user",
        accessorKey: "user",
        header: t("trips.audits.columns.user.label", { defaultValue: "User" }),
        enableSorting: false,
      },
      {
        id: "date",
        accessorKey: "date",
        header: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
        enableSorting: false,
        cell: ({ row }) => {
          const value = row.original.date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
      },
    ];
  }, [t]);

  const tableConfig = React.useMemo(
    () => ({
      data: auditsData.rows,
      refetch: handleRefetch,
      isLoading: auditsLoading,
      columns,
      pageCount: Math.ceil((auditsData.total || 1) / (auditsData.per_page || 25)),
      getRowId: (row: AuditRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: (auditsData.page || 1) - 1,
          pageSize: auditsData.per_page || 25,
        },
        columnVisibility: {},
      },
    }),
    [
      auditsData.rows,
      handleRefetch,
      auditsLoading,
      columns,
      auditsData.total,
      auditsData.per_page,
      auditsData.page,
    ],
  );

  const { table } = useDataTable<AuditRow>(tableConfig);

  return <DataTable table={table} isLoading={auditsLoading} />;
}
