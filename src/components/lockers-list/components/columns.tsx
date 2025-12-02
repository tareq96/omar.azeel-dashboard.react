import type { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveDropDown } from "@/components/common";
import type { DataTableRowAction } from "@/types/data-table";

import type { LockersDataTableRowAction, LockerRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<LockerRow, LockersDataTableRowAction>) => void;
  lockers: LockerRow[];
};

const statusVariantMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  inactive: "destructive",
  requested: "secondary",
  installed: "default",
  suspend: "destructive",
};

export function useLockersListTableColumns({
  setRowAction,
  lockers,
}: Props): ColumnDef<LockerRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<LockerRow>[] = useMemo(
    () => [
      {
        id: "dynamic_id",
        accessorKey: "dynamic_id",
        header: t("lockersTable.columns.id.label", { defaultValue: "ID" }),
        enableSorting: true,
        cell: ({ row }) => {
          const value = row.original.dynamic_id ?? String(row.original.id);
          return <span dir={"ltr"}>{value}</span>;
        },
        meta: {
          label: t("lockersTable.columns.id.label", { defaultValue: "ID" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("lockersTable.columns.id.label", { defaultValue: "ID" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("lockersTable.columns.status.label", { defaultValue: "Status" }),
        enableSorting: true,
        cell: ({ row }) => {
          const raw = (row.original.status || "").toString().trim();
          const key = raw.toLowerCase();
          const label = t(`lockersTable.columns.status.options.${key}`, {
            defaultValue: raw,
          });
          return <Badge variant={statusVariantMap[key] ?? "outline"}>{label}</Badge>;
        },
        meta: {
          label: t("lockersTable.columns.status.label", { defaultValue: "Status" }),
          variant: "select",
          options: ["Active", "Inactive", "Requested", "Installed", "Suspend"].map((s) => ({
            label: t(`lockersTable.columns.status.options.${s.toLowerCase()}`, {
              defaultValue: s,
            }),
            value: s,
          })),
        },
        enableColumnFilter: true,
      },
      {
        id: "code",
        accessorKey: "code",
        header: t("lockersTable.columns.code.label", { defaultValue: "Code" }),
        enableSorting: true,
        cell: ({ row }) => {
          return <span dir={"ltr"}>{row.original.code}</span>;
        },
        meta: {
          label: t("lockersTable.columns.code.label", { defaultValue: "Code" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("lockersTable.columns.code.label", { defaultValue: "Code" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "user",
        accessorKey: "user",
        header: t("lockersTable.columns.user.label", { defaultValue: "User" }),
        enableSorting: true,
        meta: {
          label: t("lockersTable.columns.user.label", { defaultValue: "User" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("lockersTable.columns.user.label", { defaultValue: "User" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "address",
        accessorKey: "address",
        header: t("lockersTable.columns.address.label", { defaultValue: "Address" }),
        enableSorting: true,
        meta: {
          label: t("lockersTable.columns.address.label", { defaultValue: "Address" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("lockersTable.columns.address.label", { defaultValue: "Address" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("lockersTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <ResponsiveDropDown drawerTitle={t("lockersTable.columns.actions.drawerTitle")}>
              <ResponsiveDropDown.Trigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </ResponsiveDropDown.Trigger>
              <ResponsiveDropDown.Content>
                <ResponsiveDropDown.Item onSelect={() => setRowAction({ row, variant: "edit" })}>
                  <Edit2Icon className="size-4" />
                  {t("lockersTable.columns.actions.options.edit.label")}
                </ResponsiveDropDown.Item>
                <ResponsiveDropDown.Item
                  variant="destructive"
                  onSelect={() =>
                    setRowAction({ row, variant: "delete" as LockersDataTableRowAction })
                  }
                >
                  <TrashIcon className="size-4" />
                  {t("delete")}
                </ResponsiveDropDown.Item>
              </ResponsiveDropDown.Content>
            </ResponsiveDropDown>
          );
        },
      },
    ],
    [t, setRowAction, lockers],
  );

  return columns;
}
