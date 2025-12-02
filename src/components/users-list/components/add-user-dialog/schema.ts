import { z } from "zod";

export const createUserSchema = (t: (key: string, opts?: any) => string) =>
  z
    .object({
      name: z.string().min(1, t("common.required")),
      email: z.string().email(t("common.validations.email")).min(1, t("common.required")),
      mobile: z
        .string()
        .min(1, t("common.required"))
        .regex(/^\d{10}$/, t("users.addDialog.validations.mobileFormat")),
      password: z.string().min(8, t("users.addDialog.validations.passwordMinLength")),
      password_confirmation: z.string().min(8, t("users.addDialog.validations.passwordMinLength")),
      status: z.string().min(1, t("common.required")),
      job_title: z.string().optional(),
      image: z.string().optional(),
      permissions: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      // Password confirmation must match password
      if (data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: "custom",
          path: ["password_confirmation"],
          message: t("users.addDialog.validations.passwordMismatch"),
        });
      }
    });

export type CreateUserFormValues = z.infer<ReturnType<typeof createUserSchema>>;
