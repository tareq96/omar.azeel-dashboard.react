import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";
import { ResponsiveDropDown } from "@/components/common";

import type { PromosDataTableRowAction, PromoRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<PromoRow, PromosDataTableRowAction>) => void;
  promos: PromoRow[];
};

type PromoStatusLabel = "Pending" | "Active" | "Inactive";

const variantByStatus: Record<
  PromoStatusLabel,
  "default" | "destructive" | "secondary" | "outline"
> = {
  Pending: "secondary",
  Active: "default",
  Inactive: "destructive",
};

export function usePromosListTableColumns({ setRowAction, promos }: Props): ColumnDef<PromoRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<PromoRow>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("promosTable.columns.name.label", { defaultValue: "Name" }),
        enableSorting: true,
        meta: {
          label: t("promosTable.columns.name.label", { defaultValue: "Name" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.name.label", { defaultValue: "Name" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("promosTable.columns.status.label", { defaultValue: "Status" }),
        enableSorting: true,
        cell: ({ row }) => {
          const status = (row.original.status || "").toString().trim() as PromoStatusLabel;
          const label = t(`promosTable.columns.status.options.${status}`, { defaultValue: status });
          return <Badge variant={variantByStatus[status] ?? "outline"}>{label}</Badge>;
        },
        meta: {
          label: t("promosTable.columns.status.label", { defaultValue: "Status" }),
          variant: "select",
          options: (["Pending", "Active", "Inactive"] as PromoStatusLabel[]).map((s) => ({
            label: t(`promosTable.columns.status.options.${s}`, { defaultValue: s }),
            value: s,
          })),
        },
        enableColumnFilter: true,
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("promosTable.columns.amount.label", { defaultValue: "Amount" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.amount;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("promosTable.columns.amount.label", { defaultValue: "Amount" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.amount.label", { defaultValue: "Amount" }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "percent",
        accessorKey: "percent",
        header: t("promosTable.columns.percent.label", { defaultValue: "Percent" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.percent;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("promosTable.columns.percent.label", { defaultValue: "Percent" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.percent.label", { defaultValue: "Percent" }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "beneficiaries",
        accessorKey: "beneficiaries",
        header: t("promosTable.columns.beneficiaries.label", { defaultValue: "Beneficiaries" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.beneficiaries;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("promosTable.columns.beneficiaries.label", { defaultValue: "Beneficiaries" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.beneficiaries.label", {
              defaultValue: "Beneficiaries",
            }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "start_date",
        accessorKey: "start_date",
        header: t("promosTable.columns.startDate.label", { defaultValue: "Start Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<PromoRow> }) => {
          const value = row.original.start_date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on start_date
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const start = row.getValue<string>(id);
          const ts = start ? dayjs(start).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("promosTable.columns.startDate.label", { defaultValue: "Start Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.startDate.label", { defaultValue: "Start Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "end_date",
        accessorKey: "end_date",
        header: t("promosTable.columns.endDate.label", { defaultValue: "End Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<PromoRow> }) => {
          const value = row.original.end_date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on end_date
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const end = row.getValue<string>(id);
          const ts = end ? dayjs(end).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("promosTable.columns.endDate.label", { defaultValue: "End Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.endDate.label", { defaultValue: "End Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("promosTable.columns.createdAt.label", { defaultValue: "Created Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<PromoRow> }) => {
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
          label: t("promosTable.columns.createdAt.label", { defaultValue: "Created Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("promosTable.columns.createdAt.label", { defaultValue: "Created Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("promosTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => (
          <ResponsiveDropDown drawerTitle={t("promosTable.columns.actions.drawerTitle")}>
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
                  setRowAction({ row, variant: "delete" as PromosDataTableRowAction })
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
    [t, setRowAction, promos],
  );

  return columns;
}
