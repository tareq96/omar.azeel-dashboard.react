import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  form: any; // Simplified to support both create and update forms
};

export default function ConfirmationStep({ form }: Props) {
  const { t } = useTranslation();

  const values = form.getValues();
  const permissions = values.permissions || [];

  const fields = [
    { label: t("users.addDialog.fields.name"), value: values.name },
    { label: t("users.addDialog.fields.email"), value: values.email },
    { label: t("users.addDialog.fields.mobile"), value: values.mobile },
    { label: t("users.addDialog.fields.type"), value: t("users.addDialog.types.customer") },
    {
      label: t("users.addDialog.fields.status"),
      value: t(`users.addDialog.statuses.${values.status.toLowerCase()}`),
    },
    { label: t("users.addDialog.fields.jobTitle"), value: values.job_title || t("common.notSet") },
  ];

  if (permissions.length > 0) {
    fields.push({
      label: t("users.addDialog.fields.permissions"),
      value: t("users.addDialog.confirmation.permissionsCount", { count: permissions.length }),
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-semibold">{t("users.addDialog.confirmation.title")}</h3>
        <dl className="space-y-3">
          {fields.map((field, idx) => (
            <div key={idx} className="flex justify-between border-b pb-2 last:border-b-0">
              <dt className="text-muted-foreground font-medium">{field.label}:</dt>
              <dd className="text-right">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
