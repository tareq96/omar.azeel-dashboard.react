import type { ColumnDef } from "@tanstack/react-table";
import { CircleDashed, Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";

import { ResponsiveDropDown } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";
import { useMemo } from "react";

import type { UsersDataTableRowAction, CustomerRow } from "../types";
import dayjs from "dayjs";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<CustomerRow, UsersDataTableRowAction>) => void;
  customers: CustomerRow[];
};

const statusVariantMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  inactive: "destructive",
  pending: "secondary",
};

export function useCustomersListTableColumns({
  setRowAction,
  customers,
}: Props): ColumnDef<CustomerRow>[] {
  const { t } = useTranslation();
  const router = useRouter();

  const columns: ColumnDef<CustomerRow>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("customersTable.columns.name.label"),
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() =>
                router.navigate({
                  // Cast to any because the generated route types may not be updated yet.
                  // Runtime route is "/_authenticated/customers/$customerId".
                  to: "/customers/$customerId" as any,
                  params: { customerId: String(row.original.id) } as any,
                })
              }
            >
              {row.original.name}
            </button>
          );
        },
        meta: {
          label: t("customersTable.columns.name.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.name.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "dynamic_id",
        accessorKey: "dynamic_id",
        header: t("customersTable.columns.customerId.label"),
        enableSorting: true,
        cell: ({ row }) => {
          return <span dir={"ltr"}>{row.original.dynamic_id}</span>;
        },
        meta: {
          label: t("customersTable.columns.customerId.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.customerId.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "mobile",
        accessorKey: "mobile",
        header: t("customersTable.columns.mobile.label"),
        enableSorting: true,
        cell: ({ row }) => {
          return <span dir={"ltr"}>{row.original.mobile}</span>;
        },
        meta: {
          label: t("customersTable.columns.mobile.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.mobile.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: t("customersTable.columns.email.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const email = (row.original.email || "").toString().trim();
          return <span>{email}</span>;
        },
        meta: {
          label: t("customersTable.columns.email.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.email.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "area",
        accessorKey: "area",
        header: t("customersTable.columns.area.label"),
        enableSorting: true,
        meta: {
          label: t("customersTable.columns.area.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.area.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("customersTable.columns.registrationDate.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.created_at;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        meta: {
          label: t("customersTable.columns.registrationDate.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.registrationDate.label"),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "balance",
        accessorKey: "balance",
        header: t("customersTable.columns.balance.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.balance;
          return <span>{value === null || value === undefined ? "" : String(value)}</span>;
        },
        meta: {
          label: t("customersTable.columns.balance.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("customersTable.columns.balance.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("customersTable.columns.status.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const statusKey = (row.original.status || "").toString().trim().toLowerCase();
          const label = t(`customersTable.columns.status.options.${statusKey}`);
          return <Badge variant={statusVariantMap[statusKey] ?? "outline"}>{label}</Badge>;
        },
        meta: {
          label: t("customersTable.columns.status.label"),
          variant: "select",
          options: ["Active", "Inactive"].map((status) => ({
            label: t(`customersTable.columns.status.options.${status.toLowerCase()}`),
            value: status,
          })),
          icon: CircleDashed,
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("customersTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <ResponsiveDropDown>
              <ResponsiveDropDown.Trigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </ResponsiveDropDown.Trigger>
              <ResponsiveDropDown.Content>
                <ResponsiveDropDown.Item
                  onSelect={() =>
                    router.navigate({
                      to: "/_authenticated/customers/$customerId" as any,
                      params: { customerId: String(row.original.id) } as any,
                      search: { edit: true } as any,
                    })
                  }
                >
                  <Edit2Icon className="mr-2 h-4 w-4" />
                  {t("customersTable.columns.actions.options.edit.label")}
                </ResponsiveDropDown.Item>
                <ResponsiveDropDown.Item
                  variant="destructive"
                  onSelect={() =>
                    setRowAction({ row, variant: "delete" as UsersDataTableRowAction })
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                  {t("delete")}
                </ResponsiveDropDown.Item>
              </ResponsiveDropDown.Content>
            </ResponsiveDropDown>
          );
        },
      },
    ],
    [t, setRowAction, customers],
  );

  return columns;
}
