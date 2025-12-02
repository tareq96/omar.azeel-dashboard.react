import { z } from "zod";

export const updateUserSchema = (t: (key: string, opts?: any) => string) =>
  z
    .object({
      name: z.string().min(1, t("common.required")),
      email: z.string().email(t("common.validations.email")).min(1, t("common.required")),
      mobile: z
        .string()
        .min(1, t("common.required"))
        .regex(/^\d{10}$/, t("users.addDialog.validations.mobileFormat")),
      password: z.string().optional().or(z.literal("")),
      password_confirmation: z.string().optional().or(z.literal("")),
      status: z.string().min(1, t("common.required")),
      job_title: z.string().optional(),
      image: z.string().optional(),
      permissions: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      // If password is provided, it must be at least 8 characters
      if (data.password && data.password.length > 0 && data.password.length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: t("users.addDialog.validations.passwordMinLength"),
        });
      }

      // If password_confirmation is provided, it must be at least 8 characters
      if (
        data.password_confirmation &&
        data.password_confirmation.length > 0 &&
        data.password_confirmation.length < 8
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["password_confirmation"],
          message: t("users.addDialog.validations.passwordMinLength"),
        });
      }

      // Password confirmation must match password (if either is provided)
      if (data.password || data.password_confirmation) {
        if (data.password !== data.password_confirmation) {
          ctx.addIssue({
            code: "custom",
            path: ["password_confirmation"],
            message: t("users.addDialog.validations.passwordMismatch"),
          });
        }
      }
    });

export type UpdateUserFormValues = z.infer<ReturnType<typeof updateUserSchema>>;
