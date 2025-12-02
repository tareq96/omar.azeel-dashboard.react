import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersStoreBodyStatus } from "@/services/api/generated/azeel.schemas";
import type { CreateUserFormValues } from "../../schema";

type Props = {
  form: any; // Simplified to avoid complex union type issues
  canProceed: boolean;
  isEdit?: boolean;
};

export default function InfoStep({ form, canProceed, isEdit = false }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("users.addDialog.fields.name")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("users.addDialog.placeholders.name") as string} />
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
            <FormLabel>
              {t("users.addDialog.fields.email")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder={t("users.addDialog.placeholders.email") as string}
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
            <FormLabel>
              {t("users.addDialog.fields.mobile")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder={t("users.addDialog.placeholders.mobile") as string}
                dir={i18n.dir(i18n.language)}
                onChange={(e) => {
                  // Only allow digits and limit to 10 characters
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("users.addDialog.fields.status")} <span className="text-red-500">*</span>
            </FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("users.addDialog.placeholders.status") as string} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-9999 w-full">
                <SelectItem value={UsersStoreBodyStatus.Active}>
                  {t("users.addDialog.statuses.active")}
                </SelectItem>
                <SelectItem value={UsersStoreBodyStatus.Inactive}>
                  {t("users.addDialog.statuses.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="job_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("users.addDialog.fields.jobTitle")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={t("users.addDialog.placeholders.jobTitle") as string}
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
            <FormLabel>
              {t("users.addDialog.fields.password")}{" "}
              {!isEdit && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder={
                  isEdit
                    ? t("users.editDialog.placeholders.password", {
                        defaultValue: "Leave blank to keep current password",
                      })
                    : (t("users.addDialog.placeholders.password") as string)
                }
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
            <FormLabel>
              {t("users.addDialog.fields.passwordConfirmation")}{" "}
              {!isEdit && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder={
                  isEdit
                    ? t("users.editDialog.placeholders.passwordConfirmation", {
                        defaultValue: "Confirm new password",
                      })
                    : (t("users.addDialog.placeholders.passwordConfirmation") as string)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
