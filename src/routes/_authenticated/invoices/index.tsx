import { createFileRoute } from "@tanstack/react-router";
import InvoicesList from "@/components/invoices-list";

export const Route = createFileRoute("/_authenticated/invoices/")({
  component: InvoicesList,
});
