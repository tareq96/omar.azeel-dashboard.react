import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef, Row } from "@tanstack/react-table";

import type { CreditRow } from "../types";

export function useCreditsListTableColumns({
  credits,
}: {
  credits: CreditRow[];
}): ColumnDef<CreditRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<CreditRow>[] = useMemo(
    () => [
      {
        id: "date",
        header: t("creditsTable.columns.date.label", { defaultValue: "Date" }),
        accessorFn: (row) => row.date ?? row.created_at ?? null,
        enableSorting: true,
        cell: ({ row }: { row: Row<CreditRow> }) => {
          const value = (row.original.date ?? row.original.created_at) as string | null | undefined;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        // Client-side filter for date range on date
        filterFn: (row, id, filterValue) => {
          if (!filterValue) return true;
          const parts = Array.isArray(filterValue) ? filterValue : String(filterValue).split(",");
          const from = parts[0] ? Number(parts[0]) : undefined;
          const to = parts[1] ? Number(parts[1]) : undefined;
          const value = (row.original.date ?? row.original.created_at) as string | null | undefined;
          const ts = value ? dayjs(value).valueOf() : undefined;
          if (!ts) return false;
          if (from && to) return ts >= from && ts <= to;
          if (from) return ts >= from;
          if (to) return ts <= to;
          return true;
        },
        meta: {
          label: t("creditsTable.columns.date.label", { defaultValue: "Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("creditsTable.columns.date.label", { defaultValue: "Date" }),
          }),
          variant: "dateRange" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "customer",
        header: t("creditsTable.columns.customer.label", { defaultValue: "Customer" }),
        accessorFn: (row) => row.customer ?? row.customer_name ?? row.user_name ?? row.name ?? null,
        enableSorting: true,
        cell: ({ row }) => {
          const value = (row.original.customer ??
            row.original.customer_name ??
            row.original.user_name ??
            row.original.name) as string | null | undefined;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("creditsTable.columns.customer.label", { defaultValue: "Customer" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("creditsTable.columns.customer.label", { defaultValue: "Customer" }),
          }),
          variant: "text" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "amount",
        header: t("creditsTable.columns.amount.label", { defaultValue: "Amount" }),
        accessorFn: (row) => row.amount ?? null,
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.amount;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("creditsTable.columns.amount.label", { defaultValue: "Amount" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("creditsTable.columns.amount.label", { defaultValue: "Amount" }),
          }),
          variant: "number" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "type",
        header: t("creditsTable.columns.type.label", { defaultValue: "Type" }),
        accessorKey: "type",
        enableSorting: true,
        cell: ({ row }) => {
          const raw = (row.original.type || "").toString().trim();
          const label = t(`creditsTable.columns.type.options.${raw}`, { defaultValue: raw });
          return <span>{label}</span>;
        },
        meta: {
          label: t("creditsTable.columns.type.label", { defaultValue: "Type" }),
          variant: "select" as const,
          options: (
            ["Credit", "Credit_Card", "PayPal", "Invoice", "Topup", "Promo", "Debit"] as const
          ).map((value) => ({
            label: t(`creditsTable.columns.type.options.${value}`, { defaultValue: value }),
            value,
          })),
        },
        enableColumnFilter: true,
      },
      {
        id: "notes",
        header: t("creditsTable.columns.notes.label", { defaultValue: "Notes" }),
        accessorFn: (row) => row.notes ?? row.note ?? null,
        enableSorting: false,
        cell: ({ row }) => {
          const value = row.original.notes ?? row.original.note;
          return <span>{value ?? ""}</span>;
        },
        meta: {
          label: t("creditsTable.columns.notes.label", { defaultValue: "Notes" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("creditsTable.columns.notes.label", { defaultValue: "Notes" }),
          }),
          variant: "text" as const,
        },
        enableColumnFilter: true,
      },
    ],
    [t, credits],
  );

  return columns;
}
