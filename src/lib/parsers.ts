import { z } from "zod";

import { dataTableConfig } from "@/config/data-table";

import type { ExtendedColumnFilter, ExtendedColumnSort } from "@/types/data-table";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const parseSortingState = <TData>(
  value: string,
  columnIds?: string[] | Set<string>,
): ExtendedColumnSort<TData>[] | null => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  try {
    const parsed = JSON.parse(value);
    const result = z.array(sortingItemSchema).safeParse(parsed);

    if (!result.success) return null;

    if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
      return null;
    }

    return result.data as ExtendedColumnSort<TData>[];
  } catch {
    return null;
  }
};

export const serializeSortingState = <TData>(value: ExtendedColumnSort<TData>[]): string => {
  return JSON.stringify(value);
};

export const compareSortingState = <TData>(
  a: ExtendedColumnSort<TData>[],
  b: ExtendedColumnSort<TData>[],
): boolean => {
  return (
    a.length === b.length &&
    a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc)
  );
};

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const parseFiltersState = <TData>(
  value: string,
  columnIds?: string[] | Set<string>,
): ExtendedColumnFilter<TData>[] | null => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  try {
    const parsed = JSON.parse(value);
    const result = z.array(filterItemSchema).safeParse(parsed);

    if (!result.success) return null;

    if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
      return null;
    }

    // Cast via unknown to satisfy TypeScript since zod infers plain strings for ids
    // and our ExtendedColumnFilter narrows id to Extract<keyof TData, string>.
    return result.data as unknown as ExtendedColumnFilter<TData>[];
  } catch {
    return null;
  }
};

export const serializeFiltersState = <TData>(value: ExtendedColumnFilter<TData>[]): string => {
  return JSON.stringify(value);
};

export const compareFiltersState = <TData>(
  a: ExtendedColumnFilter<TData>[],
  b: ExtendedColumnFilter<TData>[],
): boolean => {
  return (
    a.length === b.length &&
    a.every(
      (filter, index) =>
        filter.id === b[index]?.id &&
        filter.value === b[index]?.value &&
        filter.variant === b[index]?.variant &&
        filter.operator === b[index]?.operator,
    )
  );
};
