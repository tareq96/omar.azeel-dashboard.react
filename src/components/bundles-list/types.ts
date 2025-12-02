export type BundlesDataTableRowAction = "manageItems" | "edit" | "delete";

export type BundleRow = {
  id: number;
  name: string;
  price: string | number | null;
  upto: number | null;
  period?: string | null;
  grace_period?: string | null;
  discount?: number | null;
  cont?: boolean | null;
  created_at?: string | null;
  items_count?: number | null;
};
