import { createFileRoute } from "@tanstack/react-router";
import CreateTicketPage from "@/components/create-ticket/CreateTicketPage";

export const Route = createFileRoute("/_authenticated/tickets/create")({
  component: CreateTicketPage,
});
