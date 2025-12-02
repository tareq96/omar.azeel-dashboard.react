import type { ColumnDef, Row } from "@tanstack/react-table";
import { CircleDashed, Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";
import { ResponsiveDropDown } from "@/components/common";

import type { TopupsDataTableRowAction } from "../types";
import type { TopupRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<TopupRow, TopupsDataTableRowAction>) => void;
  topups: TopupRow[];
};

type TopupStatusLabel = "New" | "Requested" | "Used";

const variantByStatus: Record<
  TopupStatusLabel,
  "default" | "destructive" | "secondary" | "outline"
> = {
  New: "default",
  Requested: "secondary",
  Used: "outline",
};

export function useTopupsListTableColumns({ setRowAction, topups }: Props): ColumnDef<TopupRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<TopupRow>[] = useMemo(
    () => [
      {
        id: "number",
        accessorKey: "number",
        header: t("topupsTable.columns.number.label", { defaultValue: "Number" }),
        enableSorting: true,
        meta: {
          label: t("topupsTable.columns.number.label", { defaultValue: "Number" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("topupsTable.columns.number.label", { defaultValue: "Number" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("topupsTable.columns.status.label", { defaultValue: "Status" }),
        enableSorting: true,
        cell: ({ row }) => {
          const status = (row.original.status || "").toString().trim() as TopupStatusLabel;
          const label = t(`topupsTable.columns.status.options.${status}`, { defaultValue: status });
          return <Badge variant={variantByStatus[status] ?? "outline"}>{label}</Badge>;
        },
        meta: {
          label: t("topupsTable.columns.status.label", { defaultValue: "Status" }),
          variant: "select",
          options: (["New", "Requested", "Used"] as TopupStatusLabel[]).map((s) => ({
            label: t(`topupsTable.columns.status.options.${s}`, { defaultValue: s }),
            value: s,
          })),
          icon: CircleDashed,
        },
        enableColumnFilter: true,
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("topupsTable.columns.amount.label", { defaultValue: "Amount" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.amount;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("topupsTable.columns.amount.label", { defaultValue: "Amount" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("topupsTable.columns.amount.label", { defaultValue: "Amount" }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "customer_name",
        accessorKey: "customer_name",
        header: t("topupsTable.columns.customer.label", { defaultValue: "Customer" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.customer_name || "";
          return <span>{value}</span>;
        },
        meta: {
          label: t("topupsTable.columns.customer.label", { defaultValue: "Customer" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("topupsTable.columns.customer.label", { defaultValue: "Customer" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "staff_name",
        accessorKey: "staff_name",
        header: t("topupsTable.columns.staff.label", { defaultValue: "Staff" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.staff_name || "";
          return <span>{value}</span>;
        },
        meta: {
          label: t("topupsTable.columns.staff.label", { defaultValue: "Staff" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("topupsTable.columns.staff.label", { defaultValue: "Staff" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "charge_date",
        accessorKey: "charge_date",
        header: t("topupsTable.columns.chargeDate.label", { defaultValue: "Charge Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TopupRow> }) => {
          const value = row.original.charge_date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on charge_date
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const charged = row.getValue<string>(id);
          const ts = charged ? dayjs(charged).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("topupsTable.columns.chargeDate.label", { defaultValue: "Charge Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("topupsTable.columns.chargeDate.label", { defaultValue: "Charge Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("topupsTable.columns.createdAt.label", { defaultValue: "Created Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TopupRow> }) => {
          const value = row.original.created_at;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on created_at
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const created = row.getValue<string>(id);
          const ts = created ? dayjs(created).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("topupsTable.columns.createdAt.label", { defaultValue: "Created Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("topupsTable.columns.createdAt.label", { defaultValue: "Created Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("topupsTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => (
          <ResponsiveDropDown drawerTitle={t("topupsTable.columns.actions.drawerTitle")}>
            <ResponsiveDropDown.Trigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </ResponsiveDropDown.Trigger>
            <ResponsiveDropDown.Content>
              <ResponsiveDropDown.Item onSelect={() => setRowAction({ row, variant: "edit" })}>
                <Edit2Icon className="size-4" />
                {t("common.edit")}
              </ResponsiveDropDown.Item>
              <ResponsiveDropDown.Item
                variant="destructive"
                onSelect={() =>
                  setRowAction({ row, variant: "delete" as TopupsDataTableRowAction })
                }
              >
                <TrashIcon className="size-4" />
                {t("common.delete")}
              </ResponsiveDropDown.Item>
            </ResponsiveDropDown.Content>
          </ResponsiveDropDown>
        ),
      },
    ],
    [t, setRowAction, topups],
  );

  return columns;
}
