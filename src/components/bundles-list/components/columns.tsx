import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit2Icon, MoreHorizontal, TrashIcon, ListIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { ResponsiveDropDown } from "@/components/common";
import type { DataTableRowAction } from "@/types/data-table";

import type { BundlesDataTableRowAction, BundleRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<BundleRow, BundlesDataTableRowAction>) => void;
  bundles: BundleRow[];
};

export function useBundlesListTableColumns({
  setRowAction,
  bundles,
}: Props): ColumnDef<BundleRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<BundleRow>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("bundlesTable.columns.name.label", { defaultValue: "Name" }),
        enableSorting: true,
        meta: {
          label: t("bundlesTable.columns.name.label", { defaultValue: "Name" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("bundlesTable.columns.name.label", { defaultValue: "Name" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "price",
        accessorKey: "price",
        header: t("bundlesTable.columns.price.label", { defaultValue: "Price" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<BundleRow> }) => {
          const value = row.original.price;
          return <span>{value === null || value === undefined ? "" : String(value)}</span>;
        },
        meta: {
          label: t("bundlesTable.columns.price.label", { defaultValue: "Price" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("bundlesTable.columns.price.label", { defaultValue: "Price" }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "upto",
        accessorKey: "upto",
        header: t("bundlesTable.columns.upto.label", { defaultValue: "Upto" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<BundleRow> }) => {
          const value = row.original.upto;
          return <span>{value === null || value === undefined ? "" : String(value)}</span>;
        },
        meta: {
          label: t("bundlesTable.columns.upto.label", { defaultValue: "Upto" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("bundlesTable.columns.upto.label", { defaultValue: "Upto" }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "grace_period",
        accessorKey: "grace_period",
        header: t("bundlesTable.columns.gracePeriod.label", { defaultValue: "Grace Period" }),
        enableSorting: false,
        cell: ({ row }: { row: Row<BundleRow> }) => {
          const value = row.original.grace_period;
          return <span>{value ? String(value) : ""}</span>;
        },
        meta: {
          label: t("bundlesTable.columns.gracePeriod.label", { defaultValue: "Grace Period" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("bundlesTable.columns.gracePeriod.label", {
              defaultValue: "Grace Period",
            }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("bundlesTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => (
          <ResponsiveDropDown drawerTitle={t("bundlesTable.columns.actions.drawerTitle")}>
            <ResponsiveDropDown.Trigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </ResponsiveDropDown.Trigger>
            <ResponsiveDropDown.Content>
              <ResponsiveDropDown.Item
                onSelect={() => setRowAction({ row, variant: "manageItems" })}
              >
                <ListIcon className="size-4" />
                {t("bundlesTable.actions.manageItems")}
              </ResponsiveDropDown.Item>
              <ResponsiveDropDown.Item onSelect={() => setRowAction({ row, variant: "edit" })}>
                <Edit2Icon className="size-4" />
                {t("common.edit")}
              </ResponsiveDropDown.Item>
              <ResponsiveDropDown.Item
                variant="destructive"
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                <TrashIcon className="size-4" />
                {t("common.delete")}
              </ResponsiveDropDown.Item>
            </ResponsiveDropDown.Content>
          </ResponsiveDropDown>
        ),
      },
    ],
    [t, setRowAction, bundles],
  );

  return columns;
}
