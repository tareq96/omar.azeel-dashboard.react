import type { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, ImageIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { ResponsiveDropDown } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DataTableRowAction } from "@/types/data-table";

import type { ItemsDataTableRowAction } from "../types";
import type { ItemRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<ItemRow, ItemsDataTableRowAction>) => void;
  items: ItemRow[];
};

export function useItemsListTableColumns({ setRowAction, items }: Props): ColumnDef<ItemRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<ItemRow>[] = useMemo(
    () => [
      {
        id: "icon",
        header: t("itemsTable.columns.icon.label"),
        size: 48,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          const icon = row.original.icon ?? (row.original as any)?.image ?? undefined;
          const name = row.original.name ?? (row.original as any)?.title ?? "";
          return (
            <div className="flex w-full items-center justify-center">
              <Avatar className="h-8 w-8">
                {icon ? (
                  <AvatarImage src={icon} alt={name} />
                ) : (
                  <AvatarFallback>
                    <ImageIcon className="size-4" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: t("itemsTable.columns.name.label"),
        enableSorting: true,
        meta: {
          label: t("itemsTable.columns.name.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("itemsTable.columns.name.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "id",
        accessorKey: "id",
        header: t("itemsTable.columns.id.label"),
        enableSorting: true,
        meta: {
          label: t("itemsTable.columns.id.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("itemsTable.columns.id.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "priceIron",
        header: t("itemsTable.columns.priceIron.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const priceIron = row.original.price_iron_only ?? null;
          return <span>{priceIron ?? "-"}</span>;
        },
        meta: {
          label: t("itemsTable.columns.priceIron.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("itemsTable.columns.priceIron.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "priceDryClean",
        header: t("itemsTable.columns.priceDryClean.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const priceDryClean = row.original.price_dry_clean ?? null;
          return <span>{priceDryClean ?? "-"}</span>;
        },
        meta: {
          label: t("itemsTable.columns.priceDryClean.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("itemsTable.columns.priceDryClean.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("itemsTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <ResponsiveDropDown drawerTitle={t("itemsTable.columns.actions.drawerTitle")}>
              <ResponsiveDropDown.Trigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </ResponsiveDropDown.Trigger>
              <ResponsiveDropDown.Content>
                <ResponsiveDropDown.Item onSelect={() => setRowAction({ row, variant: "edit" })}>
                  <Edit2Icon className="size-4" />
                  {t("itemsTable.columns.actions.options.edit.label")}
                </ResponsiveDropDown.Item>
                <ResponsiveDropDown.Item
                  variant="destructive"
                  onSelect={() =>
                    setRowAction({ row, variant: "delete" as ItemsDataTableRowAction })
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
    [t, setRowAction, items],
  );

  return columns;
}
