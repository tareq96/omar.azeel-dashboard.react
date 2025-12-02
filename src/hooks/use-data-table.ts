import { useTranslation } from "react-i18next";

import {
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSizingInfoState,
  type ColumnSizingState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { ExtendedColumnSort } from "@/types/data-table";

const DEBOUNCE_MS = 300;

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  enableAdvancedFilter?: boolean;
  enableColumnResizing?: boolean;
  refetch?: (params: Record<string, any>) => void;
  isLoading?: boolean;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const { i18n } = useTranslation();

  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    enableAdvancedFilter = false,
    enableColumnResizing = true,
    refetch,
    isLoading,
    ...tableProps
  } = props;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  );
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    (initialState?.columnOrder as ColumnOrderState) ?? [],
  );

  // Column resizing state
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
    initialState?.columnSizing ?? {},
  );
  const [columnSizingInfo, setColumnSizingInfo] = React.useState<ColumnSizingInfoState>(
    (initialState?.columnSizingInfo as ColumnSizingInfoState) ?? ({} as ColumnSizingInfoState),
  );

  const [page, setPage] = React.useState<number>((initialState?.pagination?.pageIndex || 0) + 1);
  const [perPage, setPerPage] = React.useState<number>(initialState?.pagination?.pageSize ?? 100);

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        setPage(newPagination.pageIndex + 1);
        setPerPage(newPagination.pageSize);
      } else {
        setPage(updaterOrValue.pageIndex + 1);
        setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  const [sorting, setSorting] = React.useState<ExtendedColumnSort<TData>[]>(
    initialState?.sorting ?? [],
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        setSorting((prev) => updaterOrValue(prev) as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
      // Reset to first page when sorting changes
      setPage(1);
    },
    [setSorting, setPage],
  );

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  const [filterValues, setFilterValues] = React.useState<Record<string, string | string[] | null>>(
    {},
  );

  const debouncedSetFilterValues = useDebouncedCallback((values: typeof filterValues) => {
    setPage(1);
    setFilterValues((prev) => ({ ...prev, ...values }));
  }, debounceMs);

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
      if (value !== null) {
        const processedValue = Array.isArray(value)
          ? value
          : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value];

        filters.push({
          id: key,
          value: processedValue,
        });
      }
      return filters;
    }, []);
  }, [filterValues, enableAdvancedFilter]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

        const filterUpdates = next.reduce<Record<string, string | string[] | null>>(
          (acc, filter) => {
            if (filterableColumns.find((column) => column.id === filter.id)) {
              acc[filter.id] = filter.value as string | string[];
            }
            return acc;
          },
          {},
        );

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter],
  );

  React.useEffect(() => {
    if (isLoading) return;

    const primarySort = sorting[0];
    const sortParam = primarySort?.id as string | undefined;
    const directionParam = primarySort ? (primarySort.desc ? "desc" : "asc") : undefined;

    refetch?.({
      page,
      per_page: perPage,
      ...(sortParam ? { sort: sortParam } : {}),
      ...(directionParam ? { direction: directionParam } : {}),
      ...filterValues,
    });
  }, [page, perPage, filterValues, sorting]);

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
      columnFilters,
      columnSizing,
      columnSizingInfo,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
      enableSorting: false,
      enableResizing: enableColumnResizing,
      minSize: 100,
      size: 180,
    },
    enableColumnResizing,
    columnResizeMode: "onChange",
    columnResizeDirection: i18n.dir(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableColumnPinning: true,
  });

  return { table };
}
