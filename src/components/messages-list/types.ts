export type MessageRow = {
  id: number | string;
  title: string;
  body: string | null;
  customer?: string | null;
  type?: string | null;
  created_at?: string | null;
};
