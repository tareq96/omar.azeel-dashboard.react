export type LockersDataTableRowAction = "edit" | "delete";

export type LockerRow = {
  id: number;
  dynamic_id: string | null;
  code: string;
  zone_id: number;
  user_id: number;
  status: string;
  locker_number: string;
  created_at: string;
  user: string;
  address: string;
  user_deleted: boolean;
};
