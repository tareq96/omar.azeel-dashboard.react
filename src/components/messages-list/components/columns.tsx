import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import type { MessageRow } from "../types";

export function useMessagesListTableColumns(): ColumnDef<MessageRow>[] {
  const { t } = useTranslation();

  const columns: ColumnDef<MessageRow>[] = useMemo(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: t("messagesTable.columns.title.label"),
        enableSorting: true,
        meta: {
          label: t("messagesTable.columns.title.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("messagesTable.columns.title.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: false,
      },
      {
        id: "body",
        accessorKey: "body",
        header: t("messagesTable.columns.message.label"),
        enableSorting: false,
        meta: {
          label: t("messagesTable.columns.message.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("messagesTable.columns.message.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: false,
      },
      {
        id: "customer",
        accessorKey: "customer_name",
        header: t("messagesTable.columns.customer.label"),
        enableSorting: true,
        meta: {
          label: t("messagesTable.columns.customer.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("messagesTable.columns.customer.label"),
          }),
          variant: "text",
        },
        enableColumnFilter: false,
      },
      {
        id: "type",
        accessorKey: "type",
        header: t("messagesTable.columns.type.label"),
        enableSorting: true,
        cell: ({ row }) => {
          const typeValue = (row.original.type || "").toString().trim();
          const keyMap: Record<string, string> = {
            sms: "messagesTable.columns.type.options.sms",
            push_notification: "messagesTable.columns.type.options.push_notification",
          };

          const labelKey = keyMap[typeValue];
          const label = labelKey ? t(labelKey) : typeValue;
          return <span>{label}</span>;
        },
        meta: {
          label: t("messagesTable.columns.type.label"),
          variant: "select",
          options: [
            { label: t("messagesTable.columns.type.options.sms"), value: "sms" },
            {
              label: t("messagesTable.columns.type.options.push_notification"),
              value: "push_notification",
            },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("messagesTable.columns.date.label"),
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.original.created_at
              ? dayjs(row.original.created_at).format("YYYY-MM-DD HH:mm:ss")
              : ""}
          </span>
        ),
        meta: {
          label: t("messagesTable.columns.date.label"),
          placeholder: t("dataTable.filters.placeholder", {
            fieldName: t("messagesTable.columns.date.label"),
          }),
          variant: "dateRange",
        },
        enableColumnFilter: true,
      },
    ],
    [t],
  );

  return columns;
}
