import { createFileRoute } from "@tanstack/react-router";
import AddressesList from "@/components/addresses-list";

export const Route = createFileRoute("/_authenticated/addresses/")({
  component: AddressesList,
});
