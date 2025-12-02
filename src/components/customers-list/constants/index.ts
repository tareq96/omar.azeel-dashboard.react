export const CUSTOMERS_TABLE_COLUMN_ORDER = [
  "name",
  "dynamic_id",
  "mobile",
  "email",
  "area",
  "created_at",
  "balance",
  "status",
  "actions",
] as const;

export const CUSTOMERS_TABLE_EXTRA_FILTER_COLUMNS = ["status"] as const;
export const CUSTOMERS_TABLE_STORAGE_PREFIX = "eb.customersList";
