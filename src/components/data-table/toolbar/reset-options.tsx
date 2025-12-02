import type { Table } from "@tanstack/react-table";
import { Eye, ListOrdered, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableResetOptionsProps<TData> {
  table: Table<TData>;
  allowColumnVisibility: boolean;
  columnVisibilityKey?: string;

  allowColumnReorder: boolean;
  columnOrderKey?: string;

  allowColumnResizing: boolean;
  columnSizingKey?: string;
}

export function DataTableResetOptions<TData>({
  table,
  allowColumnVisibility,
  columnVisibilityKey,
  allowColumnReorder,
  columnOrderKey,
  allowColumnResizing,
  columnSizingKey,
}: DataTableResetOptionsProps<TData>) {
  const { t } = useTranslation();

  const resetColumnsSize = useCallback(() => {
    table.resetColumnSizing();
    if (columnSizingKey) localStorage.removeItem(columnSizingKey);
  }, [table, columnSizingKey]);

  const resetColumnsVisibility = useCallback(() => {
    table.resetColumnVisibility();
    if (columnVisibilityKey) localStorage.removeItem(columnVisibilityKey);
  }, [table, columnVisibilityKey]);

  const resetColumnsOrder = useCallback(() => {
    table.resetColumnOrder();
    if (columnOrderKey) localStorage.removeItem(columnOrderKey);
  }, [table, columnOrderKey]);

  const resetAll = useCallback(() => {
    resetColumnsVisibility();
    resetColumnsOrder();
    resetColumnsSize();
  }, [resetColumnsVisibility, resetColumnsOrder, resetColumnsSize]);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{t("dataTable.settings.reset.title")}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-fit">
        <DropdownMenuItem onClick={resetAll}>
          <RotateCcw className="me-2 h-4 w-4" />
          {t("dataTable.columns.resetAll")}
        </DropdownMenuItem>
        {allowColumnVisibility && (
          <DropdownMenuItem onClick={resetColumnsVisibility}>
            <Eye className="me-2 h-4 w-4" />
            {t("dataTable.columns.resetVisibility")}
          </DropdownMenuItem>
        )}
        {allowColumnReorder && (
          <DropdownMenuItem onClick={resetColumnsOrder}>
            <ListOrdered className="me-2 h-4 w-4" />
            {t("dataTable.columns.resetOrder")}
          </DropdownMenuItem>
        )}
        {allowColumnResizing && (
          <DropdownMenuItem onClick={resetColumnsSize}>
            <SlidersHorizontal className="me-2 h-4 w-4" />
            {t("dataTable.columns.resetSizes")}
          </DropdownMenuItem>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
