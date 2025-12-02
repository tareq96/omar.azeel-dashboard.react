import { useTranslation } from "react-i18next";
import { useMessagesMessagesList } from "@/services/api/generated/messages/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface SMSHistoryTabProps {
  customerId: number;
}

export function SMSHistoryTab({ customerId }: SMSHistoryTabProps) {
  const { t } = useTranslation();
  const { data: messagesData, isLoading } = useMessagesMessagesList({
    user_id: String(customerId),
    type: "sms",
  } as any);

  const messages = (messagesData?.data ?? []) as any[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("customer.sms.title", { defaultValue: "SMS History" })}</CardTitle>
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
                <TableHead>{t("customer.sms.message", { defaultValue: "Message" })}</TableHead>
                <TableHead>{t("customer.sms.date", { defaultValue: "Date" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg: any) => (
                <TableRow key={msg.id}>
                  <TableCell>{msg.body || msg.title}</TableCell>
                  <TableCell>{dayjs(msg.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground text-center">
                    {t("customer.sms.empty", { defaultValue: "No messages found" })}
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
