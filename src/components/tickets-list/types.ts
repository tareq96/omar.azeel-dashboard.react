export type TicketsDataTableRowAction = "edit";

export type TicketRow = {
  id: number;
  type: string | null;
  status: string | null;
  creator: string | null;
  user_id: number | null;
  user_name: string | null; // assignee
  customer_id: number | null;
  customer_name: string | null;
  trip_id?: number | null;
  money_amount?: number | null;
  money_reason?: string | null;
  date_of_locker_removal?: string | null;
  geo_location?: string | null;
  subscription_starting_date?: string | null;
  installation_starting_date?: string | null;
  installation_starting_time?: string | null;
  bundle_id?: number | null;
  details?: { details?: string } | null;
  created_at: string | null;
  updated_at: string | null;
};
