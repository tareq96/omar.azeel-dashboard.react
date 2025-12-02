import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailsPage } from "@/components/customer-details";
import { z } from "zod";

const customerSearchSchema = z.object({
  edit: z.boolean().optional().catch(false),
});

export const Route = createFileRoute("/_authenticated/customers/$customerId")({
  component: CustomerDetailsPage,
  validateSearch: customerSearchSchema,
});
