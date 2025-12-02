import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "./components/TicketFormFields";
import { TicketFormFields } from "./components/TicketFormFields";
import { DynamicTicketFields } from "./components/DynamicTicketFields";
import { TYPE_FIELD_CONFIGS } from "./constants/fieldConfigs";
import { createTicketSchema, type CreateTicketFormValues } from "./schemas/createTicketSchema";
import { useTicketFormData } from "./hooks/useTicketFormData";
import { useTicketsStore } from "@/services/api/generated/tickets/tickets";

export default function CreateTicketPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema(t)),
    defaultValues: {
      type: "",
      status: "",
      customer: -1,
      assignee: -1,
      subject: "",
    },
    reValidateMode: "onChange",
  });

  const selectedType = form.watch("type");
  const { mutateAsync: storeTicket, isPending: isSubmitting } = useTicketsStore();

  const { createData, isLoading, typeOptions, statusOptions, customerOptions, assigneeOptions } =
    useTicketFormData(selectedType);

  useEffect(() => {
    if (createData?.ticket_types?.length) {
      form.setValue("type", createData.ticket_types[0]);
    }
    if (createData?.ticket_statuses?.length) {
      form.setValue("status", createData.ticket_statuses[0]);
    }
    if (createData?.customers?.length) {
      form.setValue("customer", Number(createData.customers[0].id));
    }
  }, [createData, form]);

  async function onSubmit(values: CreateTicketFormValues) {
    try {
      const res = await storeTicket({ data: values });
      if (res?.success) {
        toast.success(t("ticketsCreate.toast.success"));
        router.navigate({ to: "/tickets" });
      } else {
        toast.error(t("ticketsCreate.toast.error"));
      }
    } catch (err) {
      toast.error(t("api.errors.something_went_wrong"));
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("ticketsCreate.title")}</h1>
        <Button variant="outline" onClick={() => router.navigate({ to: "/tickets" })}>
          {t("ticketsCreate.actions.backToList")}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TicketFormFields
            form={form}
            typeOptions={typeOptions}
            statusOptions={statusOptions}
            customerOptions={customerOptions}
            assigneeOptions={assigneeOptions}
            t={t}
          />

          <DynamicTicketFields
            form={form}
            selectedType={selectedType}
            configs={TYPE_FIELD_CONFIGS}
            t={t}
          />

          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? t("common.saving") : t("ticketsCreate.actions.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
