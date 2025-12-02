import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { CreateCustomerFormValues } from "../../schema";
import { UsersStoreCustomerBodyStatus } from "@/services/api/generated/azeel.schemas";

type InfoStepProps = {
  form: UseFormReturn<CreateCustomerFormValues>;
  canProceed: boolean;
};

export default function InfoStep({ form }: InfoStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.name")}</FormLabel>
            <FormControl>
              <Input placeholder={t("customers.addDialog.placeholders.name")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dynamic_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customersTable.columns.customerId.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t("customers.addDialog.placeholders.dynamicId")}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? parseInt(value) : undefined);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.email")}</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder={t("customers.addDialog.placeholders.email")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mobile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.mobile")} *</FormLabel>
            <FormControl>
              <Input
                placeholder={t("customers.addDialog.placeholders.mobile")}
                maxLength={10}
                {...field}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.password")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("customers.addDialog.placeholders.password")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password_confirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.passwordConfirmation")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("customers.addDialog.placeholders.passwordConfirmation")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.addDialog.fields.status")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("customers.addDialog.placeholders.status")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-9999">
                <SelectItem value={UsersStoreCustomerBodyStatus.Active}>
                  {t("customers.status.active")}
                </SelectItem>
                <SelectItem value={UsersStoreCustomerBodyStatus.Inactive}>
                  {t("customers.status.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
