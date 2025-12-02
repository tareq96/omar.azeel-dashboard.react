export type PromosDataTableRowAction = "edit" | "delete";

// Shared Promo row shape used across routes and components
export type PromoRow = {
  id: number | string;
  name: string;
  status: "Pending" | "Active" | "Inactive" | string;
  amount: number | null;
  percent: number | null;
  beneficiaries: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at?: string | null;
};
