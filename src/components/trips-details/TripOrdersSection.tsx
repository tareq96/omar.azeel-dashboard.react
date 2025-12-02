import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { ColumnDef } from "@tanstack/react-table";
import { useTripsOrders } from "@/services/api/generated/trips/trips";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TripOrderRow } from "@/components/trips-details/components/trip-orders-columns";
import type { TicketRow } from "@/components/tickets-list/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import UserDialog from "@/components/users-list/components/user-dialog";

type OrderRow = TripOrderRow & { user_id?: number | null; customer_id?: number | null };

export function TripOrdersSection({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [userDialogUserId, setUserDialogUserId] = React.useState<number | undefined>(undefined);
  const [search, setSearch] = React.useState<{ page?: number; per_page?: number; q?: string }>({
    page: 1,
    per_page: 25,
  });
  const debouncedGlobalSearchUpdate = useDebouncedCallback(() => {}, 300);

  const handleRefetch = React.useCallback((params: Record<string, any>) => {
    setSearch((prev) => ({ ...prev, ...params }));
  }, []);

  const { data: ordersRaw, isPending: ordersLoading } = useTripsOrders<any>(
    Number(tripId || 0),
    {
      per_page: search.per_page,
      q: search.q,
      ...(search.page ? ({ page: search.page } as any) : {}),
    } as any,
    { query: { enabled: !!tripId } },
  );

  const ordersData = React.useMemo(() => {
    const root = ordersRaw as any;
    const orders = Array.isArray(root)
      ? root
      : root?.orders && Array.isArray(root?.orders?.data)
        ? root.orders.data
        : (root?.data ?? root?.items ?? root?.list ?? []);
    const pickupOrders = (orders || []).filter((r: any) => {
      const role = (r?.role ?? r?.kind ?? r?.type ?? "").toString().toLowerCase();
      return role ? role === "pickup" : true;
    });
    const rows: OrderRow[] = pickupOrders.map((r: any) => ({
      id: r?.id ?? String(r?.code ?? ""),
      code: r?.code ?? "",
      customer: typeof r?.user === "string" ? r?.user : (r?.user?.name ?? r?.customer_name ?? null),
      user_id:
        typeof r?.user_id === "number"
          ? r?.user_id
          : typeof r?.user?.id === "number"
            ? r?.user?.id
            : null,
      customer_id:
        typeof r?.customer?.id === "number"
          ? r?.customer?.id
          : typeof r?.customer_id === "number"
            ? r?.customer_id
            : null,
      address: r?.address ?? null,
      status: r?.status ?? null,
      lat: r?.lat ?? r?.latitude ?? null,
      lng: r?.lng ?? r?.longitude ?? null,
    }));
    const total = Number(root?.orders?.total || rows.length || 0);
    const page = Number(root?.orders?.current_page || search.page || 1);
    const per_page = Number(root?.orders?.per_page || search.per_page || 25);
    return { rows, total, page, per_page } as const;
  }, [ordersRaw, search.page, search.per_page]);

  // Manual table rendering (no search or pagination)

  const ticketsData = React.useMemo(() => {
    const root = ordersRaw as any;
    const list = Array.isArray(root) ? [] : (root?.tickets ?? []);
    const rows: TicketRow[] = (list || []).map((r: any) => ({
      id: Number(r?.id ?? 0),
      type: r?.type ?? null,
      status: r?.status ?? null,
      creator: r?.creator ?? null,
      user_id: r?.user_id ?? null,
      user_name: r?.user_name ?? r?.assignee?.name ?? null,
      customer_id: r?.customer?.id ?? r?.customer_id ?? null,
      customer_name: r?.customer?.name ?? r?.customer_name ?? null,
      trip_id: r?.trip_id ?? null,
      money_amount: r?.money_amount ?? null,
      money_reason: r?.money_reason ?? null,
      date_of_locker_removal: r?.date_of_locker_removal ?? null,
      geo_location: r?.geo_location ?? null,
      subscription_starting_date: r?.subscription_starting_date ?? null,
      installation_starting_date: r?.installation_starting_date ?? null,
      installation_starting_time: r?.installation_starting_time ?? null,
      bundle_id: r?.bundle_id ?? null,
      details: (() => {
        const d = r?.details;
        if (!d) return null;
        if (typeof d === "object" && d !== null) return d;
        if (typeof d === "string") {
          try {
            const parsed = JSON.parse(d);
            return typeof parsed === "object" && parsed !== null ? parsed : { details: String(d) };
          } catch {
            return { details: String(d) };
          }
        }
        return null;
      })(),
      created_at: r?.created_at ?? null,
      updated_at: r?.updated_at ?? null,
    }));
    return { rows } as const;
  }, [ordersRaw]);

  // Manual table rendering (no search or pagination)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("trips.orders.sections.pickup", { defaultValue: "Pick Up Orders" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full min-w-0 table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("tripsTable.columns.code.label", { defaultValue: "Code" })}
                </TableHead>
                <TableHead>
                  {t("trips.orders.columns.customer.label", { defaultValue: "Customer" })}
                </TableHead>
                <TableHead>{t("trips.fields.lat.label", { defaultValue: "Lat." })}</TableHead>
                <TableHead>{t("trips.fields.lng.label", { defaultValue: "Lng." })}</TableHead>
                <TableHead>
                  {t("trips.orders.columns.address.label", { defaultValue: "Address" })}
                </TableHead>
                <TableHead>
                  {t("tripsTable.columns.status.label", { defaultValue: "Status" })}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersLoading ? null : ordersData.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground text-center">
                    {t("dataTable.noResults", { defaultValue: "Nothing to preview" })}
                  </TableCell>
                </TableRow>
              ) : (
                ordersData.rows.map((row) => {
                  const id =
                    typeof row.user_id === "number"
                      ? row.user_id
                      : typeof row.customer_id === "number"
                        ? row.customer_id
                        : undefined;
                  const name = row.customer ?? "";
                  const statusLabel = row.status
                    ? t(`ordersTable.columns.status.options.${row.status}`, {
                        defaultValue: String(row.status),
                      })
                    : "";
                  return (
                    <TableRow key={String(row.id)}>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>
                        {id ? (
                          <Button
                            variant="link"
                            className="text-primary h-auto p-0 underline decoration-from-font underline-offset-2"
                            onClick={() => setUserDialogUserId(id!)}
                          >
                            {name}
                          </Button>
                        ) : (
                          <span>{name}</span>
                        )}
                      </TableCell>
                      <TableCell dir="ltr">{row.lat ?? ""}</TableCell>
                      <TableCell dir="ltr">{row.lng ?? ""}</TableCell>
                      <TableCell className="max-w-[240px] truncate">{row.address ?? ""}</TableCell>
                      <TableCell>{statusLabel}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("trips.orders.sections.tickets", { defaultValue: "Tickets" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full min-w-0 table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("ticketsTable.columns.type.label", { defaultValue: "Ticket Type" })}
                </TableHead>
                <TableHead>
                  {t("ticketsTable.columns.details.label", { defaultValue: "Details" })}
                </TableHead>
                <TableHead>
                  {t("ticketsTable.columns.customer.label", { defaultValue: "Customer" })}
                </TableHead>
                <TableHead>
                  {t("ticketsTable.columns.status.label", { defaultValue: "Status" })}
                </TableHead>
                <TableHead>
                  {t("ticketsTable.columns.createdAt.label", { defaultValue: "Created Date" })}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersLoading ? null : ticketsData.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center">
                    {t("dataTable.noResults", { defaultValue: "Nothing to preview" })}
                  </TableCell>
                </TableRow>
              ) : (
                ticketsData.rows.map((row) => {
                  const id = row.customer_id ? Number(row.customer_id) : undefined;
                  const name = row.customer_name ?? "";
                  const details = row.details as any;
                  const detailsText =
                    typeof details?.details !== "undefined"
                      ? String(details.details)
                      : JSON.stringify(details ?? "");
                  const typeLabel = row.type
                    ? t(`ticketsCreate.typeOptions.${row.type}`, { defaultValue: String(row.type) })
                    : "";
                  const statusLabel = row.status
                    ? t(`ticketsTable.columns.status.options.${row.status}`, {
                        defaultValue: String(row.status),
                      })
                    : "";
                  return (
                    <TableRow key={String(row.id)}>
                      <TableCell>{typeLabel}</TableCell>
                      <TableCell className="max-w-[240px] truncate">{detailsText}</TableCell>
                      <TableCell>
                        {id ? (
                          <Button
                            variant="link"
                            className="text-primary h-auto p-0 underline decoration-from-font underline-offset-2"
                            onClick={() => setUserDialogUserId(id!)}
                          >
                            {name}
                          </Button>
                        ) : (
                          <span>{name}</span>
                        )}
                      </TableCell>
                      <TableCell>{statusLabel}</TableCell>
                      <TableCell>
                        {row.created_at ? dayjs(row.created_at).format("YYYY-MM-DD HH:mm:ss") : ""}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <UserDialog userId={userDialogUserId} />
    </div>
  );
}
