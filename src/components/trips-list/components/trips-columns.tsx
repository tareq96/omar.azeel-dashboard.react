import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Edit2Icon, MoreHorizontal, TrashIcon } from "lucide-react";
import { ResponsiveDropDown } from "@/components/common";
import { Button } from "@/components/ui/button";
import type { DataTableRowAction } from "@/types/data-table";
import { useNavigate } from "@tanstack/react-router";

import type { TripRow, TripsDataTableRowAction } from "../types";

type Props = {
  trips: TripRow[];
  setRowAction?: (rowAction: DataTableRowAction<TripRow, TripsDataTableRowAction>) => void;
  onDriverClick?: (row: TripRow) => void;
};

export function useTripsListTableColumns({
  trips,
  setRowAction,
  onDriverClick,
}: Props): ColumnDef<TripRow>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnDef<TripRow>[] = useMemo(
    () => [
      {
        id: "status",
        accessorKey: "status",
        header: t("tripsTable.columns.status.label", { defaultValue: "Status" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TripRow> }) => {
          const raw = row.original.status ?? "";
          const normalized = String(raw).trim();
          const lower = normalized.toLowerCase().replace(/\s|-/g, "");
          const key =
            lower === "pending"
              ? "Pending"
              : lower === "inprogress" || lower === "in_progress"
                ? "InProgress"
                : lower === "completed" || lower === "complete"
                  ? "Completed"
                  : normalized;
          const label = normalized
            ? t(`tripsTable.columns.status.options.${key}`, {
                defaultValue: key === "InProgress" ? "In Progress" : key,
              })
            : "";
          return <span>{label}</span>;
        },
        meta: {
          label: t("tripsTable.columns.status.label", { defaultValue: "Status" }),
          variant: "select",
          options: ["Pending", "InProgress", "Completed"].map((status) => ({
            label: t(`tripsTable.columns.status.options.${status}`, {
              defaultValue: status === "InProgress" ? "In Progress" : status,
            }),
            value: status,
          })),
        },
        enableColumnFilter: true,
      },
      {
        id: "code",
        accessorKey: "code",
        header: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TripRow> }) => {
          const id = row.original.id;
          const code = row.original.code ?? "";
          return (
            <button
              type="button"
              className="text-primary underline decoration-from-font underline-offset-2"
              onClick={() => navigate({ to: "/trips/$tripId", params: { tripId: String(id) } })}
            >
              {code}
            </button>
          );
        },
        meta: {
          label: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("tripsTable.columns.code.label", { defaultValue: "Code" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "driver",
        accessorKey: "driver",
        header: t("tripsTable.columns.driver.label", { defaultValue: "Driver" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TripRow> }) => {
          const value = row.original.driver;
          return (
            <button
              type="button"
              className="text-primary underline decoration-from-font underline-offset-2"
              onClick={() => onDriverClick?.(row.original)}
            >
              {value ?? ""}
            </button>
          );
        },
        meta: {
          label: t("tripsTable.columns.driver.label", { defaultValue: "Driver" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("tripsTable.columns.driver.label", { defaultValue: "Driver" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<TripRow> }) => {
          const path = row.original.path;
          if (path) return <span className="max-w-[240px] truncate">{path}</span>;
          const value = row.original.created_at ?? row.original.date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        meta: {
          label: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("tripsTable.columns.date.label", { defaultValue: "Date" }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: t("tripsTable.columns.actions.label"),
        size: 40,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }: { row: Row<TripRow> }) => {
          return (
            <ResponsiveDropDown drawerTitle={t("tripsTable.columns.actions.drawerTitle")}>
              <ResponsiveDropDown.Trigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </ResponsiveDropDown.Trigger>
              <ResponsiveDropDown.Content>
                <ResponsiveDropDown.Item onSelect={() => setRowAction?.({ row, variant: "edit" })}>
                  <Edit2Icon className="size-4" />
                  {t("tripsTable.columns.actions.options.edit.label")}
                </ResponsiveDropDown.Item>
                <ResponsiveDropDown.Item
                  variant="destructive"
                  onSelect={() =>
                    setRowAction?.({ row, variant: "delete" as TripsDataTableRowAction })
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
    [t, trips, setRowAction, onDriverClick],
  );

  return columns;
}
