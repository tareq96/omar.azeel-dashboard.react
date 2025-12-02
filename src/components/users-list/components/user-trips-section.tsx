import * as React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useUsersGetUserTrips } from "@/services/api/generated/users/users";
import { useNavigate } from "@tanstack/react-router";

type UserTripRow = {
  id: number | string;
  code: string;
  path: string | null;
  status: string | null;
  date: string | null;
};

export default function UserTripsSection({
  userId,
  open,
}: {
  userId: number | undefined;
  open: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState<{ page?: number; per_page?: number; q?: string }>({
    page: 1,
    per_page: 25,
  });
  const [globalSearchInput, setGlobalSearchInput] = React.useState<string>("");

  const debouncedGlobalSearchUpdate = useDebouncedCallback((value: string) => {
    setSearch((prev) => ({ ...prev, page: 1, q: value && value.trim() ? value : undefined }));
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

  const { data: tripsRaw, isPending: tripsLoading } = useUsersGetUserTrips<any>(
    Number(userId || 0),
    {
      per_page: search.per_page,
      q: search.q,
      ...(search.page ? ({ page: search.page } as any) : {}),
    } as any,
    { query: { enabled: open && !!userId } },
  );

  const tripsData = React.useMemo(() => {
    const root = tripsRaw as any;
    const list = Array.isArray(root) ? root : (root?.data ?? root?.items ?? root?.list ?? []);
    const rows: UserTripRow[] = (list || []).map((r: any) => ({
      id: r?.id ?? String(r?.code ?? ""),
      code: r?.code ?? "",
      path: r?.path ?? null,
      status: r?.status ?? null,
      date: r?.date ?? r?.created_at ?? null,
    }));
    const total = Number(root?.total || 0);
    const page = Number(root?.current_page || search.page || 1);
    const per_page = Number(root?.per_page || search.per_page || 25);
    return { rows, total, page, per_page } as const;
  }, [tripsRaw, search.page, search.per_page]);

  const columns = React.useMemo<ColumnDef<UserTripRow>[]>(() => {
    return [
      {
        id: "code",
        accessorKey: "code",
        header: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
        enableSorting: true,
        cell: ({ row }) => {
          const id = row.original.id;
          const code = row.original.code ?? "";
          return (
            <button
              type="button"
              className="text-primary underline decoration-from-font underline-offset-2"
              onClick={() => navigate({ to: "/trips/$tripId", params: { tripId: String(id) } })}
            >
              {code}
            </button>
          );
        },
        meta: {
          label: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "path",
        accessorKey: "path",
        header: t("trips.fields.path", { defaultValue: "Path" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.path;
          return <span className="max-w-[240px] truncate">{value ?? ""}</span>;
        },
        meta: {
          label: t("trips.fields.path", { defaultValue: "Path" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("trips.fields.path", { defaultValue: "Path" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("tripsTable.columns.status.label", { defaultValue: "Status" }),
        enableSorting: true,
        cell: ({ row }) => {
          const raw = row.original.status ?? "";
          const normalized = String(raw).trim();
          const lower = normalized.toLowerCase().replace(/\s|-/g, "");
          const key =
            lower === "pending"
              ? "Pending"
              : lower === "inprogress" || lower === "in_progress"
                ? "InProgress"
                : lower === "completed" || lower === "complete"
                  ? "Completed"
                  : normalized;
          const label = normalized
            ? t(`tripsTable.columns.status.options.${key}`, {
                defaultValue: key === "InProgress" ? "In Progress" : key,
              })
            : "";
          return <span>{label}</span>;
        },
        meta: {
          label: t("tripsTable.columns.status.label", { defaultValue: "Status" }),
          variant: "select",
          options: ["Pending", "InProgress", "Completed"].map((status) => ({
            label: t(`tripsTable.columns.status.options.${status}`, {
              defaultValue: status === "InProgress" ? "In Progress" : status,
            }),
            value: status,
          })),
        },
        enableColumnFilter: true,
      },
      {
        id: "date",
        accessorKey: "date",
        header: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const dateStr = row.getValue<string>(id);
          const ts = dateStr ? dayjs(dateStr).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
    ];
  }, [t]);

  const tableConfig = React.useMemo(
    () => ({
      data: tripsData.rows,
      refetch: handleRefetch,
      isLoading: tripsLoading,
      columns,
      pageCount: Math.ceil((tripsData.total || 1) / (tripsData.per_page || 25)),
      getRowId: (row: UserTripRow) => String(row.id),
      enableColumnResizing: true,
      initialState: {
        pagination: {
          pageIndex: (tripsData.page || 1) - 1,
          pageSize: tripsData.per_page || 25,
        },
        columnVisibility: {},
      },
    }),
    [
      tripsData.rows,
      handleRefetch,
      tripsLoading,
      columns,
      tripsData.total,
      tripsData.per_page,
      tripsData.page,
    ],
  );

  const { table } = useDataTable<UserTripRow>(tableConfig);

  return (
    <DataTable table={table} isLoading={tripsLoading}>
      <DataTableToolbar
        table={table}
        singleSearchInput
        globalSearchValue={globalSearchInput}
        onGlobalSearchChange={handleGlobalSearchChange}
        globalSearchPlaceholder={t("search")}
        extraFilterColumnIds={["date"]}
        settingsMenuConfig={{
          allowColumnReorder: true,
          allowColumnVisibility: true,
          allowColumnResizing: true,
          storagePrefix: "userTripsTable",
        }}
      />
    </DataTable>
  );
}
