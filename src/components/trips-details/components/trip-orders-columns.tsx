import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";

export type TripOrderRow = {
  id: string | number;
  code: string;
  customer: string | null;
  address: string | null;
  status: string | null;
  lat: string | number | null;
  lng: string | number | null;
};

export function getTripOrdersColumns(
  t: ReturnType<typeof useTranslation>["t"],
): ColumnDef<TripOrderRow>[] {
  return [
    {
      id: "code",
      accessorKey: "code",
      header: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
      enableSorting: true,
    },
    {
      id: "customer",
      accessorKey: "customer",
      header: t("trips.orders.columns.customer.label", { defaultValue: "Customer" }),
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.customer ?? ""}</span>,
    },
    {
      id: "address",
      accessorKey: "address",
      header: t("trips.orders.columns.address.label", { defaultValue: "Address" }),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="max-w-[240px] truncate">{row.original.address ?? ""}</span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("tripsTable.columns.status.label", { defaultValue: "Status" }),
      enableSorting: true,
    },
  ];
}
