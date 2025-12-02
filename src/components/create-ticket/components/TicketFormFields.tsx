import { type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTicketFormValues } from "../schemas/createTicketSchema";
import type { NamedOption, IdNameOption } from "../hooks/useTicketFormData";

export interface TicketFormFieldsProps {
  form: UseFormReturn<CreateTicketFormValues>;
  typeOptions: NamedOption[];
  statusOptions: string[];
  assigneeOptions: IdNameOption[];
  customerOptions: IdNameOption[];
  t: (key: string, opts?: any) => string;
}

export const TicketFormFields = ({
  form,
  typeOptions,
  statusOptions,
  assigneeOptions,
  customerOptions,
  t,
}: TicketFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ticketsCreate.fields.type")}</FormLabel>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.select")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.name} value={opt.name} disabled={opt.disabled}>
                    {t(`ticketsCreate.typeOptions.${opt.name}`, { defaultValue: opt.name })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ticketsCreate.fields.status")}</FormLabel>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.select")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {t(`ticketsTable.columns.status.options.${name}`, { defaultValue: name })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assignee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ticketsCreate.fields.assignee")}</FormLabel>
            <Select
              onValueChange={(val) => field.onChange(Number(val))}
              value={field.value !== undefined ? String(field.value) : ""}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.select")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {assigneeOptions.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ticketsCreate.fields.customer")}</FormLabel>
            <Select
              onValueChange={(val) => field.onChange(Number(val))}
              value={field.value !== undefined ? String(field.value) : ""}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.select")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customerOptions.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel>{t("ticketsCreate.fields.subject")}</FormLabel>
            <FormControl>
              <Textarea rows={4} placeholder={t("ticketsCreate.fields.subject") || ""} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export { Form };
