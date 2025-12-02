import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";
import { ResponsiveDropDown } from "@/components/common";

import type { TicketRow } from "../types";
import type { TicketsDataTableRowAction } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<TicketRow, TicketsDataTableRowAction>) => void;
  tickets: TicketRow[];
};

type TicketStatusLabel = "To Do" | "In Progress" | "Done" | "Canceled";

const variantByStatus: Record<
  TicketStatusLabel,
  "default" | "destructive" | "secondary" | "outline"
> = {
  "To Do": "default",
  "In Progress": "secondary",
  Done: "outline",
  Canceled: "destructive",
};

const normalizeStatus = (raw?: string | null): TicketStatusLabel | undefined => {
  const key = (raw || "").toString().trim().toLowerCase().replace(/_/g, " ");
  const map: Record<string, TicketStatusLabel> = {
    "to do": "To Do",
    todo: "To Do",
    open: "To Do",
    "in progress": "In Progress",
    inprogress: "In Progress",
    "in-progress": "In Progress",
    resolved: "Done",
    done: "Done",
    closed: "Canceled",
    canceled: "Canceled",
    cancelled: "Canceled",
  };
  return map[key];
};

export function useTicketsListTableColumns({
  setRowAction,
  tickets,
}: Props): ColumnDef<TicketRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<TicketRow>[] = useMemo(
    () => [
      {
        id: "details",
        accessorKey: "details",
        header: t("ticketsTable.columns.details.label", { defaultValue: "Details" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TicketRow> }) => {
          const value = (row.original.details as any)?.details ?? "";
          return <span>{String(value)}</span>;
        },
        meta: {
          label: t("ticketsTable.columns.details.label", { defaultValue: "Details" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.details.label", { defaultValue: "Details" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "type",
        accessorKey: "type",
        header: t("ticketsTable.columns.type.label", { defaultValue: "Ticket Type" }),
        enableSorting: true,
        meta: {
          label: t("ticketsTable.columns.type.label", { defaultValue: "Ticket Type" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.type.label", { defaultValue: "Ticket Type" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "user_name",
        accessorKey: "user_name",
        header: t("ticketsTable.columns.assignee.label", { defaultValue: "Assignee" }),
        enableSorting: true,
        meta: {
          label: t("ticketsTable.columns.assignee.label", { defaultValue: "Assignee" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.assignee.label", { defaultValue: "Assignee" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "customer_name",
        accessorKey: "customer_name",
        header: t("ticketsTable.columns.customer.label", { defaultValue: "Customer" }),
        enableSorting: true,
        meta: {
          label: t("ticketsTable.columns.customer.label", { defaultValue: "Customer" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.customer.label", { defaultValue: "Customer" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "creator",
        accessorKey: "creator",
        header: t("ticketsTable.columns.creator.label", { defaultValue: "Creator" }),
        enableSorting: true,
        meta: {
          label: t("ticketsTable.columns.creator.label", { defaultValue: "Creator" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.creator.label", { defaultValue: "Creator" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("ticketsTable.columns.status.label", { defaultValue: "Status" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TicketRow> }) => {
          const norm = normalizeStatus(row.original.status);
          const label = norm
            ? t(`ticketsTable.columns.status.options.${norm}`, { defaultValue: norm })
            : (row.original.status || "").toString();
          return <Badge variant={norm ? variantByStatus[norm] : "outline"}>{label}</Badge>;
        },
        meta: {
          label: t("ticketsTable.columns.status.label", { defaultValue: "Status" }),
          variant: "select",
          options: (["To Do", "In Progress", "Done", "Canceled"] as TicketStatusLabel[]).map(
            (status) => ({
              label: t(`ticketsTable.columns.status.options.${status}`, { defaultValue: status }),
              value: status,
            }),
          ),
        },
        enableColumnFilter: true,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("ticketsTable.columns.createdAt.label", { defaultValue: "Created Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TicketRow> }) => {
          const value = row.original.created_at;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        meta: {
          label: t("ticketsTable.columns.createdAt.label", { defaultValue: "Created Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.createdAt.label", { defaultValue: "Created Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "updated_at",
        accessorKey: "updated_at",
        header: t("ticketsTable.columns.updatedAt.label", { defaultValue: "Last Updated" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TicketRow> }) => {
          const value = row.original.updated_at;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on updated_at
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const updated = row.getValue<string>(id);
          const ts = updated ? dayjs(updated).valueOf() : undefined;
          if (!ts) return false; // no updated date
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("ticketsTable.columns.updatedAt.label", { defaultValue: "Last Updated" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("ticketsTable.columns.updatedAt.label", { defaultValue: "Last Updated" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("ticketsTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => (
          <ResponsiveDropDown drawerTitle={t("ticketsTable.columns.actions.drawerTitle")}>
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
            </ResponsiveDropDown.Content>
          </ResponsiveDropDown>
        ),
      },
    ],
    [t, setRowAction, tickets],
  );

  return columns;
}
