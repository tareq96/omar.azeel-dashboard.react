// Shared Credit row shape used across routes and components
export type CreditRow = {
  id: number | string;
  // Primary date field; fallback to created_at if API uses that name
  date?: string | null;
  created_at?: string | null;
  customer?: string | null;
  customer_name?: string | null;
  user_name?: string | null;
  name?: string | null;
  amount?: number | null;
  type?:
    | "Credit"
    | "Credit_Card"
    | "PayPal"
    | "Invoice"
    | "Topup"
    | "Promo"
    | "Debit"
    | string
    | null;
  notes?: string | null;
  note?: string | null;
};
