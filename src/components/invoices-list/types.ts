// Shared Invoice row shape used across routes and components
export type InvoiceRow = {
  id: number | string;
  due_date?: string | null;
  code?: string | null;
  user?: string | null;
  user_name?: string | null;
  customer?: string | null;
  customer_name?: string | null;
  order?: string | number | null;
  order_id?: string | number | null;
  due_amount?: number | null;
  amount?: number | null;
  created_at?: string | null;
  print_url?: string | null;
};

export type InvoicesDataTableRowAction = "print";
