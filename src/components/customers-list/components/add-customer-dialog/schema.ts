import { z } from "zod";

export const createCustomerSchema = (t: (key: string, opts?: any) => string) =>
  z
    .object({
      name: z.string().min(1, t("common.required")),
      dynamic_id: z.number().optional(),
      email: z.string().email(t("common.validations.email")).min(1, t("common.required")),
      mobile: z
        .string()
        .min(1, t("common.required"))
        .regex(/^\d{10}$/, t("customers.addDialog.validations.mobileFormat")),
      password: z.string().min(8, t("customers.addDialog.validations.passwordMinLength")),
      password_confirmation: z
        .string()
        .min(8, t("customers.addDialog.validations.passwordMinLength")),
      status: z.string().min(1, t("common.required")),
      home_zone: z.number().optional(),
      home_lat: z
        .number()
        .min(-90, t("customers.addDialog.validations.latRange"))
        .max(90, t("customers.addDialog.validations.latRange"))
        .optional(),
      home_lng: z
        .number()
        .min(-180, t("customers.addDialog.validations.lngRange"))
        .max(180, t("customers.addDialog.validations.lngRange"))
        .optional(),
      work_zone: z.number().optional(),
      work_lat: z
        .number()
        .min(-90, t("customers.addDialog.validations.latRange"))
        .max(90, t("customers.addDialog.validations.latRange"))
        .optional(),
      work_lng: z
        .number()
        .min(-180, t("customers.addDialog.validations.lngRange"))
        .max(180, t("customers.addDialog.validations.lngRange"))
        .optional(),
      bundle_id: z.number().optional(),
      grace_period: z
        .number()
        .min(0, t("customers.addDialog.validations.gracePeriodMin"))
        .max(365, t("customers.addDialog.validations.gracePeriodMax"))
        .optional(),
      activation_date: z.string().min(1, t("common.required")),
      installation_date: z.string().min(1, t("common.required")),
      installation_time: z.string().min(1, t("common.required")),
    })
    .superRefine((data, ctx) => {
      // Password confirmation must match password
      if (data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: "custom",
          path: ["password_confirmation"],
          message: t("customers.addDialog.validations.passwordMismatch"),
        });
      }

      // If work zone is provided, work lat/lng should be provided
      if (data.work_zone && (!data.work_lat || !data.work_lng)) {
        if (!data.work_lat) {
          ctx.addIssue({
            code: "custom",
            path: ["work_lat"],
            message: t("customers.addDialog.validations.workLatRequired"),
          });
        }
        if (!data.work_lng) {
          ctx.addIssue({
            code: "custom",
            path: ["work_lng"],
            message: t("customers.addDialog.validations.workLngRequired"),
          });
        }
      }

      // Activation date validation: must be after or equal to bundle selection (if both exist)
      if (data.bundle_id && data.activation_date && data.installation_date) {
        const activationDate = new Date(data.activation_date);
        const installationDate = new Date(data.installation_date);

        if (activationDate < installationDate) {
          ctx.addIssue({
            code: "custom",
            path: ["activation_date"],
            message: t("customers.addDialog.validations.activationDateAfterInstallation"),
          });
        }
      }
    });

export type CreateCustomerFormValues = z.infer<ReturnType<typeof createCustomerSchema>>;
