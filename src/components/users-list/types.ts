export type UsersDataTableRowAction =
  | "edit"
  | "delete"
  | "resetPassword"
  | "activate"
  | "deactivate"
  | "addMember"
  | "profilePreview";

export type UserRow = {
  id: number;
  name: string;
  email: string | null;
  mobile: string | null;
  status: string;
  type: string | null;
  dynamic_id: string | null;
  created_at: string;
  image?: string | null;
  suspension?: boolean;
  zones?: string[] | null;
  balance?: number | null;
  canDelete?: boolean;
};

export type CustomerRow = {
  id: number;
  name: string;
  email: string | null;
  mobile: string | null;
  status: string;
  type: string | null;
  dynamic_id: string | null; // customer id
  created_at: string;
  image?: string | null;
  suspension?: boolean;
  zones?: string[] | null;
  balance?: number | null;
  area?: string | null;
  canDelete?: boolean;
};
