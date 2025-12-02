import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLockersGetGeolocationOrders } from "@/services/api/generated/lockers/lockers";
import { DataTable } from "@/components/data-table";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

type ListFilters = {
  zones?: string[];
  drivers?: string[];
  status?: string;
  days?: string;
};

type Props = {
  filters: ListFilters;
};

type OrderRow = {
  id: number;
  user: string;
  user_dynamic_id: string;
  pickup_order: string;
  dispatched_order: string;
  address: string;
};

const columnHelper = createColumnHelper<OrderRow>();

export default function LockersListView({ filters }: Props) {
  const { t } = useTranslation();

  // Prepare params for API
  const params = useMemo(() => {
    const p: any = {};
    if (filters.zones && filters.zones.length > 0) {
      p.zones = filters.zones;
    }
    if (filters.drivers && filters.drivers.length > 0) {
      p.drivers = filters.drivers;
    }
    if (filters.status && filters.status !== "all") {
      p.status = filters.status;
    }
    if (filters.days && filters.days !== "all") {
      p.days = filters.days;
    }
    return p;
  }, [filters]);

  const ordersQuery = useLockersGetGeolocationOrders(params);

  const responseData = ordersQuery.data as any;
  const orders = (responseData?.data as OrderRow[]) || [];

  const columns = useMemo(
    () => [
      columnHelper.accessor("user", {
        header: () => t("lockers.map.list.columns.customer", { defaultValue: "Customer Name" }),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("user_dynamic_id", {
        header: () => t("lockers.map.list.columns.dynamicId", { defaultValue: "Customer ID" }),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("pickup_order", {
        header: () => t("lockers.map.list.columns.pickupOrder", { defaultValue: "Pick up order" }),
        cell: (info) => {
          const value = info.getValue();
          return (
            <span className={value === "Yes" ? "font-semibold text-green-600" : "text-gray-500"}>
              {value || "No"}
            </span>
          );
        },
      }),
      columnHelper.accessor("dispatched_order", {
        header: () =>
          t("lockers.map.list.columns.dispatchedOrder", { defaultValue: "Dispatched order" }),
        cell: (info) => {
          const value = info.getValue();
          return (
            <span className={value === "Yes" ? "font-semibold text-green-600" : "text-gray-500"}>
              {value || "No"}
            </span>
          );
        },
      }),
      columnHelper.accessor("address", {
        header: () => t("lockers.map.list.columns.address", { defaultValue: "Address" }),
        cell: (info) => info.getValue() || "-",
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  return <DataTable table={table} isLoading={ordersQuery.isLoading} />;
}
