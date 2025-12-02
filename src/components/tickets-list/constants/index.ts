export const TICKETS_TABLE_COLUMN_ORDER = [
  "details",
  "type",
  "user_name",
  "customer_name",
  "creator",
  "status",
  "created_at",
  "updated_at",
  "actions",
] as const;

export const TICKETS_TABLE_EXTRA_FILTER_COLUMNS = ["status", "created_at", "updated_at"] as const;
export const TICKETS_TABLE_STORAGE_PREFIX = "eb.ticketsList";
