import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "@/components/ui/multi-select";
import { FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useUsersGetPermissions } from "@/services/api/generated/users/users";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  form: any; // Simplified to support both create and update forms
  canProceed: boolean;
};

export default function PermissionsStep({ form, canProceed }: Props) {
  const { t } = useTranslation();
  const { data: permissionsData, isPending } = useUsersGetPermissions();

  // Transform permissions API response to MultiSelect options format
  const permissionOptions = React.useMemo(() => {
    if (!permissionsData?.data || !Array.isArray(permissionsData.data)) {
      return [];
    }

    const options: { label: string; value: string }[] = [];

    permissionsData.data.forEach((category) => {
      if (category.permissions && typeof category.permissions === "object") {
        Object.entries(category.permissions).forEach(([key, permission]) => {
          if (
            typeof permission === "object" &&
            permission !== null &&
            "id" in permission &&
            "name" in permission
          ) {
            const perm = permission as { id: number; name: string };
            const translationKey = `permissions.${perm.name.toLowerCase().replace(/\s+/g, "_")}`;
            const translatedName = t(translationKey, { defaultValue: perm.name });

            options.push({
              value: String(perm.id),
              label: translatedName,
            });
          }
        });
      }
    });

    return options;
  }, [permissionsData, t]);

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="permissions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("users.addDialog.fields.permissions")}</FormLabel>
            <div className="relative z-[10000]">
              <MultiSelect
                options={permissionOptions}
                selected={field.value || []}
                onChange={field.onChange}
                placeholder={t("users.addDialog.placeholders.permissions") as string}
                searchPlaceholder={t("common.search") as string}
                emptyMessage={t("common.noResults") as string}
                className=""
              />
            </div>
            <FormDescription>{t("users.addDialog.permissions.description")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
