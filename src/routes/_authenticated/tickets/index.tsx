import { createFileRoute } from "@tanstack/react-router";
import TicketsList from "@/components/tickets-list";

export const Route = createFileRoute("/_authenticated/tickets/")({
  component: TicketsList,
});
