import type { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

import type { InvoiceRow } from "../types";

type Props = {
  invoices: InvoiceRow[];
};

export function useInvoicesListTableColumns({ invoices }: Props): ColumnDef<InvoiceRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<InvoiceRow>[] = useMemo(
    () => [
      {
        id: "due_date",
        accessorKey: "due_date",
        header: t("invoicesTable.columns.dueDate.label", { defaultValue: "Due Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<InvoiceRow> }) => {
          const value = row.original.due_date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on due_date
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const due = row.getValue<string>(id);
          const ts = due ? dayjs(due).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("invoicesTable.columns.dueDate.label", { defaultValue: "Due Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("invoicesTable.columns.dueDate.label", { defaultValue: "Due Date" }),
          }),
          variant: "dateRange" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "code",
        accessorKey: "code",
        header: t("invoicesTable.columns.code.label", { defaultValue: "Code" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.code || "";
          return <span dir={"ltr"}>{value}</span>;
        },
        meta: {
          label: t("invoicesTable.columns.code.label", { defaultValue: "Code" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("invoicesTable.columns.code.label", { defaultValue: "Code" }),
          }),
          variant: "text" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "user",
        header: t("invoicesTable.columns.user.label", { defaultValue: "User" }),
        accessorFn: (row) => row.user ?? row.user_name ?? row.customer ?? row.customer_name ?? null,
        enableSorting: true,
        cell: ({ row }) => {
          const value =
            row.original.user ??
            row.original.user_name ??
            row.original.customer ??
            row.original.customer_name;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("invoicesTable.columns.user.label", { defaultValue: "User" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("invoicesTable.columns.user.label", { defaultValue: "User" }),
          }),
          variant: "text" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "order",
        header: t("invoicesTable.columns.order.label", { defaultValue: "Order" }),
        accessorFn: (row) => row.order ?? row.order_id ?? null,
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.order ?? row.original.order_id;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("invoicesTable.columns.order.label", { defaultValue: "Order" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("invoicesTable.columns.order.label", { defaultValue: "Order" }),
          }),
          variant: "text" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "due_amount",
        header: t("invoicesTable.columns.dueAmount.label", { defaultValue: "Due Amount" }),
        accessorFn: (row) => row.due_amount ?? row.amount ?? null,
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.due_amount ?? row.original.amount;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("invoicesTable.columns.dueAmount.label", { defaultValue: "Due Amount" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("invoicesTable.columns.dueAmount.label", { defaultValue: "Due Amount" }),
          }),
          variant: "number" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("invoicesTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          const handlePrint = () => {
            const url = row.original.print_url || undefined;
            if (url) {
              try {
                window.open(url, "_blank");
                return;
              } catch (_) {
                // fall through
              }
            }
            window.print();
          };
          return (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={handlePrint}
              aria-label={t("invoicesTable.columns.actions.print")}
            >
              <Printer className="size-4" />
            </Button>
          );
        },
      },
    ],
    [t, invoices],
  );

  return columns;
}
