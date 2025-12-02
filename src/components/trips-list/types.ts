export type TripRow = {
  id: number | string;
  code: string;
  driver: string | null;
  created_at: string | null;
  date?: string | null;
  path?: string | null;
  status?: "Pending" | "InProgress" | "Completed" | string | null;
  user_id?: number | null;
};

export type TripsDataTableRowAction = "edit" | "delete";
