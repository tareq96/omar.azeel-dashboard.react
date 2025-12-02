export type AddressesDataTableRowAction = "edit" | "delete";

export type AddressRow = {
  id: string | number;
  address?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  notes?: string | null;
};
