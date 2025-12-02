import * as React from "react";
import { useTranslation } from "react-i18next";
import type { CreateCustomerFormValues } from "../../schema";

type Props = {
  form: any;
};

export default function ConfirmationStep({ form }: Props) {
  const { t } = useTranslation();

  const values: CreateCustomerFormValues = form.getValues();

  const fields = [
    { label: t("customers.addDialog.fields.name"), value: values.name },
    { label: t("customers.addDialog.fields.email"), value: values.email },
    { label: t("customers.addDialog.fields.mobile"), value: values.mobile },
    {
      label: t("customers.addDialog.fields.status"),
      value: t(`customers.status.${values.status.toLowerCase()}`),
    },
    {
      label: t("customers.addDialog.fields.homeZone"),
      value: values.home_zone?.toString() || t("common.notSet"),
    },
    {
      label: t("customers.addDialog.fields.homeLat"),
      value: values.home_lat?.toString() || t("common.notSet"),
    },
    {
      label: t("customers.addDialog.fields.homeLng"),
      value: values.home_lng?.toString() || t("common.notSet"),
    },
  ];

  if (values.work_zone) {
    fields.push(
      { label: t("customers.addDialog.fields.workZone"), value: values.work_zone.toString() },
      {
        label: t("customers.addDialog.fields.workLat"),
        value: values.work_lat?.toString() || t("common.notSet"),
      },
      {
        label: t("customers.addDialog.fields.workLng"),
        value: values.work_lng?.toString() || t("common.notSet"),
      },
    );
  }

  if (values.bundle_id) {
    fields.push({
      label: t("customers.addDialog.fields.bundle"),
      value: values.bundle_id.toString(),
    });
  }

  if (values.grace_period !== undefined) {
    fields.push({
      label: t("customers.addDialog.fields.gracePeriod"),
      value: `${values.grace_period} ${t("common.days")}`,
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-semibold">{t("customers.addDialog.confirmation.title")}</h3>
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
