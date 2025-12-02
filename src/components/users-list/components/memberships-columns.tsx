import type { ColumnDef, Row } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import type { DataTableRowAction } from "@/types/data-table";

import type { UsersDataTableRowAction } from "../types";
// Local row type aligned to memberships sample data
export type MembershipRow = {
  user_id: number;
  name: string;
  dynamic_id: string;
  area: string;
  bundle_id?: number | null;
  bundle: string;
  recurring_days: string;
  balance: number;
  remaining_items: number;
  suspension: boolean;
  status: string;
  activation_date: string; // ISO string
  locker_id?: number | null;
  locker_code?: string | null;
};
import {
  useUsersUpdateSuspension,
  getUsersGetMembershipsQueryKey,
} from "@/services/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  setRowAction: (rowAction: DataTableRowAction<MembershipRow, UsersDataTableRowAction>) => void;
  memberships: MembershipRow[];
};

// No status column in memberships, so no variant map needed

export function useMembershipsListTableColumns({
  setRowAction,
  memberships,
}: Props): ColumnDef<MembershipRow>[] {
  const { t } = useTranslation();

  const updateSuspension = useUsersUpdateSuspension();
  const queryClient = useQueryClient();

  const columns: ColumnDef<MembershipRow>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("usersTable.columns.name.label", { defaultValue: "Name" }),
        enableSorting: true,
        meta: {
          label: t("usersTable.columns.name.label", { defaultValue: "Name" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("usersTable.columns.name.label", { defaultValue: "Name" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "dynamic_id",
        accessorKey: "dynamic_id",
        header: t("membershipTable.columns.customerId.label", { defaultValue: "Customer ID" }),
        enableSorting: true,
        meta: {
          label: t("membershipTable.columns.customerId.label", { defaultValue: "Customer ID" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.customerId.label", {
              defaultValue: "Customer ID",
            }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "area",
        accessorKey: "area",
        header: t("membershipTable.columns.area.label", { defaultValue: "Area" }),
        enableSorting: true,
        meta: {
          label: t("membershipTable.columns.area.label", { defaultValue: "Area" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.area.label", { defaultValue: "Area" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "bundle",
        accessorKey: "bundle",
        header: t("membershipTable.columns.bundle.label", { defaultValue: "Bundle Name" }),
        enableSorting: true,
        meta: {
          label: t("membershipTable.columns.bundle.label", { defaultValue: "Bundle Name" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.bundle.label", { defaultValue: "Bundle Name" }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "recurring_days",
        accessorKey: "recurring_days",
        header: t("membershipTable.columns.recurringDays.label", {
          defaultValue: "Recurring Days",
        }),
        enableSorting: true,
        meta: {
          label: t("membershipTable.columns.recurringDays.label", {
            defaultValue: "Recurring Days",
          }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.recurringDays.label", {
              defaultValue: "Recurring Days",
            }),
          }),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "balance",
        accessorKey: "balance",
        header: t("membershipTable.columns.balance.label", { defaultValue: "Balance" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<MembershipRow> }) => {
          const value = row.original.balance;
          const isNegative = typeof value === "number" && value < 0;
          return <span className={isNegative ? "text-destructive" : undefined}>{value}</span>;
        },
        meta: {
          label: t("membershipTable.columns.balance.label", { defaultValue: "Balance" }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.balance.label", { defaultValue: "Balance" }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "remaining_items",
        accessorKey: "remaining_items",
        header: t("membershipTable.columns.remainingItems.label", {
          defaultValue: "Remaining Items",
        }),
        enableSorting: true,
        cell: ({ row }: { row: Row<MembershipRow> }) => {
          const value = row.original.remaining_items;
          const display = typeof value === "number" && value < 0 ? 0 : value;
          return <span>{display}</span>;
        },
        meta: {
          label: t("membershipTable.columns.remainingItems.label", {
            defaultValue: "Remaining Items",
          }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.remainingItems.label", {
              defaultValue: "Remaining Items",
            }),
          }),
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "suspension",
        accessorKey: "suspension",
        header: t("usersTable.columns.suspension.label", { defaultValue: "Suspension" }),
        enableSorting: true,
        cell: ({ row }: { row: Row<MembershipRow> }) => {
          const initial = Boolean(row.original.suspension);
          return (
            <Switch
              defaultChecked={initial}
              disabled={updateSuspension.isPending}
              onCheckedChange={async (next) => {
                try {
                  const res = (await updateSuspension.mutateAsync({
                    user: row.original.user_id,
                    data: { suspension: next },
                  })) as unknown as { success?: string };

                  const apiSuccessMsg = res?.success || undefined;
                  toast.success(
                    t("usersTable.columns.suspension.toast.apiSuccess", {
                      defaultValue:
                        apiSuccessMsg ||
                        t("usersTable.columns.suspension.toast.success", {
                          defaultValue: "Suspension updated",
                        }),
                    }),
                  );

                  // Trigger list refresh so UI stays in sync
                  await queryClient.invalidateQueries({
                    queryKey: getUsersGetMembershipsQueryKey(),
                    exact: false,
                  });
                } catch (error: any) {
                  toast.error(
                    t("usersTable.columns.suspension.toast.error", {
                      defaultValue: "Failed to update suspension",
                    }),
                  );
                }
              }}
            />
          );
        },
        meta: {
          label: t("usersTable.columns.suspension.label", { defaultValue: "Suspension" }),
          variant: "select",
        },
        enableColumnFilter: false,
      },
      {
        id: "activation_date",
        accessorKey: "activation_date",
        header: t("membershipTable.columns.activationDate.label", {
          defaultValue: "Activation Date",
        }),
        enableSorting: true,
        cell: ({ row }: { row: Row<MembershipRow> }) => {
          const value = row.original.activation_date;
          return <span>{value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        },
        meta: {
          label: t("membershipTable.columns.activationDate.label", {
            defaultValue: "Activation Date",
          }),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("membershipTable.columns.activationDate.label", {
              defaultValue: "Activation Date",
            }),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
    ],
    [t, setRowAction, memberships, updateSuspension],
  );

  return columns;
}
