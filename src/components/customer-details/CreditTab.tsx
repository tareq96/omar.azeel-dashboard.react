import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCreditsCreditsList, useCreditsStore } from "@/services/api/generated/credits/credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

interface CreditTabProps {
  customerId: number;
}

export function CreditTab({ customerId }: CreditTabProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: creditsData, isLoading } = useCreditsCreditsList({
    user_id: String(customerId),
  } as any);
  const addCreditMutation = useCreditsStore();

  const credits = (creditsData?.data ?? []) as any[];

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      await addCreditMutation.mutateAsync({
        data: {
          user_id: String(customerId),
          amount,
          notes,
        },
      });
      toast.success(t("customer.credit.added", { defaultValue: "Credit added successfully" }));
      queryClient.invalidateQueries({ queryKey: ["/credits/credits-list"] });
      // Also invalidate customer profile to update balance
      queryClient.invalidateQueries({ queryKey: [`/customers/${customerId}`] });
      setAmount("");
      setNotes("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add credit");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Credit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("customer.credit.add.title", { defaultValue: "Add Credit" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCredit} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="amount">
                {t("customer.fields.amount", { defaultValue: "Amount" })}
              </Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="notes">
                {t("customer.fields.notes", { defaultValue: "Notes (optional)" })}
              </Label>
              <Input
                type="text"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
              />
            </div>
            <Button type="submit" disabled={addCreditMutation.isPending}>
              {addCreditMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.add", { defaultValue: "Add" })}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Credit Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("customer.credit.audit.title", { defaultValue: "Credit Audit" })}
          </CardTitle>
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
                  <TableHead>
                    {t("customer.credit.audit.columns.date", { defaultValue: "Date" })}
                  </TableHead>
                  <TableHead>
                    {t("customer.credit.audit.columns.amount", { defaultValue: "Amount" })}
                  </TableHead>
                  <TableHead>
                    {t("customer.credit.audit.columns.type", { defaultValue: "Type" })}
                  </TableHead>
                  <TableHead>
                    {t("customer.credit.audit.columns.createdBy", {
                      defaultValue: "Created By",
                    })}
                  </TableHead>
                  <TableHead>
                    {t("customer.credit.audit.columns.invoiceCode", {
                      defaultValue: "Invoice Code",
                    })}
                  </TableHead>
                  <TableHead>
                    {t("customer.credit.audit.columns.balance", { defaultValue: "Balance" })}
                  </TableHead>
                  <TableHead>
                    {t("customer.credit.audit.columns.note", { defaultValue: "Note" })}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credits.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                    <TableCell>
                      {item.amount} {item.currency}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.created_by}</TableCell>
                    <TableCell>{item.invoice_code || item.invoice_id}</TableCell>
                    <TableCell>{item.balance}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))}
                {credits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground text-center">
                      {t("customer.credit.audit.empty", { defaultValue: "No records found" })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
