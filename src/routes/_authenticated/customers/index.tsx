import { createFileRoute } from "@tanstack/react-router";
import CustomersList from "@/components/customers-list";

export const Route = createFileRoute("/_authenticated/customers/")({
  component: CustomersList,
});
