import type { ColumnDef } from "@tanstack/react-table";
import { CircleDashed, Edit2Icon, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ResponsiveDropDown } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";

import { useMemo } from "react";
import type { UsersDataTableRowAction } from "../types";
import type { UserRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<UserRow, UsersDataTableRowAction>) => void;
  users: UserRow[];
};

const statusVariantMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  inactive: "destructive",
  pending: "secondary",
};

export function useUsersListTableColumns({ setRowAction, users }: Props): ColumnDef<UserRow>[] {
  const { t } = useTranslation();

  // Only needed columns; no type options required anymore

  const columns: ColumnDef<UserRow>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("usersTable.columns.name.label"),
        enableSorting: true,
        meta: {
          label: t("usersTable.columns.name.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("usersTable.columns.name.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: t("usersTable.columns.email.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const email = (row.original.email || "").toString().trim();
          return <span>{email}</span>;
        },
        meta: {
          label: t("usersTable.columns.email.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("usersTable.columns.email.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("usersTable.columns.status.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const statusKey = (row.original.status || "").toString().trim().toLowerCase();
          const label = t(`usersTable.columns.status.options.${statusKey}`);
          return <Badge variant={statusVariantMap[statusKey] ?? "outline"}>{label}</Badge>;
        },
        meta: {
          label: t("usersTable.columns.status.label"),
          variant: "select",
          options: ["Active", "Inactive"].map((status) => ({
            label: t(`usersTable.columns.status.options.${status.toLowerCase()}`),
            value: status,
          })),
          icon: CircleDashed,
        },
        enableColumnFilter: true,
      },
      {
        id: "mobile",
        accessorKey: "mobile",
        header: t("usersTable.columns.mobile.label"),
        enableSorting: true,
        cell: ({ row }) => {
          return <span dir={"ltr"}>{row.original.mobile}</span>;
        },
        meta: {
          label: t("usersTable.columns.mobile.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("usersTable.columns.mobile.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      // Only keep: name, status, mobile, email, actions
      {
        id: "actions",
        header: t("usersTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <ResponsiveDropDown drawerTitle={t("usersTable.columns.actions.drawerTitle")}>
              <ResponsiveDropDown.Trigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </ResponsiveDropDown.Trigger>
              <ResponsiveDropDown.Content>
                <ResponsiveDropDown.Item onSelect={() => setRowAction({ row, variant: "edit" })}>
                  <Edit2Icon className="size-4" />
                  {t("usersTable.columns.actions.options.edit.label")}
                </ResponsiveDropDown.Item>
              </ResponsiveDropDown.Content>
            </ResponsiveDropDown>
          );
        },
      },
    ],
    [t, setRowAction, users],
  );

  return columns;
}
