import { useTranslation } from "react-i18next";
import { useInvoicesGetInvoicesList } from "@/services/api/generated/invoices/invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, PrinterIcon } from "lucide-react";
import dayjs from "dayjs";

interface InvoiceTabProps {
  customerId: number;
}

export function InvoiceTab({ customerId }: InvoiceTabProps) {
  const { t } = useTranslation();
  const { data: invoicesData, isLoading } = useInvoicesGetInvoicesList({
    user_id: String(customerId),
  } as any);

  const invoices = (invoicesData?.data ?? []) as any[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("customer.invoice.title", { defaultValue: "Invoices" })}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("customer.invoice.dueDate", { defaultValue: "Due Date" })}</TableHead>
                <TableHead>{t("customer.invoice.code", { defaultValue: "Code" })}</TableHead>
                <TableHead>{t("customer.invoice.order", { defaultValue: "Order" })}</TableHead>
                <TableHead>
                  {t("customer.invoice.dueAmount", { defaultValue: "Due Amount" })}
                </TableHead>
                <TableHead>{t("customer.invoice.actions", { defaultValue: "Actions" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv: any) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    {dayjs(inv.due_date || inv.created_at).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{inv.code}</TableCell>
                  <TableCell>{inv.order_code || inv.order_id}</TableCell>
                  <TableCell>{inv.due_amount}</TableCell>
                  <TableCell>
                    {inv.print_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={inv.print_url} target="_blank" rel="noopener noreferrer">
                          <PrinterIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center">
                    {t("customer.invoice.empty", { defaultValue: "No invoices found" })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
