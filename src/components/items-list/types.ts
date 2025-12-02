export type ItemsDataTableRowAction = "edit" | "delete";

export type ItemRow = {
  id: number;
  name: string;
  icon?: string | null;
  price_iron_only?: number | null;
  price_dry_clean?: number | null;
  dynamic_id?: string | null;
  type?: string | null;
  created_at?: string | null;
};
