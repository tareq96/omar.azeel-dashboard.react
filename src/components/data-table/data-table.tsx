import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";
import { useTranslation } from "react-i18next";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  rowClickHandler?: (rowId: string) => void;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  isLoading,
  rowClickHandler,
  ...props
}: DataTableProps<TData>) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {children}
        <Table
          className="w-full min-w-0 table-fixed"
          containerClassName="rounded-md border max-w-full"
        >
          <TableHeader className="bg-background sticky top-0 z-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({
                        column: header.column,
                        dir: i18n.dir(),
                        withBorder: true,
                      }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          typeof header.column.columnDef.header === "string" ? (
                            <DataTableColumnHeader
                              column={header.column}
                              title={header.column.columnDef.header as string}
                              className={"w-full justify-center text-center"}
                            />
                          ) : (
                            header.column.columnDef.header
                          ),
                          header.getContext(),
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute end-0 top-0 z-20 h-full w-4 cursor-col-resize touch-none opacity-0 select-none hover:opacity-100",
                          header.column.getIsResizing()
                            ? "bg-primary/20 opacity-100"
                            : "bg-transparent",
                        )}
                      >
                        <div className="bg-border absolute end-0 top-0 h-full w-1" />
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 20 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({
                    length: table.getVisibleLeafColumns().length,
                  }).map((_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        ...getCommonPinningStyles({
                          column: table.getVisibleLeafColumns()[j],
                          dir: i18n.dir(),
                          withBorder: true,
                        }),
                      }}
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length || 1}
                  className="h-24 text-center"
                >
                  {t("dataTable.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => rowClickHandler?.(row.id)}
                  className={cn(rowClickHandler && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({
                          column: cell.column,
                          dir: i18n.dir(),
                          withBorder: true,
                        }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
        </div>
      </div>
    </>
  );
}
