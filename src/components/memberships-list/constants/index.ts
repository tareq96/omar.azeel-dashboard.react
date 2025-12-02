export const MEMBERSHIPS_TABLE_COLUMN_ORDER = [
  "name",
  "dynamic_id",
  "area",
  "bundle",
  "recurring_days",
  "balance",
  "remaining_items",
  "suspension",
  "activation_date",
  "actions",
] as const;

export const MEMBERSHIPS_TABLE_EXTRA_FILTER_COLUMNS = ["activation_date"] as const;
export const MEMBERSHIPS_TABLE_STORAGE_PREFIX = "eb.membershipsList";
