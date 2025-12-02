import { z } from "zod";

export const createTicketSchema = (t: (key: string, opts?: any) => string) =>
  z
    .object({
      type: z.string().min(1, t("common.required")),
      status: z.string().min(1, t("common.required")),
      customer: z.number().min(1, t("common.required")),
      assignee: z.number().min(1, t("common.required")),
      subject: z.string().optional(),
      date_of_locker_removal: z.string().optional(),
      amount_of_money: z.string().optional(),
      amount_to_be_added: z.string().optional(),
      reason_of_money: z.string().optional(),
      geo_location: z.string().optional(),
      subscription_starting_date: z.string().optional(),
      installation_starting_date: z.string().optional(),
      installation_starting_time: z.string().optional(),
      bundle_name: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.type === "Locker Removal") {
        if (!data.date_of_locker_removal) {
          ctx.addIssue({
            code: "custom",
            path: ["date_of_locker_removal"],
            message: t("common.required"),
          });
        }
        if (!data.amount_of_money) {
          ctx.addIssue({
            code: "custom",
            path: ["amount_of_money"],
            message: t("common.required"),
          });
        }
      }

      if (data.type === "Balance Adjustment") {
        if (!data.amount_to_be_added) {
          ctx.addIssue({
            code: "custom",
            path: ["amount_to_be_added"],
            message: t("common.required"),
          });
        }
      }
    });

export type CreateTicketFormValues = z.infer<ReturnType<typeof createTicketSchema>>;
