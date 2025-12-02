import type { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ResponsiveDropDown } from "@/components/common";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";

import { useMemo } from "react";
import type { AddressesDataTableRowAction, AddressRow } from "../types";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<AddressRow, AddressesDataTableRowAction>) => void;
  addresses: AddressRow[];
};

export function useAddressesListTableColumns({
  setRowAction,
  addresses,
}: Props): ColumnDef<AddressRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<AddressRow>[] = useMemo(
    () => [
      {
        id: "address",
        accessorKey: "address",
        header: t("addressesTable.columns.address.label"),
        enableSorting: true,
        meta: {
          label: t("addressesTable.columns.address.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("addressesTable.columns.address.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "lat",
        accessorKey: "lat",
        header: t("addressesTable.columns.lat.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const lat = row.original.lat;
          return <span dir={"ltr"}>{lat ?? ""}</span>;
        },
        meta: {
          label: t("addressesTable.columns.lat.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("addressesTable.columns.lat.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "lng",
        accessorKey: "lng",
        header: t("addressesTable.columns.lng.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const lng = row.original.lng;
          return <span dir={"ltr"}>{lng ?? ""}</span>;
        },
        meta: {
          label: t("addressesTable.columns.lng.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("addressesTable.columns.lng.label"),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "notes",
        accessorKey: "notes",
        header: t("addressesTable.columns.notes.label"),
        enableSorting: true,
        meta: {
          label: t("addressesTable.columns.notes.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("addressesTable.columns.notes.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("addressesTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <ResponsiveDropDown drawerTitle={t("addressesTable.columns.actions.drawerTitle")}>
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
                    setRowAction({ row, variant: "delete" as AddressesDataTableRowAction })
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
    [t, setRowAction, addresses],
  );

  return columns;
}
