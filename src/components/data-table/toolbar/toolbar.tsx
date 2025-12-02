import type { Table } from "@tanstack/react-table";
import { RefreshCw, Settings2, X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import DataTableToolbarFilter from "../filters";

import { DataTableResetOptions } from "./reset-options";
// import { DataTableViewOptions } from './view-options';

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  settingsMenuConfig?: {
    allowColumnReorder?: boolean;
    allowColumnVisibility?: boolean;
    allowColumnResizing?: boolean;

    storagePrefix?: string;
  };

  refetch?: () => void;
  isRefetching?: boolean;

  // When true, render a single global search input instead of column filters
  singleSearchInput?: boolean;
  globalSearchValue?: string;
  onGlobalSearchChange?: (value: string) => void;
  globalSearchPlaceholder?: string;
  // Render these specific column filters even when singleSearchInput is enabled
  extraFilterColumnIds?: string[];
  // Custom controls to render on the left near filters
  leftChildren?: React.ReactNode;
  // When true, consider external/left-side filters as active
  extraIsFiltered?: boolean;
  // Optional handler to clear external filters when reset is clicked
  onResetExtraFilters?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  children,
  leftChildren,
  className,
  settingsMenuConfig,
  refetch,
  isRefetching,
  singleSearchInput,
  globalSearchValue,
  onGlobalSearchChange,
  globalSearchPlaceholder,
  extraFilterColumnIds,
  extraIsFiltered,
  onResetExtraFilters,
  ...props
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation();

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    (singleSearchInput && Boolean(globalSearchValue?.trim())) ||
    Boolean(extraIsFiltered);

  const {
    allowColumnReorder,
    allowColumnVisibility,
    allowColumnResizing,

    storagePrefix: settingsStoragePrefix,
  } = settingsMenuConfig || {};

  const showSettingsMenu = allowColumnReorder || allowColumnVisibility || allowColumnResizing;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table, t],
  );

  const extraColumns = React.useMemo(
    () =>
      (extraFilterColumnIds || [])
        .map((id) => table.getAllColumns().find((c) => c.id === id))
        .filter((c): c is (typeof columns)[number] => Boolean(c && c.getCanFilter())),
    [table, extraFilterColumnIds],
  );

  const onReset = React.useCallback(() => {
    // Clear any external filters first (e.g., date range in leftChildren)
    onResetExtraFilters?.();
    if (singleSearchInput) {
      onGlobalSearchChange?.("");
      // Also clear any column filters that may be shown alongside global search
      table.resetColumnFilters();
    } else {
      table.resetColumnFilters();
    }
  }, [singleSearchInput, onGlobalSearchChange, table, onResetExtraFilters]);

  const onGlobalSearchInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onGlobalSearchChange?.(event.target.value);
    },
    [onGlobalSearchChange],
  );

  // LocalStorage keys
  const columnSizingKey = React.useMemo(
    () => (settingsStoragePrefix ? `${settingsStoragePrefix}.columnSizing` : undefined),
    [settingsStoragePrefix],
  );

  const columnVisibilityKey = React.useMemo(
    () => (settingsStoragePrefix ? `${settingsStoragePrefix}.columnVisibility` : undefined),
    [settingsStoragePrefix],
  );

  const columnOrderKey = React.useMemo(
    () => (settingsStoragePrefix ? `${settingsStoragePrefix}.columnOrder` : undefined),
    [settingsStoragePrefix],
  );

  // Hydrate from localStorage on mount (once)
  const hydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (!settingsStoragePrefix || hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      // order
      if (columnOrderKey && allowColumnReorder) {
        const raw = localStorage.getItem(columnOrderKey);
        if (raw) {
          const savedOrder = JSON.parse(raw) as string[];
          const allIds = table.getAllLeafColumns().map((c) => c.id);
          const pruned = savedOrder.filter((id) => allIds.includes(id));
          const missing = allIds.filter((id) => !pruned.includes(id));
          table.setColumnOrder([...pruned, ...missing]);
        }
      }
      // visibility
      if (columnVisibilityKey && allowColumnVisibility) {
        const raw = localStorage.getItem(columnVisibilityKey);
        if (raw) {
          const vis = JSON.parse(raw) as Record<string, boolean>;
          table.setColumnVisibility(vis);
        }
      }
      // sizing
      if (columnSizingKey && allowColumnResizing) {
        const raw = localStorage.getItem(columnSizingKey);
        if (raw) {
          const sizing = JSON.parse(raw) as Record<string, number>;
          table.setColumnSizing(sizing);
        }
      }
    } catch {
      // ignore malformed saved state
    }
  }, [
    settingsStoragePrefix,
    table,
    columnOrderKey,
    columnVisibilityKey,
    columnSizingKey,
    allowColumnReorder,
    allowColumnVisibility,
    allowColumnResizing,
  ]);

  // Persist to localStorage when table state changes
  React.useEffect(() => {
    if (!columnSizingKey || !allowColumnResizing) return;
    try {
      const sizing = table.getState().columnSizing;
      localStorage.setItem(columnSizingKey, JSON.stringify(sizing));
    } catch {
      // ignore
    }
  }, [table.getState().columnSizing, columnSizingKey, allowColumnResizing]);

  React.useEffect(() => {
    if (!columnVisibilityKey || !allowColumnVisibility) return;
    try {
      const vis = table.getState().columnVisibility;
      localStorage.setItem(columnVisibilityKey, JSON.stringify(vis));
    } catch {
      // ignore
    }
  }, [table.getState().columnVisibility, columnVisibilityKey, allowColumnVisibility]);

  React.useEffect(() => {
    if (!columnOrderKey || !allowColumnReorder) return;
    try {
      const order = table.getState().columnOrder;
      localStorage.setItem(columnOrderKey, JSON.stringify(order));
    } catch {
      // ignore
    }
  }, [table.getState().columnOrder, columnOrderKey, allowColumnReorder]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full flex-col gap-2 p-1 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        {singleSearchInput ? (
          <Input
            placeholder={globalSearchPlaceholder ?? t("search") ?? "Search..."}
            value={globalSearchValue ?? ""}
            onChange={onGlobalSearchInputChange}
            className="h-8 w-full md:w-56"
          />
        ) : (
          <>
            {columns.map((column) => (
              <DataTableToolbarFilter key={column.id} column={column} />
            ))}
          </>
        )}
        {singleSearchInput && extraColumns.length > 0 && (
          <>
            {extraColumns.map((column) => (
              <DataTableToolbarFilter key={`extra-${column.id}`} column={column} />
            ))}
          </>
        )}
        {leftChildren}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="w-full border-dashed md:w-auto"
            onClick={onReset}
          >
            <X />
            {t("dataTable.filters.reset")}
          </Button>
        )}
      </div>
      <div className="flex w-full items-center gap-2 lg:w-auto">
        {children}
        {refetch && (
          <Button variant="ghost" size="icon" onClick={refetch} disabled={isRefetching}>
            <RefreshCw className={cn("size-4", isRefetching && "animate-spin")} />
          </Button>
        )}
        {showSettingsMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 border-dashed lg:flex-initial">
                <Settings2 className="h-4 w-4" />
                <span className="hidden md:block">{t("dataTable.settings.menu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DataTableResetOptions
                table={table}
                allowColumnReorder={!!allowColumnReorder}
                allowColumnVisibility={!!allowColumnVisibility}
                allowColumnResizing={!!allowColumnResizing}
                columnSizingKey={columnSizingKey}
                columnVisibilityKey={columnVisibilityKey}
                columnOrderKey={columnOrderKey}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
