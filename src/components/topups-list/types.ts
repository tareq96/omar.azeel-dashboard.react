export type TopupsDataTableRowAction = "edit" | "delete";

// Shared Topup row shape used across routes and components
export type TopupRow = {
  id: number;
  number: string;
  status: "New" | "Requested" | "Used" | string;
  amount: number | null;
  customer_name: string | null;
  staff_name: string | null;
  charge_date: string | null;
  created_at: string;
};
